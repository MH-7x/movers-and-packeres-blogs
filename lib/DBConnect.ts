import mongoose from "mongoose";

let isConnected = 0;
/**
 * Establishes a connection to the MongoDB database. If a connection already
 * exists, it uses the existing one. If there is no connection and the
 * MONGODB_URI environment variable is not defined, it throws an error.
 *
 * @returns {Promise<void>} A promise that resolves when the connection is
 * established or when using an existing connection.
 */

async function dbConnect(): Promise<void> {
  if (isConnected) {
    console.log("Already connected to the database");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  if (mongoose.connection.readyState) {
    isConnected = mongoose.connection.readyState;

    if (isConnected === 1) {
      console.log("Using existing database connection");
      return;
    }

    await mongoose.disconnect();
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = db.connections[0].readyState;

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);

    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    } else {
      throw new Error("Database connection error");
    }
  }
}

export default dbConnect;
