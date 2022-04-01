const router = require('express').Router();
const passport = require('passport');

const ensureAuth = passport.authenticate('jwt', { session: false });

const {
  addUser,
  getOneUser,
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/manager.controller');

router.post('/add', ensureAuth, addUser);
router.get('/', ensureAuth, getAllUsers);
router.get('/:id', ensureAuth, getOneUser);
router.put('/update/:id', ensureAuth, updateUser);
router.delete('/delete/:id', ensureAuth, deleteUser);

module.exports = router;
