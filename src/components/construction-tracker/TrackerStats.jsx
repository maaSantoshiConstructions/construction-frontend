import React from 'react';

export default function TrackerStats({
  projectStats,
  currentProjectObj,
  stages,
  isMobile,
}) {
  if (!projectStats) return null;

  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: isMobile ? '20px' : '24px 28px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
            {currentProjectObj?.name || 'Overall Progress'}
          </h3>
          {currentProjectObj?.location?.city && (
            <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>{currentProjectObj.location.city}, {currentProjectObj.location.state}</p>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#d99f36', fontFamily: 'Poppins, sans-serif' }}>{projectStats.avgProgress}%</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>{projectStats.total} Updates</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{ height: '100%', width: `${projectStats.avgProgress}%`, background: 'linear-gradient(90deg, #3a2fb8, #5b4fe0)', borderRadius: '5px', transition: 'width 0.6s ease' }} />
      </div>

      {/* Stage Indicators */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)', gap: '8px' }}>
        {stages.map((s) => {
          const count = projectStats.stageCounts[s.key] || 0;
          const active = count > 0;
          return (
            <div key={s.key} style={{ padding: '10px 8px', borderRadius: '10px', background: active ? s.color + '10' : '#f8fafc', border: `1.5px solid ${active ? s.color + '30' : '#e5e7eb'}`, textAlign: 'center', transition: 'all 0.2s' }}>
              <div style={{ color: active ? s.color : '#94a3b8', fontSize: '16px', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: active ? s.color : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{s.label}</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: active ? '#0f172a' : '#cbd5e1', marginTop: '2px' }}>{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
