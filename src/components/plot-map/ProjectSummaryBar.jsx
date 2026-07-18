import React from 'react';
import { FaBuilding, FaCalendarAlt } from 'react-icons/fa';

function SummaryItem({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: 800, color, fontFamily: 'Poppins, sans-serif' }}>{value}</div>
    </div>
  );
}

export default function ProjectSummaryBar({
  currentProject,
  projectStats,
  isMobile,
  formatCurrency
}) {
  if (!currentProject) return null;

  return (
    <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: isMobile ? '16px' : '18px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FaBuilding style={{ color: '#fff', fontSize: '14px' }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentProject.name}
          </h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
            {currentProject.location?.city}{currentProject.location?.state ? `, ${currentProject.location.state}` : ''}
            {currentProject.status && <span style={{ marginLeft: '8px', padding: '2px 8px', borderRadius: '6px', background: '#f0fdf4', color: '#15803d', fontWeight: 600, fontSize: '11px', textTransform: 'capitalize' }}>{currentProject.status}</span>}
          </p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)', gap: '10px' }}>
        <SummaryItem label="Total" value={projectStats?.total || 0} color="#1e293b" />
        <SummaryItem label="Available" value={projectStats?.available || 0} color="#15803d" />
        <SummaryItem label="Reserved" value={projectStats?.reserved || 0} color="#b45309" />
        <SummaryItem label="Sold" value={projectStats?.sold || 0} color="#b91c1c" />
        {!isMobile && <SummaryItem label="Price/Sqft" value={currentProject.pricePerSqft ? formatCurrency(currentProject.pricePerSqft) : 'N/A'} color="#2563eb" />}
        {currentProject.possessionDate && !isMobile && (
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Possession</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
              <FaCalendarAlt style={{ fontSize: '11px', marginRight: '4px', color: '#94a3b8' }} />
              {new Date(currentProject.possessionDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
