const express = require('express');
const router = express.Router();
const { submitResponse, getResponsesByForm } = require('../controller/responseController');

router.post('/', submitResponse);                    // Submit a response
router.get('/:formId', getResponsesByForm);          // Get responses for a form

module.exports = router;
