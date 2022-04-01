const router = require('express').Router();

const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const adminRoute = require('./admin.route');
const managerRoute = require('./manager.route');
const customerRoute = require('./customer.route');
const supplierRoute = require('./supplier.route');
const productRoute = require('./product.route');
const stockRoute = require('./stock.route');
const categoryRoute = require('./category.route');
const cartRoute = require('./cart.route');
const checkoutRoute = require('./checkout.route');
const orderRoute = require('./order.route');

router.get('/', (req, res) => {
  res.json('The Medical Store Management System API');
});

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/admin', adminRoute);
router.use('/manager', managerRoute);
router.use('/customer', customerRoute);
router.use('/supplier', supplierRoute);
router.use('/product', productRoute);
router.use('/stock', stockRoute);
router.use('/category', categoryRoute);
router.use('/cart', cartRoute);
router.use('/checkout', checkoutRoute);
router.use('/order', orderRoute);

module.exports = router;
