const router = require('express').Router();
// const debug = require('debug')('log');
const passport = require('passport');

const ensureAuth = passport.authenticate('jwt', { session: false });

const {
  getAllStocks,
  getOneStock,
  updateStock
} = require('../controllers/stock.controller');

router.get('/', ensureAuth, getAllStocks);
router.get('/:id', ensureAuth, getOneStock);
router.put('/update/:id', ensureAuth, updateStock);

module.exports = router;
