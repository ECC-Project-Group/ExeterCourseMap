// utils/dbConnect.js
import mongoose from 'mongoose';

const uri = process.env.DATABASE_URL;

async function dbConnect() {
  if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local');
  }

  if (mongoose.connection.readyState >= 1) {
    // if connection is open return the instance of the database for cleaner queries
    return mongoose.connection.db;
  }

  return mongoose.connect(uri);
}

export default dbConnect;
