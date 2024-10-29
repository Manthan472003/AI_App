const express = require('express');
const router = express.Router();
const summaryController = require('../Controllers/summaryController');

router.post('/', summaryController.saveSummary);

module.exports = router;