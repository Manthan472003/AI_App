const express = require('express');
const router = express.Router();
const questionController = require('../Controllers/questionController'); 

// Create a new comment
router.get('/', questionController.getAllTheQuestions);

module.exports = router;