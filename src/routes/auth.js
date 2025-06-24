const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
  createUser,
  getUserProfile,
  updateUserProfile
} = require('../controllers/authController');

// Public routes
router.post('/register', createUser);

// Protected routes
router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateUserProfile);

module.exports = router;