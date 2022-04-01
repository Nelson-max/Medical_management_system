const router = require('express').Router();
const passport = require('passport');

const ensureAuth = passport.authenticate('jwt', { session: false });

const {
  addSupplier,
  getOneSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
  verifyEmail
} = require('../controllers/supplier.controller');

router.post('/add', ensureAuth, addSupplier);
router.get('/', ensureAuth, getAllSuppliers);
router.get('/:id', ensureAuth, getOneSupplier);
router.put('/update/:id', ensureAuth, updateSupplier);
router.delete('/delete/:id', ensureAuth, deleteSupplier);
router.get('/verify/:token', verifyEmail);

module.exports = router;
