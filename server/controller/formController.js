const Form = require('../models/Form');

// GET /api/forms — list all forms
const getAllForms = async (req, res) => {
  try {
    // Return only id, title, description, field count, timestamps
    const forms = await Form.find({}, 'title description fields createdAt updatedAt');
    const result = forms.map((f) => ({
      _id: f._id,
      title: f.title,
      description: f.description,
      fieldCount: f.fields.length,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/forms/:id — get single form with all fields
const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/forms — create a new form
const createForm = async (req, res) => {
  try {
    const { title, description, fields } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const form = new Form({ title, description, fields: fields || [] });
    const saved = await form.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/forms/:id — update a form
const updateForm = async (req, res) => {
  try {
    const { title, description, fields } = req.body;
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { title, description, fields },
      { new: true, runValidators: true }
    );
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/forms/:id — delete a form
const deleteForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json({ message: 'Form deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAllForms, getFormById, createForm, updateForm, deleteForm };
