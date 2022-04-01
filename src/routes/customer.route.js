const router = require('express').Router();
const passport = require('passport');

const ensureAuth = passport.authenticate('jwt', { session: false });

const {
  addCustomer,
  getOneCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  verifyEmail
} = require('../controllers/customer.controller');

router.post('/add', ensureAuth, addCustomer);
router.get('/', ensureAuth, getAllCustomers);
router.get('/:id', ensureAuth, getOneCustomer);
router.put('/update/:id', ensureAuth, updateCustomer);
router.delete('/delete/:id', ensureAuth, deleteCustomer);
router.get('/verify/:token', verifyEmail);

module.exports = router;
