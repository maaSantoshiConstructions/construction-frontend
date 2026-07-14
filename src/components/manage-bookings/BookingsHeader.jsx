import React from 'react';
import { FaPlus } from 'react-icons/fa';

export default function BookingsHeader({ openFormModal }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Bookings</h1>
        <p className="text-slate-500 text-sm">View, create, and manage customer plot bookings</p>
      </div>
      <button
        onClick={() => openFormModal()}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 22px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', fontSize: '14px', fontWeight: 700, borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(245,158,11,0.3)', transition: 'all 0.2s ease', fontFamily: 'inherit' }}
        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(245,158,11,0.4)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(245,158,11,0.3)'; }}
      >
        <FaPlus style={{ fontSize: '11px' }} />
        Add Booking
      </button>
    </div>
  );
}
