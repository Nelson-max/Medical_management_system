const mongoose = require('mongoose');
const debug = require('debug')('log');

const db =
  process.env.NODE_ENV !== 'test'
    ? process.env.MONGODB_URL
    : process.env.DB_TEST;

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    debug(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    debug(error.message);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
