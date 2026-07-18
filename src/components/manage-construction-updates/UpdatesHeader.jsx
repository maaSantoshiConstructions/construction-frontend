import React from 'react';

export default function UpdatesHeader({ openCreate }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
      <div>
        <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '22px', fontWeight: 800, color: '#171a35', marginBottom: '4px' }}>Construction Updates</h1>
        <p style={{ color: '#6b6f8a', fontSize: '13.5px' }}>Track and publish construction progress for all projects</p>
      </div>
      <button onClick={openCreate} className="btn-gold" style={{ fontSize: '13px', padding: '10px 20px', border: 'none' }}>
        + Add Update
      </button>
    </div>
  );
}
