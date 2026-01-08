import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:
    process.env.SSL_MODE === "require" ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function testConnection(): Promise<void> {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL connected successfully");
    client.release();
  } catch (error) {
    console.error("PostgreSQL connection failed:", error);
    throw error;
  }
}

export default pool;
export { testConnection };
