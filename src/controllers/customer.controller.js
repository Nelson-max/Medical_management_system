const mongoose = require('mongoose');
const debug = require('debug')('log');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Customer = require('../models/customer.model');
const sendEmail = require('../services/email.service');
const emailTemplate = require('../services/template/sendMail');
const { issueJWT } = require('../helpers/issuejwt.helper');

const addCustomer = async (req, res, next) => {
  try {
    const { name, email, phoneNumber } = req.body;
    const user_id = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(403).json('Invalid id!');
    }

    const isExists = await Customer.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }]
    });

    if (isExists) {
      return res.status(403).json({
        message: 'Customer already exists!'
      });
    }

    const newCustomer = new Customer({
      name,
      email,
      phoneNumber,
      addedBy: user_id
    });

    const saveCustomer = await newCustomer.save().catch(err => {
      res.status(500).json(err.message);
    });

    if (saveCustomer) {
      const token = issueJWT(saveCustomer);
      const subject = 'Verify email for Medical store management system';
      // const TokenArray = token.token.split(' ');
      // const tokenValue = TokenArray[1];
      const tokenValue = token.token;
      sendEmail(
        emailTemplate(
          `${process.env.VERIFY_CUSTOMER_URL}/${tokenValue}`,
          saveCustomer.name
        ),
        subject,
        saveCustomer.email
      );
      res.status(200).json({
        message: 'Customer Added Successfully!'
      });
    }
  } catch (erro) {
    debug(erro);
    next(erro.message);
  }
};

const getOneCustomer = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(403).json('Invalid id!');
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(401).json('Wrong credentials!');
    }

    const customer = await Customer.findById(id)
      .select('-password')
      .populate('addedBy', ['name', 'role']);

    res.status(200).json(customer);
  } catch (error) {
    debug(error);
    next(error.message);
  }
};

const getAllCustomers = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(403).json('Invalid id!');
    }

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(401).json('Wrong credentials!');
    }

    const customers = await Customer.find().select('-password');

    res.status(200).json(customers);
  } catch (error) {
    debug(error);
    next(error.message);
  }
};

//UPDATE
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customerData = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        $set: customerData
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: 'Customer Added Successfully!', updatedCustomer });
  } catch (err) {
    res.status(500).json(err);
  }
};

//DELETE
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    await Customer.findByIdAndDelete(id);
    res.status(200).json('Customer has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decodeToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const userToVerify = await Customer.findById(decodeToken.sub);
    if (!userToVerify)
      return res.status(404).json({ error: 'Account not found' });
    if (userToVerify.emailVerified)
      return res.status(404).json({ error: 'Account is Already verified' });
    userToVerify.set({
      emailVerified: true
    });
    await userToVerify.save();
    const message = 'Account was succesfully verified';
    res.status(200).json({
      message: message
    });
  } catch (error) {
    debug(error);
    next(error.message);
  }
};

module.exports = {
  addCustomer,
  getOneCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  verifyEmail
};
