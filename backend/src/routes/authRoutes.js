const express = require('express');
const {
  register,
  registerFarmer,
  login,
  getMe,
  updateMe,
  logout,
} = require('../controllers/authController');
const protect = require('../middleware/auth');
const {
  validate,
  registrationRules,
  farmerRegistrationRules,
  loginRules,
} = require('../middleware/validate');

const router = express.Router();

router.post('/register', validate(registrationRules), register);
router.post('/register/farmer', validate(farmerRegistrationRules), registerFarmer);
router.post('/login', validate(loginRules), login);
router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);
router.post('/logout', protect, logout);

module.exports = router;
