const mongoose = require('mongoose');
const Order = require('../models/order.model');

//CREATE Order
const createOrder = async (req, res) => {
  try {
    const { productId, quantity, amount, address } = req.body;

    const sellerId = req.user.id;
    const buyerId = req.params;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(403).json('Invalid id!');
    }
    if (!mongoose.Types.ObjectId.isValid(buyerId)) {
      return res.status(403).json('Invalid id!');
    }

    const newOrder = new Order({
      sellerId,
      buyerId,
      amount,
      address,
      products: [productId, quantity]
    });
    const savedOrder = await newOrder.save();
    res.status(200).json({
      success: true,
      message: 'Cart Created Successfully',
      savedOrder
    });
  } catch (err) {
    res.status(200).json(err.message);
  }
};

//GET Order
const getOneOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    const order = await Order.findById(id);
    if (!order) {
      return res.status(401).json('Order Not Found!');
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//GET Order By Seller ID
const getOneOrderBySellerId = async (req, res) => {
  try {
    const { sellerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(403).json('Invalid id!');
    }
    const order = await Order.findOne({ sellerId: sellerId });
    if (!order) {
      return res.status(401).json('Order Not Found!');
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//GET Order By Buyer ID
const getOneOrderByBuyerId = async (req, res) => {
  try {
    const { buyerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(buyerId)) {
      return res.status(403).json('Invalid id!');
    }
    const order = await Order.findOne({ buyerId: buyerId });
    if (!order) {
      return res.status(401).json('Order Not Found!');
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//GET Order By User ID
const getAllOrdersBySellerId = async (req, res) => {
  try {
    const sellerId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(403).json('Invalid id!');
    }
    const order = await Order.find({ sellerId: sellerId })
      .populate('sellerId', ['name', 'username', 'email', 'role', '_id'])
      .populate('buyerId', ['name', 'username', 'email', 'role', '_id']);
    if (!order) {
      return res.status(401).json('Order Not Found!');
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//GET Order By Buyer ID
const getAllOrdersByBuyerId = async (req, res) => {
  try {
    const { buyerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(buyerId)) {
      return res.status(403).json('Invalid id!');
    }
    const order = await Order.find({ buyerId: buyerId })
      .populate('sellerId', ['name', 'username', 'email', 'role', '_id'])
      .populate('buyerId', ['name', 'username', 'email', 'role', '_id']);
    if (!order) {
      return res.status(401).json('Order Not Found!');
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//GET ALL Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('products.productId', [
        'name',
        'price',
        'mfDate',
        'expDate',
        'inStock',
        '_id'
      ])
      .populate('sellerId', ['name', 'username', 'email', 'role', '_id'])
      .populate('buyerId', ['name', 'username', 'email', 'role', '_id']);
    if (!orders) {
      return res.status(401).json('No Order was Found!');
    }

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};

//UPDATE
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const orderData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        $set: orderData
      },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(401).json('No Order was Found!');
    }
    res.status(200).json({
      success: true,
      message: 'Order Updated Successfully',
      updatedOrder
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//DELETE
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    await Order.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Order has been deleted...'
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// GET MONTHLY INCOME
const getMonthlyIncomeStats = async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } }
          })
        }
      },
      {
        $project: {
          month: { $month: '$createdAt' },
          sales: '$amount'
        }
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: '$sales' }
        }
      }
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getAllOrdersBySellerId,
  getAllOrdersByBuyerId,
  getOneOrder,
  getOneOrderBySellerId,
  getOneOrderByBuyerId,
  updateOrder,
  deleteOrder,
  getMonthlyIncomeStats
};
