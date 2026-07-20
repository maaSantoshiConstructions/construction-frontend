import React from 'react';

export default function ProjectsHeader({ openCreate }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
      <div>
        <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '22px', fontWeight: 800, color: '#171a35', marginBottom: '4px' }}>Manage Projects</h1>
        <p style={{ color: '#6b6f8a', fontSize: '13.5px' }}>Create and manage real estate projects</p>
      </div>
      <button onClick={openCreate} className="btn-gold" style={{ fontSize: '13px', padding: '10px 20px', border: 'none' }}>
        + Add Project
      </button>
    </div>
  );
}
