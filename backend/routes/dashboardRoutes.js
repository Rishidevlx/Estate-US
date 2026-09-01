const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../controllers/authController');

router.get('/stats', verifyToken, dashboardController.getDashboardData);

module.exports = router;
