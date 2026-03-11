const Response = require('../models/Response');
const Form = require('../models/Form');

// POST /api/responses — submit a form response
const submitResponse = async (req, res) => {
  try {
    const { formId, answers } = req.body;

    // Verify the form exists
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const response = new Response({ formId, answers });
    const saved = await response.save();
    res.status(201).json({ message: 'Response submitted successfully', response: saved });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/responses/:formId — get all responses for a form
const getResponsesByForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const responses = await Response.find({ formId: req.params.formId }).sort({ createdAt: -1 });
    res.json({ form: { title: form.title, fields: form.fields }, responses });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { submitResponse, getResponsesByForm };
