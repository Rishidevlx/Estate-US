const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/', contactController.sendContactEmail);
router.get('/enquiries', contactController.getEnquiries);
router.get('/enquiries/today', contactController.getTodayEnquiries);
router.put('/enquiries/:id/status', contactController.updateEnquiryStatus);

module.exports = router;
