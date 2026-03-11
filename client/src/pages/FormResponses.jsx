import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFormResponses } from '../api';

export default function FormResponses() {
  const { formId }     = useParams();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    getFormResponses(formId)
      .then(({ data }) => setData(data))
      .catch(() => setError('Failed to load responses.'))
      .finally(() => setLoading(false));
  }, [formId]);

  const downloadCSV = () => {
    if (!data || data.responses.length === 0) return;
    const fields = data.form.fields.map((f) => f.label);
    const header = ['#', 'Submitted At', ...fields];
    const rows   = data.responses.map((r, i) => {
      const map = r.answers instanceof Object ? r.answers : {};
      return [i + 1, new Date(r.createdAt).toLocaleString(), ...fields.map((f) => map[f] ?? '')];
    });
    const csv = [header, ...rows]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = `${data.form.title}_responses.csv`;
    a.click();
  };

  if (loading) return <div className="spinner" />;
  if (error)   return <div className="alert alert-error">{error}</div>;

  const { form, responses } = data;
  const fieldLabels = form.fields.map((f) => f.label);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Responses</h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
            {form.title} — {responses.length} response{responses.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={downloadCSV} className="btn btn-secondary" disabled={responses.length === 0}>
            ⬇ Download CSV
          </button>
          <Link to="/admin/forms" className="btn btn-secondary">← Back</Link>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="canvas-empty">
          <div className="big">📭</div>
          <p>No responses yet. Share the form link to collect responses.</p>
          <div style={{ marginTop: '1rem' }}>
            <code style={{ background: 'var(--cream)', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>
              {window.location.origin}/form/{formId}
            </code>
          </div>
        </div>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="responses-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Submitted At</th>
                {fieldLabels.map((label) => <th key={label}>{label}</th>)}
              </tr>
            </thead>
            <tbody>
              {responses.map((r, i) => {
                const answers = r.answers || {};
                return (
                  <tr key={r._id}>
                    <td>{i + 1}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    {fieldLabels.map((label) => (
                      <td key={label}>{answers[label] ?? '—'}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
