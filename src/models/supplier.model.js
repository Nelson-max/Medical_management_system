const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    username: {
      type: String
    },
    email: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    password: {
      type: String
    },
    birthDate: {
      type: String
    },
    gender: {
      type: String
    },
    avatar: {
      type: String
    },
    address: {
      type: String
    },
    bio: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      default: 'business',
      enum: ['business', 'enterprise', 'corporation']
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    phoneVerified: {
      type: Boolean,
      default: false
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const Supplier = mongoose.model('Supplier', supplierSchema);
module.exports = Supplier;
