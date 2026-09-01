const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// GET settings
router.get('/', settingsController.getSettings);

// PUT update settings
router.put('/', settingsController.updateSettings);

module.exports = router;
