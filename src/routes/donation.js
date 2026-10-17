const express = require('express');

const router = express.Router();

const donationController = require('../controllers/donation.controller');

router.get('/donations', donationController.getAllDonation);
router.post('/donations', donationController.createDonationTask);
router.get('/donations/summary', donationController.getDonationSummaryDetails);
router.get('/donations/:id', donationController.getDonationById);


module.exports = router;