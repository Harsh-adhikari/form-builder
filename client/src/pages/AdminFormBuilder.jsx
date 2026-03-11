import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getForm, createForm, updateForm } from '../api';

const FIELD_TYPES = [
  { type: 'text',     label: 'Short Text',    icon: 'Aa' },
  { type: 'textarea', label: 'Long Text',     icon: '≡'  },
  { type: 'email',    label: 'Email',         icon: '@'  },
  { type: 'number',   label: 'Number',        icon: '#'  },
  { type: 'dropdown', label: 'Dropdown',      icon: '▾'  },
  { type: 'checkbox', label: 'Checkboxes',    icon: '☑'  },
  { type: 'radio',    label: 'Radio Buttons', icon: '◉'  },
];

function newField(type) {
  const base = { type, label: '', required: false, placeholder: '', options: [] };
  if (['dropdown', 'checkbox', 'radio'].includes(type)) {
    base.options = ['Option 1', 'Option 2'];
  }
  return base;
}

export default function AdminFormBuilder() {
  const { id }       = useParams();           // present when editing
  const navigate     = useNavigate();
  const isEdit       = Boolean(id);

  const [title,  setTitle]    = useState('');
  const [desc,   setDesc]     = useState('');
  const [fields, setFields]   = useState([]);
  const [saving, setSaving]   = useState(false);
  const [error,  setError]    = useState('');
  const [loading,setLoading]  = useState(isEdit);

  // Load existing form when editing
  useEffect(() => {
    if (!isEdit) return;
    getForm(id)
      .then(({ data }) => {
        setTitle(data.title);
        setDesc(data.description || '');
        setFields(data.fields);
      })
      .catch(() => setError('Failed to load form.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  // ── Field helpers ──
  const addField = (type) => {
    setFields((prev) => [...prev, newField(type)]);
  };

  const updateField = (idx, key, value) => {
    setFields((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [key]: value };
      return copy;
    });
  };

  const removeField = (idx) => {
    setFields((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveField = (idx, dir) => {
    const next = idx + dir;
    if (next < 0 || next >= fields.length) return;
    setFields((prev) => {
      const copy = [...prev];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy;
    });
  };

  // Option helpers (for dropdown / checkbox / radio)
  const updateOption = (fIdx, oIdx, val) => {
    setFields((prev) => {
      const copy   = [...prev];
      const opts   = [...copy[fIdx].options];
      opts[oIdx]   = val;
      copy[fIdx]   = { ...copy[fIdx], options: opts };
      return copy;
    });
  };

  const addOption = (fIdx) => {
    setFields((prev) => {
      const copy = [...prev];
      copy[fIdx] = { ...copy[fIdx], options: [...copy[fIdx].options, 'New Option'] };
      return copy;
    });
  };

  const removeOption = (fIdx, oIdx) => {
    setFields((prev) => {
      const copy = [...prev];
      const opts = copy[fIdx].options.filter((_, i) => i !== oIdx);
      copy[fIdx] = { ...copy[fIdx], options: opts };
      return copy;
    });
  };

  // ── Save ──
  const handleSave = async () => {
    setError('');
    if (!title.trim())       return setError('Form title is required.');
    if (fields.length === 0) return setError('Add at least one field.');
    for (const f of fields) {
      if (!f.label.trim()) return setError('Every field must have a label.');
    }

    setSaving(true);
    try {
      const payload = { title: title.trim(), description: desc.trim(), fields };
      if (isEdit) {
        await updateForm(id, payload);
      } else {
        await createForm(payload);
      }
      navigate('/admin/forms');
    } catch {
      setError('Failed to save form. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? 'Edit Form' : 'Create Form'}</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => navigate('/admin/forms')} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            {saving ? 'Saving…' : isEdit ? 'Update Form' : 'Save Form'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="builder-layout">
        {/* ── Field Palette ── */}
        <aside className="field-palette">
          <div className="palette-title">Add Field</div>
          {FIELD_TYPES.map(({ type, label, icon }) => (
            <button
              key={type}
              className="palette-btn"
              onClick={() => addField(type)}
            >
              <span>{icon}</span> {label}
            </button>
          ))}
        </aside>

        {/* ── Canvas ── */}
        <div className="form-canvas">
          <input
            className="form-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Form Title…"
          />
          <textarea
            className="form-desc-input"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Form description (optional)…"
            rows={2}
          />

          {fields.length === 0 && (
            <div className="canvas-empty">
              <div className="big">⊕</div>
              <p>Click a field type on the left to get started</p>
            </div>
          )}

          {fields.map((field, idx) => (
            <FieldCard
              key={idx}
              field={field}
              idx={idx}
              total={fields.length}
              onChange={updateField}
              onRemove={removeField}
              onMove={moveField}
              onUpdateOption={updateOption}
              onAddOption={addOption}
              onRemoveOption={removeOption}
            />
          ))}

          {fields.length > 0 && (
            <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              {saving ? 'Saving…' : isEdit ? 'Update Form' : 'Save Form'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Single field card ──
function FieldCard({ field, idx, total, onChange, onRemove, onMove, onUpdateOption, onAddOption, onRemoveOption }) {
  const hasOptions = ['dropdown', 'checkbox', 'radio'].includes(field.type);

  return (
    <div className="field-card">
      <div className="field-card-header">
        <span className="field-type-badge">{field.type}</span>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {idx > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={() => onMove(idx, -1)}>↑</button>
          )}
          {idx < total - 1 && (
            <button className="btn btn-secondary btn-sm" onClick={() => onMove(idx, 1)}>↓</button>
          )}
          <button className="btn btn-danger btn-sm" onClick={() => onRemove(idx)}>✕ Remove</button>
        </div>
      </div>

      {/* Label */}
      <div className="form-group">
        <label className="form-label">Field Label <span className="req">*</span></label>
        <input
          className="form-input"
          value={field.label}
          onChange={(e) => onChange(idx, 'label', e.target.value)}
          placeholder="e.g. Your Name"
        />
      </div>

      {/* Placeholder — text-like only */}
      {['text', 'textarea', 'email', 'number'].includes(field.type) && (
        <div className="form-group">
          <label className="form-label">Placeholder text</label>
          <input
            className="form-input"
            value={field.placeholder}
            onChange={(e) => onChange(idx, 'placeholder', e.target.value)}
            placeholder="e.g. Enter your name…"
          />
        </div>
      )}

      {/* Options — dropdown / checkbox / radio */}
      {hasOptions && (
        <div className="form-group">
          <label className="form-label">Options</label>
          <div className="options-editor">
            {field.options.map((opt, oIdx) => (
              <div key={oIdx} className="opt-row">
                <input
                  value={opt}
                  onChange={(e) => onUpdateOption(idx, oIdx, e.target.value)}
                  placeholder={`Option ${oIdx + 1}`}
                />
                {field.options.length > 1 && (
                  <button onClick={() => onRemoveOption(idx, oIdx)}>✕</button>
                )}
              </div>
            ))}
            <button className="add-opt-btn" onClick={() => onAddOption(idx)}>
              + Add option
            </button>
          </div>
        </div>
      )}

      {/* Required toggle */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => onChange(idx, 'required', e.target.checked)}
          style={{ accentColor: 'var(--rust)' }}
        />
        Required field
      </label>
    </div>
  );
}
