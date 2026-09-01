const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows/Local ISP DNS issues with mongodb+srv SRV records
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Global caching for Vercel Serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log('MongoDB is already connected (cached)');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log('MongoDB Connected to estate_us database');
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;
