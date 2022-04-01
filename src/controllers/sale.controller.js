const mongoose = require('mongoose');
const Order = require('../models/order.model');

//CREATE Sale
const addSale = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user_id = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(403).json('Invalid id!');
    }

    const exists = await Order.findOne({
      $or: [{ userId: user_id }]
    });

    if (exists) {
      return res.status(403).json({
        message: 'Order already exists!'
      });
    }

    const newOrder = new Order({
      userId: user_id,
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

//GET Sale
const getOneSale = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    const order = await Order.findById(id);
    if (!order) {
      return res.status(401).json('Sale Not Found!');
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//GET All Sales By User ID
const getAllSalesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(403).json('Invalid id!');
    }
    const cart = await Order.find({ userId: userId });
    if (!cart) {
      return res.status(401).json('Order Not Found!');
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//GET ALL Sales
const getAllSales = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.productId', [
      'name',
      'price',
      'mfDate',
      'expDate',
      'inStock',
      '_id'
    ]);
    if (!orders) {
      return res.status(401).json('No Order was Found!');
    }

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};

//UPDATE Sale
const updateSale = async (req, res) => {
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
const deleteSale = async (req, res) => {
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
const getMonthlySalesStats = async (req, res) => {
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
  addSale,
  getAllSales,
  getAllSalesByUserId,
  getOneSale,
  updateSale,
  deleteSale,
  getMonthlySalesStats
};
