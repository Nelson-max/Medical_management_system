const router = require('express').Router();
// const debug = require('debug')('log');
const passport = require('passport');
const upload = require('../helpers/multer.helper');

const ensureAuth = passport.authenticate('jwt', { session: false });

const {
  addProductWithImage,
  getAllProducts,
  filterProducts,
  searchForProducts,
  getOneProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');

router.post('/add', ensureAuth, upload.single('image'), addProductWithImage);
router.get('/', ensureAuth, getAllProducts);
router.get('/filter/', ensureAuth, filterProducts);
router.get('/search/', ensureAuth, searchForProducts);
router.get('/:id', ensureAuth, getOneProduct);
router.put('/update/:id', ensureAuth, updateProduct);
router.delete('/delete/:id', ensureAuth, deleteProduct);

module.exports = router;
