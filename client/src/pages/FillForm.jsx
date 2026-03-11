import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getForm, submitResponse } from '../api';

export default function FillForm() {
  const { id }         = useParams();
  const [form,    setForm]    = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    getForm(id)
      .then(({ data }) => {
        setForm(data);
        // Pre-fill checkbox arrays
        const init = {};
        data.fields.forEach((f) => {
          if (f.type === 'checkbox') init[f._id] = [];
        });
        setAnswers(init);
      })
      .catch(() => setError('Form not found or server error.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (fieldId, value) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckbox = (fieldId, option, checked) => {
    setAnswers((prev) => {
      const current = prev[fieldId] || [];
      if (checked) return { ...prev, [fieldId]: [...current, option] };
      return { ...prev, [fieldId]: current.filter((v) => v !== option) };
    });
  };

  const handleSubmit = async () => {
    setError('');

    // Validate required fields
    for (const f of form.fields) {
      const val = answers[f._id];
      if (f.required) {
        if (!val || (Array.isArray(val) && val.length === 0) || val === '') {
          setError(`"${f.label}" is required.`);
          return;
        }
      }
    }

    // Build answers map with labels as keys (readable in DB)
    const labeledAnswers = {};
    form.fields.forEach((f) => {
      const val = answers[f._id];
      labeledAnswers[f.label] = Array.isArray(val) ? val.join(', ') : (val || '');
    });

    setSubmitting(true);
    try {
      await submitResponse({ formId: id, answers: labeledAnswers });
      setSubmitted(true);
    } catch {
      setError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (error && !form) return <div className="alert alert-error" style={{ maxWidth: 640, margin: '2rem auto' }}>{error}</div>;

  if (submitted) {
    return (
      <div className="fill-form-wrap" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '0.5rem' }}>Response Submitted!</h2>
        <p style={{ color: 'var(--muted)' }}>Thank you for filling out <strong>{form.title}</strong>.</p>
      </div>
    );
  }

  return (
    <div className="fill-form-wrap">
      <h1 className="fill-form-title">{form.title}</h1>
      {form.description && <p className="fill-form-desc">{form.description}</p>}
      <div className="divider" />

      {error && <div className="alert alert-error">{error}</div>}

      {form.fields.map((field) => (
        <div key={field._id} className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ fontSize: '0.95rem', color: 'var(--ink)', marginBottom: '0.5rem' }}>
            {field.label}
            {field.required && <span className="req"> *</span>}
          </label>

          {field.type === 'text' && (
            <input
              type="text"
              className="form-input"
              placeholder={field.placeholder}
              value={answers[field._id] || ''}
              onChange={(e) => handleChange(field._id, e.target.value)}
            />
          )}

          {field.type === 'textarea' && (
            <textarea
              className="form-textarea"
              placeholder={field.placeholder}
              value={answers[field._id] || ''}
              onChange={(e) => handleChange(field._id, e.target.value)}
            />
          )}

          {field.type === 'email' && (
            <input
              type="email"
              className="form-input"
              placeholder={field.placeholder}
              value={answers[field._id] || ''}
              onChange={(e) => handleChange(field._id, e.target.value)}
            />
          )}

          {field.type === 'number' && (
            <input
              type="number"
              className="form-input"
              placeholder={field.placeholder}
              value={answers[field._id] || ''}
              onChange={(e) => handleChange(field._id, e.target.value)}
            />
          )}

          {field.type === 'dropdown' && (
            <select
              className="form-select"
              value={answers[field._id] || ''}
              onChange={(e) => handleChange(field._id, e.target.value)}
            >
              <option value="">Select an option…</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}

          {field.type === 'radio' && (
            <div>
              {field.options.map((opt) => (
                <label key={opt} className="radio-opt">
                  <input
                    type="radio"
                    name={field._id}
                    value={opt}
                    checked={answers[field._id] === opt}
                    onChange={() => handleChange(field._id, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {field.type === 'checkbox' && (
            <div>
              {field.options.map((opt) => (
                <label key={opt} className="check-opt">
                  <input
                    type="checkbox"
                    value={opt}
                    checked={(answers[field._id] || []).includes(opt)}
                    onChange={(e) => handleCheckbox(field._id, opt, e.target.checked)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="divider" />

      <button onClick={handleSubmit} disabled={submitting} className="btn btn-primary" style={{ minWidth: 140 }}>
        {submitting ? 'Submitting…' : 'Submit Response'}
      </button>
    </div>
  );
}
