import React from 'react';
import { FaTimes, FaSearch, FaMapMarkerAlt, FaCompass } from 'react-icons/fa';

const statusConfig = {
  available: { color: '#22c55e', bg: '#f0fdf4', text: '#15803d', border: '#86efac', label: 'Available' },
  reserved: { color: '#f59e0b', bg: '#fffbeb', text: '#b45309', border: '#fcd34d', label: 'Reserved' },
  sold: { color: '#ef4444', bg: '#fef2f2', text: '#b91c1c', border: '#fca5a5', label: 'Sold' },
  blocked: { color: '#94a3b8', bg: '#f8fafc', text: '#475569', border: '#cbd5e1', label: 'Blocked' },
};

const formatCurrency = (val) => '₹' + (val || 0).toLocaleString('en-IN');
const formatSize = (val) => (val || 0).toLocaleString('en-IN');

const selectStyle = {
  width: '100%', padding: '8px 10px', background: '#fff', border: '1px solid #e5e7eb',
  borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: '#334155', outline: 'none',
  cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
};

export default function FilterSidebar({
  isMobile,
  showFilters,
  setShowFilters,
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  plots,
  filteredPlots,
  selectedPlot,
  setSelectedPlot,
  getProjectName,
}) {
  const uniqueProjectNames = React.useMemo(() => {
    return [...new Set(plots.map((p) => getProjectName(p)))];
  }, [plots, getProjectName]);

  return (
    <div style={{
      width: isMobile ? (showFilters ? '100%' : '0px') : '340px',
      minWidth: isMobile ? (showFilters ? '100%' : '0px') : '340px',
      background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      overflow: 'hidden', transition: 'all 0.3s ease',
      position: isMobile ? 'fixed' : 'sticky', top: isMobile ? '0' : '24px',
      left: isMobile ? '0' : 'auto', zIndex: isMobile ? 200 : 10,
      height: isMobile ? '100vh' : 'calc(100vh - 140px)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
          Filters & Plots
        </h3>
        {isMobile && (
          <button type="button" onClick={() => setShowFilters(false)}
            style={{ background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaTimes style={{ fontSize: '12px' }} />
          </button>
        )}
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto', flex: 1 }}>
        <div style={{ position: 'relative' }}>
          <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '13px' }} />
          <input type="text" placeholder="Search plot number..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', height: '40px', padding: '0 12px 0 36px', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', color: '#1e293b', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', fontWeight: 500 }}
            onFocus={(e) => { e.target.style.borderColor = '#93c5fd'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Project</label>
            <select value={filters.project} onChange={(e) => setFilters({ ...filters, project: e.target.value })}
              style={selectStyle}>
              <option value="">All Projects</option>
              {uniqueProjectNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Facing</label>
              <select value={filters.facing} onChange={(e) => setFilters({ ...filters, facing: e.target.value })}
                style={selectStyle}>
                <option value="">All</option>
                {['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Size</label>
              <select value={filters.sizeRange} onChange={(e) => setFilters({ ...filters, sizeRange: e.target.value })}
                style={selectStyle}>
                <option value="">Any</option>
                <option value="0-1000">Up to 1,000 sqft</option>
                <option value="1000-1500">1,000 - 1,500</option>
                <option value="1500-2000">1,500 - 2,000</option>
                <option value="2000-99999">2,000+</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Status</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {Object.entries(statusConfig).map(([key, cfg]) => {
                const sel = filters.status === key;
                return (
                  <button key={key} type="button" onClick={() => setFilters({ ...filters, status: sel ? '' : key })}
                    style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: `1.5px solid ${sel ? cfg.color : '#e5e7eb'}`, cursor: 'pointer', background: sel ? cfg.bg : '#fff', color: sel ? cfg.text : '#64748b', outline: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.color }} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
          <button type="button" onClick={() => { setFilters({ project: '', facing: '', status: '', sizeRange: '' }); setSearchQuery(''); }}
            style={{ padding: '6px 0', border: 'none', background: 'none', color: '#2563eb', fontWeight: 600, fontSize: '12px', cursor: 'pointer', textAlign: 'left', outline: 'none' }}>
            Clear all filters
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Plot Directory</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>{filteredPlots.length} plots</span>
          </div>
          {filteredPlots.map((plot) => {
            const sel = selectedPlot?._id === plot._id;
            const cfg = statusConfig[plot.status] || statusConfig.available;
            return (
              <div key={plot._id} onClick={() => setSelectedPlot(plot)}
                style={{
                  padding: '12px', borderRadius: '10px',
                  border: `1.5px solid ${sel ? cfg.color : '#f1f5f9'}`,
                  background: sel ? cfg.bg : '#fff',
                  cursor: 'pointer', transition: 'all 0.15s',
                  boxShadow: sel ? `0 2px 8px ${cfg.color}22` : 'none',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>Plot {plot.plotNumber}</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{getProjectName(plot)}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{formatSize(plot.size)} sqft</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    <FaCompass style={{ fontSize: '10px', marginRight: '3px' }} />{plot.facing}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#d97706' }}>{formatCurrency(plot.price)}</span>
                </div>
              </div>
            );
          })}
          {filteredPlots.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 12px', color: '#94a3b8', fontSize: '13px' }}>
              <FaMapMarkerAlt style={{ fontSize: '28px', marginBottom: '10px', color: '#cbd5e1', display: 'block', margin: '0 auto 10px' }} />
              No plots match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
