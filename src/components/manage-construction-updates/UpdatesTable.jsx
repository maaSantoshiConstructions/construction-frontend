import React from 'react';
import ErrorMessage from '../common/ErrorMessage';

const stageColor = { planning: '#3a2fb8', foundation: '#d99f36', structure: '#5b4fe0', roofing: '#7a3fd6', finishing: '#2f9e5c', completed: '#2f9e5c' };
const td = { padding: '13px 16px', fontSize: '13px', verticalAlign: 'middle' };

export default function UpdatesTable({
  updates = [],
  loading = false,
  error = null,
  page = 1,
  totalPages = 1,
  setPage,
  openEdit,
  handleDelete,
  openCreate,
  fetchUpdates
}) {
  return (
    <>
      {error ? <ErrorMessage message={error} onRetry={fetchUpdates} /> : (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e6e6f0', boxShadow: '0 2px 10px rgba(20,20,60,.05)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ea1c4' }}>Loading updates...</div>
          ) : updates.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>&#x1F477;</div>
              <p style={{ color: '#6b6f8a', fontSize: '14px', marginBottom: '16px' }}>No construction updates yet.</p>
              <button onClick={openCreate} className="btn-gold" style={{ fontSize: '13px', padding: '10px 20px', border: 'none' }}>+ Add First Update</button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f7f7fb', borderBottom: '1px solid #e6e6f0' }}>
                    {['Title','Project','Stage','Progress','Date','Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11.5px', fontWeight: 700, color: '#6b6f8a', letterSpacing: '.5px', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {updates.map((r) => (
                    <tr key={r._id} style={{ borderBottom: '1px solid #f0f0f6', transition: '.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f7f7fb'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <td style={td}><span style={{ fontWeight: 600, color: '#171a35', fontSize: '13.5px' }}>{r.title}</span></td>
                      <td style={td}><span style={{ color: '#6b6f8a', fontSize: '13px' }}>{r.project?.name || '-'}</span></td>
                      <td style={td}>
                        {r.stage ? (
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: (stageColor[r.stage?.toLowerCase()] || '#3a2fb8') + '18', color: stageColor[r.stage?.toLowerCase()] || '#3a2fb8' }}>
                            {r.stage.charAt(0).toUpperCase() + r.stage.slice(1)}
                          </span>
                        ) : '-'}
                      </td>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '80px', height: '6px', background: '#e6e6f0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${r.progressPercent || 0}%`, background: (r.progressPercent || 0) >= 80 ? '#2f9e5c' : '#3a2fb8', borderRadius: '3px', transition: 'width .4s' }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#171a35' }}>{r.progressPercent || 0}%</span>
                        </div>
                      </td>
                      <td style={td}><span style={{ color: '#6b6f8a', fontSize: '12.5px' }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '-'}</span></td>
                      <td style={td}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => openEdit(r)}
                            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e6e6f0', background: '#fff', color: '#3a2fb8', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(r._id)}
                            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #fde8e8', background: '#fff8f8', color: '#c0392b', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '16px' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid', borderColor: p === page ? '#3a2fb8' : '#e6e6f0', background: p === page ? '#3a2fb8' : '#fff', color: p === page ? '#fff' : '#6b6f8a', fontWeight: p === page ? 700 : 400, fontSize: '13px', cursor: 'pointer' }}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
