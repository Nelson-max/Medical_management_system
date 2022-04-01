const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    code: {
      type: String
    },
    desc: {
      type: String,
      default: ''
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
