const router = require('express').Router();
const passport = require('passport');

const ensureAuth = passport.authenticate('jwt', { session: false });

const { createOrder } = require('../controllers/checkout.controller');

router.post('/add', ensureAuth, createOrder);

module.exports = router;
