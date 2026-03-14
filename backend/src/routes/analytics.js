const express = require('express');
const router = express.Router();
const { getWeekly, getMonthly, getHeatmap } = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');

// All analytics routes require authentication
router.use(authenticate);

// GET /api/analytics/weekly
router.get('/weekly', getWeekly);

// GET /api/analytics/monthly
router.get('/monthly', getMonthly);

// GET /api/analytics/heatmap
router.get('/heatmap', getHeatmap);

module.exports = router;
