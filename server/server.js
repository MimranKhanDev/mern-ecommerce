// server/server.js
import app from "./app.js";
import mongoose from "mongoose";
import databaseConnection from "./src/config/database.js";

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

let server;
let isShuttingDown = false;

const gracefulShutdown = async (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(
    `\n⚠️  ${signal} signal received: Closing HTTP server & Database connections...`,
  );
  if (!server) {
    process.exit(0);
  }
  server.close(async (err) => {
    if (err) {
      console.error("❌ Error closing HTTP server:", err);
    } else {
      console.log("🔒 HTTP server closed.");
    }
    try {
      await mongoose.connection.close();
      console.log("Mongoose connection closed cleanly.");
      process.exit(err ? 1 : 0);
    } catch (closeError) {
      console.error("❌ Error closing Mongoose connection:", closeError);
      process.exit(1);
    }
  });
};

const startServer = async () => {
  try {
    await databaseConnection();
    server = app.listen(PORT, () => {
      const url = `http://localhost:${PORT}`;
      console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
      console.log(`Server URL: ${url}`);
      console.log(
        `📡 CORS Client URL configured for: ${process.env.CLIENT_URL || "http://localhost:5173"}`,
      );
    });
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server due to DB connection failure.");
    process.exit(1); // Controlled termination at the app entry level
  }
};

startServer();
