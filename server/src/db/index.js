import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    // If URI already contains a database name, respect it
    const hasDb = /\/[^/]+$/.test(uri);
    if (!hasDb) {
      const { DB_NAME } = await import('../constants.js');
      uri = `${uri}/${DB_NAME}`;
    }

    const connectionInstance = await mongoose.connect(uri);
    console.log(`Connected to MongoDB at ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    console.warn('Proceeding without MongoDB connection (development/demo mode). Some features will be disabled.');
    // Do not exit the process in dev/demo; allow the server to run with degraded functionality.
    return;
  }
};

export default connectDB;
