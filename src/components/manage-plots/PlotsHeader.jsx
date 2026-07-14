import React from 'react';
import { FaPlus } from 'react-icons/fa';

export default function PlotsHeader({ openCreate }) {
  return (
    <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, letterSpacing: '-0.5px', margin: 0 }}>Manage Plots</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500, margin: '4px 0 0 0' }}>Real-time plot inventory, pricing, and specs</p>
      </div>
      <button
        onClick={openCreate}
        style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', fontSize: '13px', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(245,158,11,0.3)', transition: 'all 0.2s ease', fontFamily: 'inherit' }}
        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(245,158,11,0.4)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(245,158,11,0.3)'; }}
      >
        <FaPlus style={{ fontSize: '10px' }} /> Add Plot
      </button>
    </div>
  );
}
