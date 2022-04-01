const mongoose = require('mongoose');
const debug = require('debug')('log');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Supplier = require('../models/supplier.model');
const sendEmail = require('../services/email.service');
const emailTemplate = require('../services/template/sendMail');
const { issueJWT } = require('../helpers/issuejwt.helper');

const addSupplier = async (req, res, next) => {
  try {
    const { name, email, phoneNumber } = req.body;
    const user_id = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(403).json('Invalid id!');
    }

    const isExists = await Supplier.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }]
    });

    if (isExists) {
      return res.status(403).json({
        message: 'Supplier already exists!'
      });
    }

    const newSuplier = new Supplier({
      name,
      email,
      phoneNumber,
      addedBy: user_id
    });

    const saveSupplier = await newSuplier.save().catch(err => {
      res.status(500).json(err.message);
    });

    if (saveSupplier) {
      const token = issueJWT(saveSupplier);
      const subject = 'Verify email for Medical store management system';
      // const TokenArray = token.token.split(' ');
      // const tokenValue = TokenArray[1];
      const tokenValue = token.token;
      sendEmail(
        emailTemplate(
          `${process.env.VERIFY_SUPPLIER_URL}/${tokenValue}`,
          saveSupplier.name
        ),
        subject,
        saveSupplier.email
      );
      res.status(200).json({
        message: 'Suplier Added Successfully!'
      });
    }
  } catch (erro) {
    debug(erro);
    next(erro.message);
  }
};

const getOneSupplier = async (req, res, next) => {
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

    const supplier = await Supplier.findById(id)
      .select('-password')
      .populate('addedBy', ['name', 'role']);

    res.status(200).json(supplier);
  } catch (error) {
    debug(error);
    next(error.message);
  }
};

const getAllSuppliers = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(403).json('Invalid id!');
    }

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(401).json('Wrong credentials!');
    }

    const suppliers = await Supplier.find().select('-password');

    res.status(200).json(suppliers);
  } catch (error) {
    debug(error);
    next(error.message);
  }
};

//UPDATE
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplierData = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      {
        $set: supplierData
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: 'Supplier Added Successfully!', updatedSupplier });
  } catch (err) {
    res.status(500).json(err);
  }
};

//DELETE
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    await Supplier.findByIdAndDelete(id);
    res.status(200).json('Customer has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decodeToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const userToVerify = await Supplier.findById(decodeToken.sub);
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
  addSupplier,
  getOneSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
  verifyEmail
};
