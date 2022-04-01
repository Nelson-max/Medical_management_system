const router = require('express').Router();
const passport = require('passport');

const ensureAuth = passport.authenticate('jwt', { session: false });

const { admin } = require('../controllers/admin.controller');

router.get('/', ensureAuth, admin);

module.exports = router;
