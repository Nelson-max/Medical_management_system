const router = require('express').Router();
const passport = require('passport');

const ensureAuth = passport.authenticate('jwt', { session: false });

const {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  logout
} = require('../controllers/user.controller');

router.get('/', ensureAuth, getCurrentUser);
router.put('/update/:id', ensureAuth, updateCurrentUser);
router.delete('/delete/:id', ensureAuth, deleteCurrentUser);
router.get('/logout', ensureAuth, logout);

module.exports = router;
