const mongoose = require('mongoose');
// const debug = require('debug')('log');
const Cart = require('../models/cart.model');

//CREATE and UPDATE Cart
const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user_id = req.user.id;
    let newCart;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(403).json('Invalid id!');
    }

    const cartExists = await Cart.findById({
      _id: user_id
    });

    if (!cartExists) {
      newCart = await Cart.findByIdAndUpdate(
        { _id: user_id },
        {
          $set: {
            userId: user_id,
            products: {
              productId: productId,
              quantity: quantity,
              _id: productId
            }
          }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    } else {
      const productExists = await Cart.findOne({
        'products.productId': productId
      });
      if (productExists) {
        productExists.products = productExists.products.filter(
          item => item._id.toString() !== productId
        );
        await productExists.save();
        newCart = await Cart.findByIdAndUpdate(
          { _id: user_id },
          {
            $push: {
              products: {
                productId: productId,
                quantity: quantity,
                _id: productId
              }
            }
          },
          { new: true }
        );
      } else {
        newCart = await Cart.findByIdAndUpdate(
          { _id: user_id },
          {
            $push: {
              products: {
                productId: productId,
                quantity: quantity,
                _id: productId
              }
            }
          },
          { new: true }
        );
      }
    }

    const savedCart = await newCart.save();
    res.status(200).json({
      success: true,
      message: 'Cart Created Successfully',
      savedCart
    });
  } catch (err) {
    res.status(200).json(err.message);
  }
};

//GET Cart By User ID
const getCurrentCart = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(403).json('Invalid id!');
    }
    const cart = await Cart.findOne({ userId: userId }).populate(
      'products.productId',
      ['medecineName', 'price', 'mfDate', 'expDate', 'stock', 'inStock', '_id']
    );
    if (!cart) {
      return res.status(401).json('Cart Not Found!');
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//GET Cart
const getOneCart = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    const cart = await Cart.findById(id).populate('products.productId', [
      'medecineName',
      'price',
      'mfDate',
      'expDate',
      'stock',
      'inStock',
      '_id'
    ]);
    if (!cart) {
      return res.status(401).json('Cart Not Found!');
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//GET Cart By User ID
const getOneCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(403).json('Invalid id!');
    }
    const cart = await Cart.findOne({ userId: userId }).populate(
      'products.productId',
      ['medicineName', 'price', 'mfDate', 'expDate', 'stock', 'inStock', '_id']
    );
    if (!cart) {
      return res.status(401).json('Cart Not Found!');
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//GET ALL Carts
const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate('products.productId', [
      'medicineName',
      'price',
      'mfDate',
      'expDate',
      'stock',
      'inStock',
      '_id'
    ]);
    if (!carts) {
      return res.status(401).json('No Cart was Found!');
    }

    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(403).json('Invalid id!');
    }
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(403).json('Invalid id!');
    }

    const foundCart = await Cart.findOne({ userId: user_id });
    if (!foundCart) {
      return res.status(401).json('No Cart was Found!');
    }

    foundCart.products = foundCart.products.filter(
      item => item._id.toString() !== itemId
    );

    const updatedCart = await foundCart.save();
    res.status(200).json({
      message: 'Item Deleted Successfully',
      updatedCart
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

//DELETE
const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    await Cart.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Cart has been deleted...'
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  addItemToCart,
  getAllCarts,
  getCurrentCart,
  getOneCart,
  getOneCartByUserId,
  removeItemFromCart,
  deleteCart
};
