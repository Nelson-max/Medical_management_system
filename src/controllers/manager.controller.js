const mongoose = require('mongoose');
const debug = require('debug')('log');
const User = require('../models/user.model');
const sendEmail = require('../services/email.service');
const emailTemplate = require('../services/template/sendMail');
const { issueJWT } = require('../helpers/issuejwt.helper');

const addUser = async (req, res, next) => {
  try {
    const { name, username, email, phoneNumber } = req.body;
    const user_id = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(403).json('Invalid id!');
    }

    const isExists = await User.findOne({
      $or: [
        { email: email },
        { username: username },
        { phoneNumber: phoneNumber }
      ]
    });

    if (isExists) {
      return res.status(403).json({
        message: 'User already exists!'
      });
    }

    const newUser = new User({
      name,
      username,
      email,
      phoneNumber,
      addedBy: user_id
    });

    const saveUser = await newUser.save().catch(err => {
      res.status(500).json(err.message);
    });

    if (saveUser) {
      const token = issueJWT(saveUser);
      const subject = 'Verify email for Medical store management system';
      // const TokenArray = token.token.split(' ');
      // const tokenValue = TokenArray[1];
      const tokenValue = token.token;
      sendEmail(
        emailTemplate(`${process.env.VERIFY_URL}/${tokenValue}`, saveUser.name),
        subject,
        saveUser.email
      );
      res.status(200).json({
        message: 'User Added Successfully!'
      });
    }
  } catch (erro) {
    debug(erro);
    next(erro.message);
  }
};

const getOneUser = async (req, res, next) => {
  try {
    const { role } = req.user;
    const { id } = req.params;
    let user = {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }

    if (role === 'manager') {
      user = await User.findOne({ _id: id, role: 'user' }).select('-password');
    } else if (role === 'admin') {
      user = await User.findOne({
        _id: id,
        $or: [{ role: 'user' }, { role: 'manager' }]
      }).select('-password');
    } else if (role === 'superAdmin') {
      user = await User.findOne({ _id: id }).select('-password');
    } else {
      return res.status(401).json('User Unauthorized');
    }

    if (!user) {
      return res.status(401).json('User Not Found');
    }
    res.status(200).json(user);
  } catch (error) {
    debug(error);
    next(error.message);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    let user = {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }

    if (role === 'manager') {
      user = await User.find({ role: 'user' }).select('-password');
    } else if (role === 'admin') {
      user = await User.find({
        $or: [{ role: 'user' }, { role: 'manager' }]
      }).select('-password');
    } else if (role === 'superAdmin') {
      user = await User.find().select('-password');
    } else {
      return res.status(401).json('User Unauthorized');
    }

    if (!user) {
      return res.status(401).json('Users Not Found');
    }
    res.status(200).json(user);
  } catch (error) {
    debug(error);
    next(error.message);
  }
};

//UPDATE
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
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
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    await User.findByIdAndDelete(id);
    res.status(200).json('User has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
};

// const searchForUser = async (req, res) => {
//   const user_id = req.user.id;
//   // const filters = req.query;

//   if (!mongoose.Types.ObjectId.isValid(user_id)) {
//     return res.status(403).json('Invalid id!');
//   }

//   const filteredUsers = data.filter(user => {
//     let isValid = true;
//     for (key in filters) {
//       // debug(key, user[key], filters[key]);
//       isValid = isValid && user[key] == filters[key];
//     }
//     return isValid;
//   });
//   res.status(200).json(filteredUsers);
// };

module.exports = {
  addUser,
  getOneUser,
  getAllUsers,
  updateUser,
  deleteUser
};
