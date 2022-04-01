const router = require('express').Router();
const passport = require('passport');

const ensureAuth = passport.authenticate('jwt', { session: false });

const {
  getAllOrders,
  getOneOrder,
  getAllOrdersBySellerId,
  getAllOrdersByBuyerId,
  updateOrder,
  deleteOrder,
  getMonthlyIncomeStats
} = require('../controllers/order.controller');

router.get('/', ensureAuth, getAllOrders);
router.get('/:id', ensureAuth, getOneOrder);
router.get('/find/seller/:sellerId', ensureAuth, getAllOrdersBySellerId);
router.get('/find/buyer/:buyerId', ensureAuth, getAllOrdersByBuyerId);
router.put('/update/:id', ensureAuth, updateOrder);
router.delete('/delete/:id', ensureAuth, deleteOrder);
router.get('/income', ensureAuth, getMonthlyIncomeStats);

module.exports = router;
