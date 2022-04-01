const mongoose = require('mongoose');
const debug = require('debug')('log');
const User = require('../models/user.model');

const admin = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    debug(req.user);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }

    if (role !== 'superAdmin') {
      return res.status(401).json('User Unauthorized');
    }

    const user = await User.find();

    if (!user) {
      return res.status(401).json('User Not Found!');
    }
    res.status(200).json(user);
  } catch (error) {
    debug(error);
    next(error.message);
  }
};

module.exports = {
  admin
};
