const mongoose = require('mongoose');
const debug = require('debug')('log');
const Cart = require('../models/cart.model');
const Customer = require('../models/customer.model');
const Order = require('../models/order.model');

//CREATE Order
const createOrder = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, address } = req.body;

    const sellerId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(403).json('Invalid id!');
    }

    const updateCustomer = await Customer.findOneAndUpdate(
      { email: email },
      {
        $set: {
          firstName,
          lastName,
          name: `${firstName} ${firstName}`,
          address,
          phoneNumber,
          addedBy: sellerId
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    const updatedCustomer = await updateCustomer.save();
    const buyerId = updatedCustomer._id;

    const cart = await Cart.findOne({ userId: sellerId }).populate(
      'products.productId',
      ['medicineName', 'price', 'mfDate', 'expDate', 'stock', 'inStock', '_id']
    );
    if (!cart) {
      return res.status(401).json('Cart Not Found!');
    }
    // debug(cart);
    const { products } = cart;
    let totalPrice = 0;
    const items = [];

    products.forEach(item => {
      totalPrice += item.productId.price * item.quantity;
      debug(item);
      items.push(item);
    });

    const newOrder = new Order({
      sellerId,
      buyerId,
      amount: totalPrice,
      address,
      products: items
    });
    const savedOrder = await newOrder.save();
    await Cart.findByIdAndDelete(sellerId);
    res.status(200).json({
      success: true,
      message: 'Cart Created Successfully',
      savedOrder
    });
  } catch (err) {
    res.status(200).json(err.message);
  }
};

module.exports = {
  createOrder
};
