const express = require('express');
const router = express.Router();
const { getFounder, updateFounder } = require('../controllers/founderController');
// If there's authentication middleware, it could be added to updateFounder, but keeping it simple for now based on context
// const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', getFounder);
router.put('/', updateFounder);

module.exports = router;
