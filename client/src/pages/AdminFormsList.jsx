import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getForms, deleteForm } from '../api';

export default function AdminFormsList() {
  const [forms, setForms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  const loadForms = async () => {
    try {
      const { data } = await getForms();
      setForms(data);
    } catch (e) {
      setError('Could not load forms. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadForms(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteForm(id);
      setForms((prev) => prev.filter((f) => f._id !== id));
    } catch {
      alert('Failed to delete form.');
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="page-header">
        <h1>My Forms</h1>
        <Link to="/admin/create-form" className="btn btn-primary">
          + Create Form
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {forms.length === 0 ? (
        <div className="canvas-empty">
          <div className="big">📋</div>
          <p>No forms yet. Create your first one!</p>
        </div>
      ) : (
        <div className="forms-grid">
          {forms.map((f) => (
            <div key={f._id} className="form-card">
              <h3>{f.title}</h3>
              <p className="fc-desc">{f.description || 'No description'}</p>
              <div>
                <span className="fc-tag">📝 {f.fieldCount} fields</span>
                <span className="fc-tag">
                  🗓 {new Date(f.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="form-card-actions">
                <Link
                  to={`/admin/edit-form/${f._id}`}
                  className="btn btn-secondary btn-sm"
                >
                  ✏️ Edit
                </Link>
                <Link
                  to={`/admin/responses/${f._id}`}
                  className="btn btn-secondary btn-sm"
                >
                  📊 Responses
                </Link>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/form/${f._id}`;
                    navigator.clipboard.writeText(url);
                    alert('Form link copied!');
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  🔗 Copy Link
                </button>
                <button
                  onClick={() => handleDelete(f._id, f.title)}
                  className="btn btn-danger btn-sm"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
