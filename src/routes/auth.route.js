const router = require('express').Router();

const {
  register,
  login,
  verifyEmail,
  forgetPassword,
  resetPassword
} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.post('/forget-password', forgetPassword);
router.put('/reset/:token', resetPassword);

module.exports = router;
