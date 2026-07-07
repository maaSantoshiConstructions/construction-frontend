import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlotMapData } from '../../api/plots';
import { getProjects } from '../../api/projects';
import { FaMapMarkerAlt, FaFilter, FaTimes, FaCircle, FaCrosshairs, FaPlus, FaMinus, FaSearch, FaRedoAlt } from 'react-icons/fa';
import Loader from '../../components/common/Loader';

const statusConfig = {
  available: { color: '#10b981', bg: '#ecfdf5', text: '#059669', label: 'Available' },
  reserved: { color: '#f59e0b', bg: '#fef3c7', text: '#d97706', label: 'Reserved' },
  sold: { color: '#ef4444', bg: '#fee2e2', text: '#dc2626', label: 'Sold' },
};

const plotPositions = {
  'A-101': { x: 60, y: 60, w: 85, h: 65 },
  'A-102': { x: 160, y: 60, w: 85, h: 65 },
  'A-103': { x: 260, y: 60, w: 85, h: 65 },
  'A-104': { x: 360, y: 60, w: 85, h: 65 },
  'B-201': { x: 60, y: 240, w: 85, h: 65 },
  'B-202': { x: 160, y: 240, w: 85, h: 65 },
  'B-203': { x: 260, y: 240, w: 85, h: 65 },
  'B-204': { x: 360, y: 240, w: 85, h: 65 },
  'C-101': { x: 500, y: 60, w: 90, h: 70 },
  'C-102': { x: 610, y: 60, w: 90, h: 70 },
  'C-103': { x: 500, y: 235, w: 90, h: 70 },
  'C-104': { x: 610, y: 235, w: 90, h: 70 },
};

const getPlotPosition = (plot, index) => {
  if (plotPositions[plot.plotNumber]) {
    return plotPositions[plot.plotNumber];
  }
  const col = index % 4;
  const row = Math.floor(index / 4);
  return {
    x: 60 + col * 110,
    y: 60 + row * 150,
    w: 85,
    h: 65,
  };
};

export default function PlotMap() {
  const [searchParams] = useSearchParams();
  const projectFilter = searchParams.get('project');
  const [plots, setPlots] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    project: projectFilter || '',
    facing: '',
    status: '',
    sizeRange: '',
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plotsRes, projectsRes] = await Promise.all([
          getPlotMapData({ project: projectFilter }),
          getProjects({ limit: 50 }),
        ]);
        setPlots(plotsRes?.data?.data || []);
        setProjects(projectsRes?.data?.data || []);
      } catch {
        setPlots([
          { _id: '1', plotNumber: 'A-101', project: 'Green City', facing: 'North', size: 1200, price: 999000, status: 'available' },
          { _id: '2', plotNumber: 'A-102', project: 'Green City', facing: 'East', size: 1500, price: 1250000, status: 'reserved' },
          { _id: '3', plotNumber: 'A-103', project: 'Green City', facing: 'East', size: 1500, price: 1250000, status: 'sold' },
          { _id: '4', plotNumber: 'A-104', project: 'Green City', facing: 'North', size: 1200, price: 999000, status: 'available' },
          { _id: '5', plotNumber: 'B-201', project: 'Green City', facing: 'South', size: 1000, price: 875000, status: 'sold' },
          { _id: '6', plotNumber: 'B-202', project: 'Green City', facing: 'West', size: 1800, price: 1500000, status: 'available' },
          { _id: '7', plotNumber: 'B-203', project: 'Green City', facing: 'South', size: 1000, price: 875000, status: 'available' },
          { _id: '8', plotNumber: 'B-204', project: 'Green City', facing: 'West', size: 1800, price: 1500000, status: 'reserved' },
          { _id: '9', plotNumber: 'C-101', project: 'Royal Enclave', facing: 'North-East', size: 1350, price: 1450000, status: 'available' },
          { _id: '10', plotNumber: 'C-102', project: 'Royal Enclave', facing: 'North-East', size: 1350, price: 1450000, status: 'sold' },
          { _id: '11', plotNumber: 'C-103', project: 'Royal Enclave', facing: 'South-West', size: 1600, price: 1750000, status: 'available' },
          { _id: '12', plotNumber: 'C-104', project: 'Royal Enclave', facing: 'South-West', size: 1600, price: 1750000, status: 'available' },
        ]);
        setProjects([
          { _id: '1', name: 'Green City' },
          { _id: '2', name: 'Royal Enclave' },
          { _id: '3', name: 'Silver Spring' },
          { _id: '4', name: 'Sunrise Meadows' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectFilter]);

  const filteredPlots = plots.filter((plot) => {
    if (searchQuery && !plot.plotNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.project && !plot.project?.toLowerCase().includes(filters.project.toLowerCase())) return false;
    if (filters.facing && !plot.facing?.toLowerCase().includes(filters.facing.toLowerCase())) return false;
    if (filters.status && plot.status !== filters.status) return false;
    if (filters.sizeRange) {
      const [min, max] = filters.sizeRange.split('-').map(Number);
      if (max && (plot.size < min || plot.size > max)) return false;
      if (!max && plot.size < min) return false;
    }
    return true;
  });

  const handlePlotClick = (plot) => {
    setSelectedPlot(plot);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2.4));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.8));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const formatCurrency = (val) => '₹ ' + (val || 0).toLocaleString('en-IN');

  if (loading) return <Loader />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 67px)', background: '#f4f6fa', overflow: 'hidden' }}>

      {/* Outer row wrapper */}
      <div style={{ display: 'flex', flex: 1, flexDirection: 'row', overflow: 'hidden', position: 'relative' }}>

        {/* Left Sidebar: Filters & List */}
        <div style={{
          width: isMobile ? '100%' : '340px',
          background: '#fff',
          borderRight: '1px solid var(--line)',
          display: isMobile ? (showFilters ? 'flex' : 'none') : 'flex',
          flexDirection: 'column',
          height: '100%',
          boxSizing: 'border-box',
          position: isMobile ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          zIndex: 100,
          boxShadow: isMobile ? 'none' : '4px 0 20px rgba(0,0,0,0.02)',
        }}>
          {/* Sidebar Header */}
          <div style={{ padding: '20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                <FaFilter style={{ color: 'var(--indigo)', fontSize: '14px' }} /> Master Plan Finder
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--gray)', fontWeight: 500, marginTop: '2px', display: 'block' }}>
                JSM Infrastructure Layout Plan
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#f0effc', color: 'var(--indigo)', fontSize: '11.5px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px' }}>
                {filteredPlots.length} Matches
              </span>
              {isMobile && (
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  style={{ background: '#f4f6fa', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '14px', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar Filters & List Scroll Container */}
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 1 }}>

            {/* Search Plot number */}
            <div style={{ position: 'relative' }}>
              <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)', fontSize: '13px' }} />
              <input
                type="text"
                placeholder="Search plot number... (e.g. A-101)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '34px' }}
              />
            </div>

            {/* Filter Fields Box */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Project Name</label>
                <select
                  value={filters.project}
                  onChange={(e) => setFilters({ ...filters, project: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">All Featured Projects</option>
                  {projects.map((p) => <option key={p._id} value={p.name}>{p.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Facing</label>
                  <select
                    value={filters.facing}
                    onChange={(e) => setFilters({ ...filters, facing: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">All Directions</option>
                    {['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Size (sq ft)</label>
                  <select
                    value={filters.sizeRange}
                    onChange={(e) => setFilters({ ...filters, sizeRange: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">Any Size</option>
                    <option value="0-1000">Up to 1000</option>
                    <option value="1000-1500">1000 - 1500</option>
                    <option value="1500-2000">1500 - 2000</option>
                    <option value="2000">2000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Status Filter</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {Object.entries(statusConfig).map(([key, cfg]) => {
                    const isSelected = filters.status === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFilters({ ...filters, status: filters.status === key ? '' : key })}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 600,
                          border: `1px solid ${isSelected ? 'transparent' : 'var(--line)'}`,
                          cursor: 'pointer',
                          background: isSelected ? cfg.color : '#fff',
                          color: isSelected ? '#fff' : 'var(--gray)',
                          transition: 'all 0.2s',
                          outline: 'none',
                        }}
                      >
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: isSelected ? '#fff' : cfg.color, marginRight: '6px' }} />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setFilters({ project: '', facing: '', status: '', sizeRange: '' }); setSearchQuery(''); }}
                style={{
                  padding: '4px',
                  border: 'none',
                  background: 'none',
                  color: 'var(--indigo)',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                  outline: 'none',
                }}
              >
                Clear filters
              </button>
            </div>

            {/* List Header & Scroll Block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                  Interactive Plots ({filteredPlots.length})
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredPlots.map((plot) => {
                  const isSelected = selectedPlot?._id === plot._id;
                  const cfg = statusConfig[plot.status] || statusConfig.available;
                  return (
                    <div
                      key={plot._id}
                      onClick={() => handlePlotClick(plot)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: `1.5px solid ${isSelected ? 'var(--indigo)' : '#eef1f6'}`,
                        background: isSelected ? '#f5f4fd' : '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        boxShadow: isSelected ? '0 4px 12px rgba(91,79,224,0.06)' : '0 2px 4px rgba(0,0,0,0.01)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, color: 'var(--text)', fontSize: '14.5px' }}>Plot {plot.plotNumber}</span>
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', background: cfg.bg, color: cfg.text }}>
                          {cfg.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <span style={{ fontSize: '11.5px', color: 'var(--gray)' }}>{plot.project}</span>
                        <span style={{ fontSize: '11.5px', color: 'var(--text)', fontWeight: 600 }}>{plot.size} sq ft</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', borderTop: '1px solid #f4f6fa', paddingTop: '4px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--gray)' }}>Facing: <strong>{plot.facing}</strong></span>
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--gold-dark)' }}>{formatCurrency(plot.price)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area: Map Canvas */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

          {/* Mobile Filter Toggle Button */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 10,
                padding: '10px 16px',
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '13.5px',
                fontWeight: 600,
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FaFilter style={{ color: 'var(--indigo)' }} /> Filter Plots
            </button>
          )}

          {/* Map Controls (Zoom In, Zoom Out, Reset) */}
          <div style={{
            position: 'absolute',
            bottom: isMobile ? '20px' : '30px',
            left: '20px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--line)',
            borderRadius: '12px',
            padding: '6px',
            boxShadow: '0 10px 25px rgba(15, 19, 58, 0.08)',
          }}>
            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom In"
              style={mapControlBtnStyle}
            >
              <FaPlus />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom Out"
              style={mapControlBtnStyle}
            >
              <FaMinus />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              title="Reset Layout View"
              style={mapControlBtnStyle}
            >
              <FaRedoAlt style={{ fontSize: '11px' }} />
            </button>
          </div>

          {/* Interactive Blueprint Map Viewport */}
          <div style={{ flex: 1, height: '100%', width: '100%', overflow: 'hidden', cursor: 'grab' }}>
            <svg
              viewBox="0 0 800 450"
              style={{
                width: '100%',
                height: '100%',
                background: '#eef2f7', // Clean soft light-grey draft backdrop
                fontFamily: 'Inter, sans-serif',
                display: 'block',
              }}
            >
              {/* Zoom & Pan Wrapper Group */}
              <g style={{
                transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                transformOrigin: 'center',
                transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>

                {/* Engineering Layout Grid Pattern */}
                <g stroke="#ffffff" strokeWidth="1">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <line key={`v-${i}`} x1={i * 35} y1="0" x2={i * 35} y2="450" opacity="0.45" />
                  ))}
                  {Array.from({ length: 15 }).map((_, i) => (
                    <line key={`h-${i}`} x1="0" y1={i * 35} x2={800} y2={i * 35} opacity="0.45" />
                  ))}
                </g>

                {/* Main Avenues / Roads */}
                {/* Main Avenue */}
                <rect x="15" y="155" width="770" height="55" fill="#dcdfe6" rx="8" />
                {/* Lane Dividers */}
                <line x1="15" y1="182" x2="785" y2="182" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="10 8" />
                <text x="390" y="187" fill="#8f93a9" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="4">MAIN AVENUE (12M WIDE)</text>

                {/* Sub Road */}
                <rect x="460" y="15" width="30" height="420" fill="#dcdfe6" rx="8" />
                <line x1="475" y1="15" x2="475" y2="435" stroke="#ffffff" strokeWidth="2" strokeDasharray="8 6" />
                <text x="477" y="225" fill="#8f93a9" fontSize="9" fontWeight="bold" textAnchor="middle" transform="rotate(-90 477 225)" letterSpacing="2.5">SUB ROAD (9M)</text>

                {/* Sector Greenspaces / Amenities */}
                {/* Central Park */}
                <rect x="30" y="325" width="415" height="95" fill="#e2f5e8" rx="14" stroke="#c2edd0" strokeWidth="1.5" />
                <rect x="35" y="330" width="405" height="85" fill="none" rx="10" stroke="#b2e7c3" strokeWidth="1" strokeDasharray="5 5" />
                <text x="237" y="370" fill="#2d7e48" fontSize="13" fontWeight="bold" textAnchor="middle" letterSpacing="1" fontFamily="Poppins">🌳 GREENWOOD CENTRAL PARK 🌳</text>
                <text x="237" y="388" fill="#528e67" fontSize="9.5" textAnchor="middle">Outdoor Gym, Kids Play Zone &amp; Jogging Tracks</text>

                {/* Scenic Waterfront */}
                <rect x="505" y="325" width="265" height="95" fill="#e3f2fd" rx="14" stroke="#c0e0fc" strokeWidth="1.5" />
                <text x="637" y="370" fill="#1e65c0" fontSize="13" fontWeight="bold" textAnchor="middle" letterSpacing="1" fontFamily="Poppins">💧 LAKEVIEW RESERVOIR 💧</text>
                <text x="637" y="388" fill="#467bbd" fontSize="9.5" textAnchor="middle">Waterfront Promenade &amp; Sitting Pavilion</text>

                {/* Sectors Labels */}
                <text x="222" y="42" fill="#8a90a8" fontSize="11" fontWeight="bold" letterSpacing="1.5" textAnchor="middle">BLOCK A &amp; B (PREMIUM PLOTS)</text>
                <text x="637" y="42" fill="#8a90a8" fontSize="11" fontWeight="bold" letterSpacing="1.5" textAnchor="middle">BLOCK C (ELITE PLOTS)</text>

                {/* Render Plot Nodes */}
                {plots.map((plot, idx) => {
                  const pos = getPlotPosition(plot, idx);
                  const isMatch = filteredPlots.some(p => p._id === plot._id);
                  const isSelected = selectedPlot?._id === plot._id;
                  const status = statusConfig[plot.status] || statusConfig.available;

                  return (
                    <g
                      key={plot._id}
                      style={{
                        opacity: isMatch ? 1 : 0.15,
                        cursor: isMatch ? 'pointer' : 'default',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => isMatch && handlePlotClick(plot)}
                    >
                      {/* Base Plot Container Card */}
                      <rect
                        x={pos.x}
                        y={pos.y}
                        width={pos.w}
                        height={pos.h}
                        rx="8"
                        fill="#ffffff"
                        stroke={isSelected ? 'var(--gold)' : '#cbd5e1'}
                        strokeWidth={isSelected ? 2.5 : 1}
                        style={{
                          filter: isSelected ? 'drop-shadow(0 4px 12px rgba(232, 179, 85, 0.25))' : 'none',
                          transition: 'all 0.2s',
                        }}
                      />

                      {/* Soft Status indicator in top corner */}
                      <circle
                        cx={pos.x + pos.w - 12}
                        cy={pos.y + 12}
                        r="4"
                        fill={status.color}
                      />

                      {/* Sold overlays for texture */}
                      {plot.status === 'sold' && (
                        <rect
                          x={pos.x + 3}
                          y={pos.y + 3}
                          width={pos.w - 6}
                          height={pos.h - 6}
                          fill="none"
                          rx="6"
                          stroke="#fee2e2"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                          opacity="0.8"
                        />
                      )}

                      {/* Plot Identification */}
                      <text
                        x={pos.x + pos.w / 2}
                        y={pos.y + pos.h / 2 - 2}
                        fill={isSelected ? 'var(--gold)' : 'var(--text)'}
                        fontSize="12.5"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        {plot.plotNumber}
                      </text>

                      {/* Plot Sizing Area */}
                      <text
                        x={pos.x + pos.w / 2}
                        y={pos.y + pos.h / 2 + 12}
                        fill="var(--gray)"
                        fontSize="8.5"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {plot.size} sq ft
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Blueprint Map Legend Overlay (Desktop) */}
          {!isMobile && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              zIndex: 10,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--line)',
              borderRadius: '10px',
              padding: '10px 14px',
              display: 'flex',
              gap: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
            }}>
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text)', fontWeight: 600 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cfg.color }} />
                  <span>{cfg.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Plot Details Modal popup (overlaid on the canvas) */}
          <AnimatePresence>
            {selectedPlot && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                style={{
                  position: 'absolute',
                  bottom: isMobile ? '16px' : '20px',
                  left: isMobile ? '16px' : 'auto',
                  right: '16px',
                  width: isMobile ? 'calc(100% - 32px)' : '330px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid var(--line)',
                  boxShadow: '0 20px 45px rgba(10, 15, 46, 0.1)',
                  padding: '24px',
                  zIndex: 120,
                  boxSizing: 'border-box',
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedPlot(null)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: '#f4f6fa',
                    border: 'none',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    outline: 'none',
                  }}
                >
                  <FaTimes />
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--indigo)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
                      {selectedPlot.project}
                    </span>
                    <h4 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', margin: '4px 0 0', fontFamily: 'Poppins, sans-serif' }}>
                      Plot {selectedPlot.plotNumber}
                    </h4>
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: statusConfig[selectedPlot.status]?.bg,
                    color: statusConfig[selectedPlot.status]?.text,
                    textTransform: 'capitalize',
                  }}>
                    {selectedPlot.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '12px 0' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--gray)', fontWeight: 600, display: 'block' }}>FACING DIRECTION</span>
                    <p style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text)', margin: '2px 0 0' }}>{selectedPlot.facing}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--gray)', fontWeight: 600, display: 'block' }}>PLOT SIZING</span>
                    <p style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text)', margin: '2px 0 0' }}>{selectedPlot.size} sq ft</p>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ fontSize: '10px', color: 'var(--gray)', fontWeight: 600, display: 'block' }}>TOTAL PRICE</span>
                    <p style={{ fontSize: '19px', fontWeight: 800, color: 'var(--gold-dark)', margin: '2px 0 0' }}>
                      {formatCurrency(selectedPlot.price)}
                    </p>
                  </div>
                </div>

                {selectedPlot.status === 'available' ? (
                  <Link
                    to="/book-visit"
                    className="btn-gold"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      border: 'none',
                      display: 'flex',
                    }}
                  >
                    <FaCrosshairs style={{ fontSize: '13px', marginRight: '6px' }} /> Schedule Visit to Book
                  </Link>
                ) : (
                  <div style={{
                    width: '100%',
                    textAlign: 'center',
                    padding: '12px',
                    background: '#f8f8fc',
                    color: 'var(--gray)',
                    fontSize: '13px',
                    fontWeight: 600,
                    borderRadius: '8px',
                    border: '1px solid var(--line)',
                  }}>
                    This plot is currently {selectedPlot.status}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}

/* ===== Styled Helper Objects ===== */
const labelStyle = {
  display: 'block',
  fontSize: '12.5px',
  fontWeight: 600,
  color: 'var(--text)',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid var(--line)',
  borderRadius: '8px',
  fontSize: '13.5px',
  color: 'var(--text)',
  outline: 'none',
  background: '#fff',
  fontFamily: 'Inter, sans-serif',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const mapControlBtnStyle = {
  width: '32px',
  height: '32px',
  background: '#fff',
  border: 'none',
  color: 'var(--text)',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
  fontSize: '13px',
  transition: 'background 0.2s',
  outline: 'none',
};
