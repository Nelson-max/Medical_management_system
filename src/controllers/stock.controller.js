const mongoose = require('mongoose');
// const debug = require('debug')('log');
const Product = require('../models/product.model');

//GET STOCK
const getOneStock = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(401).json('Product Not Found!');
    }
    const stock = {
      id: product._id,
      name: product.medicineName,
      price: product.price,
      stock: product.stock,
      inStock: product.inStock
    };
    res.status(200).json(stock);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//GET ALL STOCKS
const getAllStocks = async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('category', ['name', 'code', 'desc', '_id'])
        .populate('addedBy', ['name', 'username', 'role', '_id']);
    } else if (qCategory) {
      products = await Product.find({ category: qCategory })
        .sort({ createdAt: -1 })
        .populate('category', ['name', 'code', 'desc', '_id'])
        .populate('addedBy', ['name', 'username', 'role', '_id']);
    } else {
      products = await Product.find()
        .sort({ createdAt: -1 })
        .populate('category', ['name', 'code', 'desc', '_id'])
        .populate('addedBy', ['name', 'username', 'role', '_id']);
    }

    if (!products) {
      return res.status(401).json('No Product was Found!');
    }

    const stocks = [];

    products.filter(product =>
      stocks.push({
        id: product._id,
        name: product.medicineName,
        image: product.image,
        price: product.price,
        stock: product.stock,
        inStock: product.inStock
      })
    );

    res.status(200).json(stocks);
  } catch (err) {
    res.status(500).json(err);
  }
};

//UPDATE
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, inStock } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    const updatedStock = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          stock,
          inStock
        }
      },
      { new: true }
    );
    if (!updateStock) {
      return res.status(401).json('No Stock was Found!');
    }
    res.status(200).json({
      success: true,
      message: 'Stock Updated Successfully',
      updatedStock
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  getAllStocks,
  getOneStock,
  updateStock
};
