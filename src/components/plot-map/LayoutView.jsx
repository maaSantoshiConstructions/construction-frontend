import React from 'react';
import { FaHome, FaRoad, FaCompass, FaRulerCombined, FaMapMarkerAlt, FaTree } from 'react-icons/fa';

const statusConfig = {
  available: { color: '#22c55e', bg: '#f0fdf4', text: '#15803d', border: '#86efac', label: 'Available' },
  reserved: { color: '#f59e0b', bg: '#fffbeb', text: '#b45309', border: '#fcd34d', label: 'Reserved' },
  sold: { color: '#ef4444', bg: '#fef2f2', text: '#b91c1c', border: '#fca5a5', label: 'Sold' },
  blocked: { color: '#94a3b8', bg: '#f8fafc', text: '#475569', border: '#cbd5e1', label: 'Blocked' },
};

const projectColors = [
  { fill: '#eef2ff', stroke: '#c7d2fe', header: '#4338ca', light: '#e0e7ff' },
  { fill: '#ecfdf5', stroke: '#a7f3d0', header: '#059669', light: '#d1fae5' },
  { fill: '#fefce8', stroke: '#fde68a', header: '#ca8a04', light: '#fef9c3' },
  { fill: '#fdf2f8', stroke: '#fbcfe8', header: '#be185d', light: '#fce7f3' },
  { fill: '#f0f9ff', stroke: '#bae6fd', header: '#0284c7', light: '#e0f2fe' },
];

const formatCurrency = (val) => '₹' + (val || 0).toLocaleString('en-IN');
const formatSize = (val) => (val || 0).toLocaleString('en-IN');

export default function LayoutView({
  isMobile,
  filteredPlots,
  groupedByProject,
  selectedPlot,
  setSelectedPlot,
}) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: isMobile ? '12px' : '24px', overflowX: 'auto' }}>
      {filteredPlots.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <FaMapMarkerAlt style={{ fontSize: '40px', marginBottom: '12px', color: '#cbd5e1' }} />
          <p style={{ fontSize: '15px', fontWeight: 600 }}>No plots to display</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>Adjust your filters or search query.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {groupedByProject.map(([projectName, projectPlots], pi) => {
            const colorSet = projectColors[pi % projectColors.length];
            const cols = 5;
            const rows = Math.ceil(projectPlots.length / cols);
            return (
              <div key={projectName} style={{ border: `2px solid ${colorSet.stroke}`, borderRadius: '16px', overflow: 'hidden', background: colorSet.fill }}>
                <div style={{ background: colorSet.header, color: '#fff', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaHome style={{ fontSize: '16px', opacity: 0.9 }} />
                    <span style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>{projectName}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, opacity: 0.85, background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '8px' }}>
                      {projectPlots.length} Plots
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, opacity: 0.85, background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '8px' }}>
                      {rows} Rows
                    </span>
                  </div>
                </div>
                <div style={{ background: '#e5e7eb', padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaRoad style={{ color: '#6b7280', fontSize: '11px' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Main Access Road — 30 ft</span>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  {Array.from({ length: rows }, (_, rowIdx) => {
                    const rowPlots = projectPlots.slice(rowIdx * cols, (rowIdx + 1) * cols);
                    return (
                      <div key={rowIdx}>
                        {rowIdx > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '10px 0', padding: '4px 0' }}>
                            <div style={{ flex: 1, height: '1px', background: 'repeating-linear-gradient(90deg, #d1d5db 0, #d1d5db 6px, transparent 6px, transparent 12px)' }} />
                            <FaRoad style={{ color: '#9ca3af', fontSize: '9px' }} />
                            <span style={{ fontSize: '9px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Internal Road — 20 ft</span>
                            <div style={{ flex: 1, height: '1px', background: 'repeating-linear-gradient(90deg, #d1d5db 0, #d1d5db 6px, transparent 6px, transparent 12px)' }} />
                          </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(rowPlots.length, cols)}, 1fr)`, gap: '10px' }}>
                          {rowPlots.map((plot) => {
                            const st = statusConfig[plot.status] || statusConfig.available;
                            const sel = selectedPlot?._id === plot._id;
                            return (
                              <div key={plot._id} onClick={() => setSelectedPlot(plot)}
                                style={{
                                  border: `2px solid ${sel ? st.color : st.border}`,
                                  borderRadius: '10px',
                                  background: sel ? st.bg : '#fff',
                                  cursor: 'pointer',
                                  padding: '10px',
                                  textAlign: 'center',
                                  transition: 'all 0.15s',
                                  boxShadow: sel ? `0 4px 12px ${st.color}25` : '0 1px 3px rgba(0,0,0,0.06)',
                                  position: 'relative',
                                }}
                                onMouseEnter={(e) => { if (!sel) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; } }}
                                onMouseLeave={(e) => { if (!sel) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; } }}
                              >
                                <div style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', borderRadius: '50%', background: st.color }} />
                                {plot.corner && (
                                  <div style={{ position: 'absolute', top: '6px', left: '6px', fontSize: '8px', fontWeight: 700, color: '#d97706', background: '#fffbeb', padding: '1px 4px', borderRadius: '4px', border: '1px solid #fde68a' }}>
                                    CORNER
                                  </div>
                                )}
                                <div style={{ fontSize: '16px', fontWeight: 800, color: sel ? st.color : '#0f172a', fontFamily: 'Poppins, sans-serif', lineHeight: 1.2 }}>
                                  {plot.plotNumber}
                                </div>
                                <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginTop: '4px' }}>
                                  {formatSize(plot.size)} sqft
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px', fontSize: '10px', color: '#94a3b8' }}>
                                  <FaCompass style={{ fontSize: '9px' }} />
                                  {plot.facing}
                                </div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#d97706', marginTop: '4px' }}>
                                  {formatCurrency(plot.price)}
                                </div>
                                {plot.roadWidth && (
                                  <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '3px' }}>
                                    <FaRulerCombined style={{ fontSize: '8px', marginRight: '2px' }} />
                                    {plot.roadWidth} ft road
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ margin: '0 20px 16px', padding: '10px 16px', background: '#f0fdf4', border: '1.5px dashed #86efac', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <FaTree style={{ color: '#22c55e', fontSize: '14px' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#15803d' }}>Central Park & Green Area</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
