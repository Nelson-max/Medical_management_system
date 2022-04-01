const router = require('express').Router();
const passport = require('passport');

const ensureAuth = passport.authenticate('jwt', { session: false });

const {
  addItemToCart,
  getAllCarts,
  getCurrentCart,
  getOneCart,
  getOneCartByUserId,
  removeItemFromCart
} = require('../controllers/cart.controller');

router.post('/add', ensureAuth, addItemToCart);
router.get('/', ensureAuth, getAllCarts);
router.get('/find', ensureAuth, getCurrentCart);
router.get('/:id', ensureAuth, getOneCart);
router.get('/find/:userId', ensureAuth, getOneCartByUserId);
router.delete('/remove/:itemId', ensureAuth, removeItemFromCart);

module.exports = router;
