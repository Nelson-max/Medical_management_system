const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
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
      type: String
    },
    phoneNumber: {
      type: String
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
      default: 'user',
      enum: ['user', 'manager', 'admin', 'superAdmin']
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isActivated: {
      type: Boolean,
      default: false
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
      ref: 'User'
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
