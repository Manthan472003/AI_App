const express = require('express');
const router = express.Router();
const summaryController = require('../Controllers/summaryController');

router.post('/', summaryController.saveSummary);

router.get('/getSummary', summaryController.getAllTheSummary);

module.exports = router;