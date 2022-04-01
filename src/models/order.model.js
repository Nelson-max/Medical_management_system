const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        quantity: {
          type: Number,
          default: 1
        }
      }
    ],
    amount: {
      type: Number,
      required: true
    },
    address: {
      type: Object
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['unpaid', 'pending', 'paid', 'canceled']
    }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
