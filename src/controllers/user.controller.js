const mongoose = require('mongoose');
const debug = require('debug')('log');
const User = require('../models/user.model');

const getCurrentUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(401).json('User Not Found!');
    }

    res.status(200).json(user);
  } catch (error) {
    debug(error);
    next(error.message);
  }
};

//UPDATE
const updateCurrentUser = async (req, res) => {
  try {
    const { id } = req.user;
    const userData = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: userData
      },
      { new: true }
    );
    res.status(200).json({ message: 'User Added Successfully!', updatedUser });
  } catch (err) {
    res.status(500).json(err);
  }
};

//DELETE
const deleteCurrentUser = async (req, res) => {
  try {
    const { id } = req.user;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    await User.findByIdAndDelete(id);
    res.status(200).json('User has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    const access_token = 'access_token';
    res.clearCookie(`${access_token}`);
    debug('I managed to get here!');
    res.json({
      success: true,
      message: 'User logged Out Successfully'
    });
  } catch (error) {
    debug(error);
    next(error.message);
  }
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  logout
};
