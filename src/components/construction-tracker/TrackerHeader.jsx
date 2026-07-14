import React from 'react';
import { FaHardHat } from 'react-icons/fa';

export default function TrackerHeader({
  selectedProject,
  setSelectedProject,
  projects,
  setSearchParams,
  isMobile,
}) {
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '16px' : '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #d99f36, #b8860b)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(217,159,54,0.3)' }}>
              <FaHardHat style={{ color: '#fff', fontSize: '22px' }} />
            </div>
            <div>
              <h1 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                Construction Tracker
              </h1>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>
                Real-time progress across all projects
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Filter:</label>
            <select
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                if (e.target.value) setSearchParams({ project: e.target.value });
                else setSearchParams({});
              }}
              style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '13px', fontWeight: 500, color: '#1e293b', background: '#fff', cursor: 'pointer', outline: 'none', fontFamily: 'Inter, sans-serif', minWidth: '180px' }}
            >
              <option value="">All Projects</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
