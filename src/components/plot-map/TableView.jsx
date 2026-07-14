import React from 'react';

const statusConfig = {
  available: { color: '#22c55e', bg: '#f0fdf4', text: '#15803d', border: '#86efac', label: 'Available' },
  reserved: { color: '#f59e0b', bg: '#fffbeb', text: '#b45309', border: '#fcd34d', label: 'Reserved' },
  sold: { color: '#ef4444', bg: '#fef2f2', text: '#b91c1c', border: '#fca5a5', label: 'Sold' },
  blocked: { color: '#94a3b8', bg: '#f8fafc', text: '#475569', border: '#cbd5e1', label: 'Blocked' },
};

const formatCurrency = (val) => '₹' + (val || 0).toLocaleString('en-IN');
const formatSize = (val) => (val || 0).toLocaleString('en-IN');

export default function TableView({
  filteredPlots,
  selectedPlot,
  setSelectedPlot,
  getProjectName,
}) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Plot #', 'Project', 'Size (sqft)', 'Facing', 'Road', 'Price', 'Status'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPlots.map((plot) => {
              const cfg = statusConfig[plot.status] || statusConfig.available;
              const sel = selectedPlot?._id === plot._id;
              return (
                <tr key={plot._id} onClick={() => setSelectedPlot(plot)}
                  style={{ cursor: 'pointer', background: sel ? cfg.bg : '#fff', borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s' }}
                  onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = '#fff'; }}
                >
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{plot.plotNumber}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{getProjectName(plot)}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>{formatSize(plot.size)}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{plot.facing}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{plot.roadWidth ? `${plot.roadWidth} ft` : '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#d97706' }}>{formatCurrency(plot.price)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                  </td>
                </tr>
              );
            })}
            {filteredPlots.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px 16px', color: '#94a3b8', fontSize: '14px' }}>No plots match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
