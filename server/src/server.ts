import "dotenv/config";
import app from "./app";
import { testConnection } from "./db";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await testConnection();
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
  app.listen(Number(PORT), () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
