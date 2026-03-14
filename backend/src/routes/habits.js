const express = require('express');
const router = express.Router();
const { getHabits, createHabit, updateHabit, deleteHabit } = require('../controllers/habitController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// All habit routes require authentication
router.use(authenticate);

// GET /api/habits
router.get('/', getHabits);

// POST /api/habits
router.post('/', validate(['title']), createHabit);

// PATCH /api/habits/:id
router.patch('/:id', updateHabit);

// DELETE /api/habits/:id
router.delete('/:id', deleteHabit);

module.exports = router;
