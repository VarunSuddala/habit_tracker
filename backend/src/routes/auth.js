const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// POST /api/auth/register
router.post('/register', validate(['name', 'email', 'password']), register);

// POST /api/auth/login
router.post('/login', validate(['email', 'password']), login);

// GET /api/auth/profile (protected)
router.get('/profile', authenticate, getProfile);

module.exports = router;
