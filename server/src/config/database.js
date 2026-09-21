import mongoose from "mongoose";

const connectDB = async () => {
  const connectionString = process.env.MONGODB_URI;
  if (!connectionString) {
    console.error("[Database Error] MONGODB_URI is required.");
    throw new Error("MONGODB_URI is required.");
  }
  try {
    const connection = await mongoose.connect(connectionString);
    console.log(`[Database] MongoDB Connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    throw error;
  }
};
export default connectDB;
