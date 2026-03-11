const express = require('express');
const router = express.Router();
const {
  getAllForms,
  getFormById,
  createForm,
  updateForm,
  deleteForm,
} = require('../controller/formController');

router.get('/', getAllForms);         // List all forms
router.get('/:id', getFormById);      // Get single form
router.post('/', createForm);         // Create form
router.put('/:id', updateForm);       // Update form
router.delete('/:id', deleteForm);    // Delete form

module.exports = router;
