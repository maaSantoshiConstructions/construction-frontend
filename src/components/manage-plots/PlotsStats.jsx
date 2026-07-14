import React from 'react';
import { motion } from 'framer-motion';
import { FaRulerCombined, FaCheckCircle, FaLock, FaCheckDouble, FaTimes } from 'react-icons/fa';

export default function PlotsStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', minHeight: '72px', position: 'relative', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
        onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
        onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)'}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#94a3b8', borderRadius: '12px 0 0 12px' }} />
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
          <FaRulerCombined style={{ fontSize: '13px' }} />
        </div>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Total Plots</p>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', lineHeight: 1.1, margin: '2px 0 0 0' }}>{stats.total}</h3>
        </div>
      </motion.div>

      {/* Available */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', minHeight: '72px', position: 'relative', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
        onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
        onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)'}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#10b981', borderRadius: '12px 0 0 12px' }} />
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', flexShrink: 0 }}>
          <FaCheckCircle style={{ fontSize: '13px' }} />
        </div>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Available</p>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#059669', lineHeight: 1.1, margin: '2px 0 0 0' }}>{stats.available}</h3>
        </div>
      </motion.div>

      {/* Reserved */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', minHeight: '72px', position: 'relative', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
        onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
        onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)'}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#f59e0b', borderRadius: '12px 0 0 12px' }} />
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fffbeb', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', flexShrink: 0 }}>
          <FaLock style={{ fontSize: '13px' }} />
        </div>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Reserved</p>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#d97706', lineHeight: 1.1, margin: '2px 0 0 0' }}>{stats.reserved}</h3>
        </div>
      </motion.div>

      {/* Sold */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', minHeight: '72px', position: 'relative', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
        onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
        onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)'}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#f43f5e', borderRadius: '12px 0 0 12px' }} />
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fff1f2', border: '1px solid #fecdd3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', flexShrink: 0 }}>
          <FaCheckDouble style={{ fontSize: '13px' }} />
        </div>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Sold</p>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#e11d48', lineHeight: 1.1, margin: '2px 0 0 0' }}>{stats.sold}</h3>
        </div>
      </motion.div>

      {/* Blocked */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', minHeight: '72px', position: 'relative', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
        onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
        onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)'}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#64748b', borderRadius: '12px 0 0 12px' }} />
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
          <FaTimes style={{ fontSize: '13px' }} />
        </div>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Blocked</p>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#475569', lineHeight: 1.1, margin: '2px 0 0 0' }}>{stats.blocked}</h3>
        </div>
      </motion.div>
    </div>
  );
}
