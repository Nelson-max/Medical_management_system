const debug = require('debug')('log');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const sendEmail = require('../services/email.service');
const emailTemplate = require('../services/template/sendMail');
const passwordTemplate = require('../services/template/passwordTemplate');

const {
  hashPassword,
  verifyPassword
} = require('../helpers/hashpassword.helper');

const { issueJWT } = require('../helpers/issuejwt.helper');
const user = require('../helpers/validations/users.validation');

const register = async (req, res, next) => {
  const { error } = user(req.body);
  if (error) {
    res.status(400).json({
      message: error.details[0].message
    });
    return false;
  }

  try {
    const { name, email, username, phoneNumber, password, confirmPassword } =
      req.body;
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

    if (password !== confirmPassword) {
      return res.status(403).json({
        message: 'Password does not match!'
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      email,
      username,
      phoneNumber,
      password: hashedPassword
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
        message: 'User registered successfully!'
      });
    }
  } catch (erro) {
    debug(erro);
    next(erro.message);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const isExists = await User.findOne({
      $or: [{ email: email }, { username: email }, { phoneNumber: email }]
    });

    if (!isExists) {
      return res.status(401).json({
        message: 'Wrong credentials!'
      });
    }

    const isMatch = await verifyPassword(password, isExists.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Wrong credentials!'
      });
    }

    if (!isExists.emailVerified) {
      return res.status(401).json({
        message: 'Verify your account first from the email we sent you!'
      });
    }

    // if (!isExists.isActivated) {
    //   return res.status(401).json({
    //     message: 'Account not Activated, please contact the Admin!'
    //   });
    // }

    const tokenObject = issueJWT(isExists);
    const access_token = 'access_token';
    res.cookie(`${access_token}`, tokenObject.token, {
      httpOnly: true
    });
    res.status(200).json({
      success: true,
      message: 'User logged In Successfully',
      token: tokenObject.token,
      expiresIn: tokenObject.expires,
      data: isExists
    });
  } catch (error) {
    debug(error);
    next(error.message);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decodeToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const userToVerify = await User.findById(decodeToken.sub);
    if (!userToVerify)
      return res.status(404).json({ error: 'Account not found' });
    if (userToVerify.emailVerified)
      // return res
      //   .status(404)
      //   .json({ error: 'Account is Already verified, you can Login' });
      return res.status(404).redirect(process.env.VERIFY_SUCCESS);
    userToVerify.set({
      emailVerified: true
    });
    await userToVerify.save();
    res.status(200).redirect(process.env.VERIFY_SUCCESS);
    // res.status(200).json({
    //   message: 'Account was succesfully verified'
    // });
  } catch (error) {
    debug(error);
    next(error.message);
  }
};

const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const isExists = await User.findOne({ email: email });
    if (!isExists) return res.status(404).json({ error: 'Account not found' });
    const token = issueJWT(isExists);
    // const TokenArray = token.token.split(' ');
    // const tokenValue = TokenArray[1];
    const tokenValue = token.token;
    const subject = 'Reset Password for Medical store management';
    sendEmail(passwordTemplate(tokenValue), subject, email);
    const message = `A reset Password link has been sent to your email please go and click the link.`;
    res.status(200).json({
      message: message
    });
  } catch (error) {
    debug(error);
    next(error.message);
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  try {
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(403).json({
        message: 'Password does not match!'
      });
    }
    const newPassword = await hashPassword(password);
    const decodeToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const userPassword = await User.findById(decodeToken.sub);
    const isMatch = await verifyPassword(password, userPassword.password);
    if (isMatch) {
      return res.status(403).json({
        message: 'Old Password not allowed!'
      });
    }
    userPassword.set({
      password: newPassword
    });
    await userPassword.save();
    const message = 'Password was succesfully changed';
    res.status(200).json({
      message: message
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgetPassword,
  resetPassword
};
