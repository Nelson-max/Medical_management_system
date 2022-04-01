const mongoose = require('mongoose');
const Category = require('../models/category.model');

//ADD Category
const addCategory = async (req, res) => {
  try {
    const { name, code, desc } = req.body;
    const { id } = req.user;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }

    const newCategory = new Category({
      name,
      code,
      desc,
      addedBy: id
    });
    const savedCategory = await newCategory.save();
    res.status(200).json({
      success: true,
      message: 'Category Added Successfully',
      savedCategory
    });
  } catch (err) {
    res.status(200).json(err.message);
  }
};

//GET Category
const getOneCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    const category = await Category.findById(id);
    if (!category) {
      return res.status(401).json('Category Not Found!');
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//GET All CategorieS
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories) {
      return res.status(401).json('No Category was Found!');
    }

    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
};

//UPDATE Category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        $set: categoryData
      },
      { new: true }
    );
    if (!updateCategory) {
      return res.status(401).json('No Category was Found!');
    }
    res.status(200).json({
      success: true,
      message: 'Category Updated Successfully',
      updatedCategory
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//DELETE Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    await Category.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Category has been deleted...'
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  getOneCategory,
  updateCategory,
  deleteCategory
};
