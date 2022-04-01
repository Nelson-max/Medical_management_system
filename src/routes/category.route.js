const router = require('express').Router();
const passport = require('passport');

const ensureAuth = passport.authenticate('jwt', { session: false });

const {
  addCategory,
  getAllCategories,
  getOneCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');

router.post('/add', ensureAuth, addCategory);
router.get('/', ensureAuth, getAllCategories);
router.get('/:id', ensureAuth, getOneCategory);
router.put('/update/:id', ensureAuth, updateCategory);
router.delete('/delete/:id', ensureAuth, deleteCategory);

module.exports = router;
