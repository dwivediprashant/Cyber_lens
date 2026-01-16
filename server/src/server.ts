import "dotenv/config";
import app from "./app";
import { testConnection } from "./db";
import { runMigrations } from "./db/migrate";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await testConnection();
    console.log("Database connection successful");
    
    // Run migrations automatically on startup
    await runMigrations();
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
  
  const server = app.listen(Number(PORT), () => {
    console.log(`Server listening on port ${PORT}`);
  });
  
  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} is already in use`);
    } else {
      console.error("❌ Server error:", err);
    }
    process.exit(1);
  });
}

startServer();
