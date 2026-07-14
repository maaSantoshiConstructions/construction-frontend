import React from 'react';
import { FaSearch } from 'react-icons/fa';

export default function PlotsFilters({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  projects,
  facings,
  setPage,
}) {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', padding: '14px 18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
      <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '380px' }}>
        <FaSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '13px', pointerEvents: 'none' }} />
        <input
          type="text"
          placeholder="Search by Plot Number (e.g. 104)..."
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
          style={{ width: '100%', height: '44px', paddingLeft: '40px', paddingRight: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#334155', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' }}
          onFocus={e => { e.target.style.borderColor = '#f59e0b'; e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.15)'; e.target.style.background = '#fff'; }}
          onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; }}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
        <select
          value={filters.project}
          onChange={e => { setFilters(f => ({ ...f, project: e.target.value })); setPage(1); }}
          style={{ height: '44px', padding: '0 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#334155', outline: 'none', cursor: 'pointer', minWidth: '148px', fontFamily: 'inherit' }}
        >
          <option value="">All Projects</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>

        <select
          value={filters.status}
          onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}
          style={{ height: '44px', padding: '0 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#334155', outline: 'none', cursor: 'pointer', minWidth: '140px', fontFamily: 'inherit' }}
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
          <option value="blocked">Blocked</option>
        </select>

        <select
          value={filters.facing}
          onChange={e => { setFilters(f => ({ ...f, facing: e.target.value })); setPage(1); }}
          style={{ height: '44px', padding: '0 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#334155', outline: 'none', cursor: 'pointer', minWidth: '140px', fontFamily: 'inherit' }}
        >
          <option value="">All Facings</option>
          {facings.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
    </div>
  );
}
