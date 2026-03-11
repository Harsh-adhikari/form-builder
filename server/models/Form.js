const mongoose = require('mongoose');

// Schema for each field inside a form
const fieldSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'email', 'number', 'textarea', 'dropdown', 'checkbox', 'radio'],
    required: true,
  },
  label: {
    type: String,
    required: true,
    trim: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  options: {
    type: [String],   // used by dropdown, checkbox, radio
    default: [],
  },
  required: {
    type: Boolean,
    default: false,
  },
});

// Main Form schema
const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    fields: [fieldSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Form', formSchema);
