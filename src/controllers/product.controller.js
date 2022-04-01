const mongoose = require('mongoose');
const debug = require('debug')('log');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const productValidator = require('../helpers/validations/products.validation');
const cloudinary = require('../config/cloudinary.config');

const addProductWithImage = async (req, res) => {
  const { error } = productValidator(req.body);
  if (error) {
    res.status(400).json({
      message: error.details[0].message
    });
    return false;
  }

  //Add product
  try {
    const {
      medicineName,
      genericName,
      code,
      category,
      description,
      manufacturer,
      purchasePrice,
      salePrice,
      stock,
      mfdate,
      expdate
    } = req.body;

    const user_id = req.user.id;
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    debug(result);

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(403).json('Invalid id!');
    }

    const categoryExists = await Category.findOne({
      $or: [{ name: category }, { code: category }, { id: category }]
    });

    if (!categoryExists) {
      return res.status(403).json({
        message: 'Category Not Found!'
      });
    }
    const productExists = await Product.findOne({
      $or: [{ code: code }, { medicineName: medicineName }]
    });

    if (productExists) {
      return res.status(403).json({
        message: 'Product already exists!'
      });
    }

    const newProduct = new Product({
      medicineName,
      genericName,
      code,
      image: result.secure_url,
      category: categoryExists.id,
      description,
      manufacturer,
      purchasePrice,
      salePrice,
      price: salePrice,
      stock,
      inStock: true,
      mfdate,
      expdate,
      addedBy: user_id
    });
    const savedProduct = await newProduct.save();
    res.status(200).json({
      success: true,
      message: 'Product Added Successfully',
      savedProduct
    });
  } catch (err) {
    res.status(200).json(err.message);
  }
};
//GET PRODUCT
const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(401).json('Product Not Found!');
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
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

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

//FILTER PRODUCTS
const filterProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate('category', ['name', 'code', 'desc', '_id'])
      .populate('addedBy', ['name', 'username', 'role', '_id']);
    if (!products) {
      return res.status(401).json('No Product was Found!');
    }
    const filters = req.query;
    const filteredProducts = products.filter(product => {
      let isValid = true;
      Object.keys(filters).forEach(key => {
        isValid = isValid && product[key] === filters[key];
      });
      return isValid;
    });

    res.status(200).json(filteredProducts);
  } catch (err) {
    res.status(500).json(err);
  }
};

//SEARCH FOR PRODUCTS
const searchForProducts = async (req, res) => {
  try {
    const { product } = req.query;
    let products;

    if (product) {
      products = await Product.find({
        $or: [
          { code: { $regex: product } },
          { medicineName: { $regex: product } },
          { genericName: { $regex: product } },
          { description: { $regex: product } },
          { manufacturer: { $regex: product } }
        ]
      })
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
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

//UPDATE
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      medicineName,
      genericName,
      code,
      category,
      description,
      manufacturer,
      purchasePrice,
      salePrice,
      stock,
      mfdate,
      expdate
    } = req.body;

    const categoryExists = await Category.findOne({
      $or: [{ name: category }, { code: category }, { _id: category }]
    });

    if (!categoryExists) {
      return res.status(403).json({
        message: 'Category Not Found!'
      });
    }

    // const productExists = await Product.findOne({
    //   $or: [{ code: code }, { medicineName: medicineName }]
    // });

    // if (productExists) {
    //   return res.status(403).json({
    //     message: 'Product already exists!'
    //   });
    // }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          medicineName,
          genericName,
          code,
          category,
          description,
          manufacturer,
          purchasePrice,
          salePrice,
          stock,
          mfdate,
          expdate
        }
      },
      { new: true }
    );
    if (!updateProduct) {
      return res.status(401).json('No Product was Found!');
    }
    res.status(200).json({
      success: true,
      message: 'Product Updated Successfully',
      updatedProduct
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//DELETE
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    await Product.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Product has been deleted...'
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  addProductWithImage,
  getAllProducts,
  filterProducts,
  searchForProducts,
  getOneProduct,
  updateProduct,
  deleteProduct
};
