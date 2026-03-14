const express = require('express');
const router = express.Router();
const { getLogsByDate, createLog } = require('../controllers/logController');
const { authenticate } = require('../middleware/auth');

// All log routes require authentication
router.use(authenticate);

// GET /api/logs?date=YYYY-MM-DD
router.get('/', getLogsByDate);

// POST /api/logs
router.post('/', createLog);

module.exports = router;
