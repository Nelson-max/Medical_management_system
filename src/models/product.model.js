const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: true
    },
    genericName: {
      type: String
    },
    code: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      require: true
    },
    description: {
      type: String,
      default: ''
    },
    purchasePrice: {
      type: Number,
      default: 0,
      require: true
    },
    salePrice: {
      type: Number,
      default: 0,
      require: true
    },
    price: {
      type: Number,
      default: 0,
      require: true
    },
    manufacturer: {
      type: String
    },
    mfdate: {
      type: Date
    },
    expdate: {
      type: Date,
      required: true
    },
    stock: {
      type: Number,
      default: 0
    },
    inStock: {
      type: Boolean,
      default: false
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier'
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
