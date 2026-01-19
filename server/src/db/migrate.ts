import "dotenv/config";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import pool from "./index";

const MIGRATIONS_DIR = join(__dirname, "migrations");

interface MigrationFile {
  filename: string;
  number: number;
}

/**
 * Ensures the migrations tracking table exists
 */
async function ensureMigrationsTable(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
  } finally {
    client.release();
  }
}

/**
 * Gets list of all migration files sorted by number
 */
async function getMigrationFiles(): Promise<MigrationFile[]> {
  const files = await readdir(MIGRATIONS_DIR);
  
  return files
    .filter((file) => file.endsWith(".sql"))
    .map((file) => {
      const match = file.match(/^(\d+)_/);
      const number = match ? parseInt(match[1]!, 10) : 0;
      return { filename: file, number };
    })
    .sort((a, b) => a.number - b.number);
}

/**
 * Gets list of already executed migrations
 */
async function getExecutedMigrations(): Promise<Set<string>> {
  const client = await pool.connect();
  try {
    const result = await client.query<{ migration_name: string }>(
      "SELECT migration_name FROM schema_migrations"
    );
    return new Set(result.rows.map((row) => row.migration_name));
  } finally {
    client.release();
  }
}

/**
 * Marks a migration as executed
 */
async function markMigrationExecuted(migrationName: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(
      "INSERT INTO schema_migrations (migration_name) VALUES ($1) ON CONFLICT (migration_name) DO NOTHING",
      [migrationName]
    );
  } finally {
    client.release();
  }
}

/**
 * Executes a single migration file
 */
async function executeMigration(migrationFile: MigrationFile): Promise<void> {
  const client = await pool.connect();
  try {
    const filePath = join(MIGRATIONS_DIR, migrationFile.filename);
    const sql = await readFile(filePath, "utf-8");

    console.log(`Running migration: ${migrationFile.filename}`);
    
    await client.query("BEGIN");
    try {
      await client.query(sql);
      // Mark migration as executed within the same transaction
      await client.query(
        "INSERT INTO schema_migrations (migration_name) VALUES ($1) ON CONFLICT (migration_name) DO NOTHING",
        [migrationFile.filename]
      );
      await client.query("COMMIT");
      console.log(`✓ Migration ${migrationFile.filename} executed successfully`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  } finally {
    client.release();
  }
}

/**
 * Runs all pending migrations
 */
export async function runMigrations(): Promise<void> {
  try {
    console.log("Checking for database migrations...");
    
    await ensureMigrationsTable();
    
    const migrationFiles = await getMigrationFiles();
    const executedMigrations = await getExecutedMigrations();
    
    const pendingMigrations = migrationFiles.filter(
      (migration) => !executedMigrations.has(migration.filename)
    );

    if (pendingMigrations.length === 0) {
      console.log("✓ All migrations are up to date");
      return;
    }

    console.log(`Found ${pendingMigrations.length} pending migration(s)`);

    for (const migration of pendingMigrations) {
      await executeMigration(migration);
    }

    console.log("✓ All migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}
