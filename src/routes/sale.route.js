const router = require('express').Router();
const passport = require('passport');

const ensureAuth = passport.authenticate('jwt', { session: false });

const {
  addSale,
  getAllSales,
  getOneSale,
  getAllSalesByUserId,
  updateSale,
  deleteSale,
  getMonthlySalesStats
} = require('../controllers/sale.controller');

router.post('/add', ensureAuth, addSale);
router.get('/', ensureAuth, getAllSales);
router.get('/:id', ensureAuth, getOneSale);
router.get('/find/:userId', ensureAuth, getAllSalesByUserId);
router.put('/update/:id', ensureAuth, updateSale);
router.delete('/delete/:id', ensureAuth, deleteSale);
router.get('/income', ensureAuth, getMonthlySalesStats);

module.exports = router;
