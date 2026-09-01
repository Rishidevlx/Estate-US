const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/profileController');
const { verifyToken } = require('../controllers/authController');

router.get('/', verifyToken, getProfile);
router.put('/', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);

module.exports = router;
