import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getPlotMapData } from '../../api/plots';
import { getProjects } from '../../api/projects';
import {
  FaMapMarkerAlt, FaFilter, FaTimes,
  FaSearch, FaHome, FaRoad, FaTree, FaRulerCombined,
  FaCompass, FaTh, FaMap, FaListAlt,
  FaStar, FaChartLine, FaCalendarAlt, FaBuilding,
  FaExternalLinkAlt, FaBookmark,
} from 'react-icons/fa';
import Loader from '../../components/common/Loader';

const statusConfig = {
  available: { color: '#22c55e', bg: '#f0fdf4', text: '#15803d', border: '#86efac', label: 'Available' },
  reserved: { color: '#f59e0b', bg: '#fffbeb', text: '#b45309', border: '#fcd34d', label: 'Reserved' },
  sold: { color: '#ef4444', bg: '#fef2f2', text: '#b91c1c', border: '#fca5a5', label: 'Sold' },
  blocked: { color: '#94a3b8', bg: '#f8fafc', text: '#475569', border: '#cbd5e1', label: 'Blocked' },
};

const projectColors = [
  { fill: '#eef2ff', stroke: '#c7d2fe', header: '#4338ca', light: '#e0e7ff' },
  { fill: '#ecfdf5', stroke: '#a7f3d0', header: '#059669', light: '#d1fae5' },
  { fill: '#fefce8', stroke: '#fde68a', header: '#ca8a04', light: '#fef9c3' },
  { fill: '#fdf2f8', stroke: '#fbcfe8', header: '#be185d', light: '#fce7f3' },
  { fill: '#f0f9ff', stroke: '#bae6fd', header: '#0284c7', light: '#e0f2fe' },
];

const formatCurrency = (val) => '\u20B9' + (val || 0).toLocaleString('en-IN');
const formatSize = (val) => (val || 0).toLocaleString('en-IN');

const makeIcon = L.divIcon({
  className: '',
  html: '<div style="width:22px;height:22px;border-radius:50%;background:#2563eb;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const selectedIcon = L.divIcon({
  className: '',
  html: '<div style="width:28px;height:28px;border-radius:50%;background:#dc2626;border:3px solid #fff;box-shadow:0 2px 8px rgba(220,38,38,0.5)"></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function makeLandmarkIcon(emoji) {
  return L.divIcon({
    className: '',
    html: `<div style="width:26px;height:26px;border-radius:6px;background:#fff;border:2px solid #e5e7eb;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 1px 4px rgba(0,0,0,0.12)">${emoji}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14, { duration: 0.8 });
  }, [center, map]);
  return null;
}

function getLandmarks(city) {
  const map = {
    Bhubaneswar: [
      { name: 'KIIT University', type: 'School', lat: 20.3524, lng: 85.8128, emoji: '\uD83C\uDF93' },
      { name: 'AIIMS Bhubaneswar', type: 'Hospital', lat: 20.2532, lng: 85.7788, emoji: '\uD83C\uDFE5' },
      { name: 'NH-16 Bypass', type: 'Highway', lat: 20.3150, lng: 85.8120, emoji: '\uD83D\uDEE3\uFE0F' },
      { name: 'Unit 4 Market', type: 'Market', lat: 20.2934, lng: 85.8245, emoji: '\uD83D\uDED2' },
      { name: 'Kalinga Stadium', type: 'Landmark', lat: 20.2861, lng: 85.8020, emoji: '\u26BD' },
    ],
    Khordha: [
      { name: 'Khordha Town', type: 'Town', lat: 20.1822, lng: 85.6163, emoji: '\uD83C\uDFDB\uFE0F' },
      { name: 'Khordha Hospital', type: 'Hospital', lat: 20.1830, lng: 85.6170, emoji: '\uD83C\uDFE5' },
      { name: 'NH-16', type: 'Highway', lat: 20.1750, lng: 85.6200, emoji: '\uD83D\uDEE3\uFE0F' },
    ],
    Cuttack: [
      { name: 'SCB Medical College', type: 'Hospital', lat: 20.4867, lng: 85.8846, emoji: '\uD83C\uDFE5' },
      { name: 'Barabati Stadium', type: 'Landmark', lat: 20.4833, lng: 85.8668, emoji: '\u26BD' },
      { name: 'Nehru Bazaar', type: 'Market', lat: 20.4700, lng: 85.8800, emoji: '\uD83D\uDED2' },
    ],
    Puri: [
      { name: 'Jagannath Temple', type: 'Landmark', lat: 19.8050, lng: 85.8181, emoji: '\uD83D\uDD4C' },
      { name: 'Puri Beach', type: 'Landmark', lat: 19.7983, lng: 85.8250, emoji: '\uD83C\uDFD6\uFE0F' },
      { name: 'NH-16 Puri Road', type: 'Highway', lat: 19.8150, lng: 85.8200, emoji: '\uD83D\uDEE3\uFE0F' },
    ],
  };
  return map[city] || [];
}

function getAIInsights(plot) {
  if (!plot) return null;
  const score = plot.status === 'available' ? (plot.corner ? 92 : 85) : 60;
  const bestFor = [];
  if (plot.corner) bestFor.push('Investment');
  if (plot.size > 1200) bestFor.push('Family Villa');
  if (plot.facing === 'East' || plot.facing === 'North-East') bestFor.push('Vastu Preferred');
  if (plot.status === 'available') bestFor.push('First-time Buyers');
  if (bestFor.length === 0) bestFor.push('Residential Plot');
  const highlights = [];
  if (plot.roadWidth >= 30) highlights.push('Wide Road Access');
  if (plot.corner) highlights.push('Corner Plot Advantage');
  if (plot.facing === 'East') highlights.push('Morning Sunlight');
  if (plot.facing === 'North-East') highlights.push('Ishaan Corner (Auspicious)');
  highlights.push('Developing Locality');
  return { score, bestFor, highlights, appreciation: score > 80 ? 'High (12-18% p.a.)' : 'Moderate (8-12% p.a.)' };
}

export default function PlotMap() {
  const [searchParams] = useSearchParams();
  const projectFilter = searchParams.get('project');
  const [plots, setPlots] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('layout');
  const [filters, setFilters] = useState({ project: '', facing: '', status: '', sizeRange: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

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
        setPlots([]);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectFilter]);

  const getProjectName = useCallback((plot) => {
    if (plot.project?.name) return plot.project.name;
    if (typeof plot.project === 'string') {
      const found = projects.find((p) => p._id === plot.project);
      return found?.name || 'Unknown Project';
    }
    return 'Unknown Project';
  }, [projects]);

  const getProjectCity = useCallback((plot) => {
    if (plot.project?.location?.city) return plot.project.location.city;
    if (typeof plot.project === 'string') {
      const found = projects.find((p) => p._id === plot.project);
      return found?.location?.city || '';
    }
    return '';
  }, [projects]);

  const getProjectObj = useCallback((plot) => {
    if (plot.project && typeof plot.project === 'object') return plot.project;
    if (typeof plot.project === 'string') return projects.find((p) => p._id === plot.project) || null;
    return null;
  }, [projects]);

  const filteredPlots = useMemo(() => {
    return plots.filter((plot) => {
      if (searchQuery && !plot.plotNumber?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      const pName = getProjectName(plot);
      if (filters.project && pName !== filters.project) return false;
      if (filters.facing && plot.facing !== filters.facing) return false;
      if (filters.status && plot.status !== filters.status) return false;
      if (filters.sizeRange) {
        const [min, max] = filters.sizeRange.split('-').map(Number);
        if (max && (plot.size < min || plot.size > max)) return false;
        if (!max && plot.size < min) return false;
      }
      return true;
    });
  }, [plots, searchQuery, filters, getProjectName]);

  const groupedByProject = useMemo(() => {
    const groups = {};
    filteredPlots.forEach((plot) => {
      const name = getProjectName(plot);
      if (!groups[name]) groups[name] = [];
      groups[name].push(plot);
    });
    return Object.entries(groups);
  }, [filteredPlots, getProjectName]);

  const stats = useMemo(() => {
    const s = { total: filteredPlots.length, available: 0, sold: 0, reserved: 0, blocked: 0 };
    filteredPlots.forEach((p) => { if (s[p.status] !== undefined) s[p.status]++; });
    return s;
  }, [filteredPlots]);

  const currentProject = useMemo(() => {
    if (!selectedPlot) return null;
    return getProjectObj(selectedPlot);
  }, [selectedPlot, getProjectObj]);

  const projectStats = useMemo(() => {
    if (!selectedPlot) return null;
    const pName = getProjectName(selectedPlot);
    const projPlots = plots.filter((p) => getProjectName(p) === pName);
    const s = { total: projPlots.length, available: 0, sold: 0, reserved: 0, blocked: 0 };
    projPlots.forEach((p) => { if (s[p.status] !== undefined) s[p.status]++; });
    return s;
  }, [selectedPlot, plots, getProjectName]);

  const mapCenter = useMemo(() => {
    if (!selectedPlot && filteredPlots.length === 0) return [20.2961, 85.8245];
    if (selectedPlot) {
      const proj = getProjectObj(selectedPlot);
      if (proj?.location?.coordinates?.lat) return [proj.location.coordinates.lat, proj.location.coordinates.lng];
    }
    for (const p of filteredPlots) {
      const proj = getProjectObj(p);
      if (proj?.location?.coordinates?.lat) return [proj.location.coordinates.lat, proj.location.coordinates.lng];
    }
    return [20.2961, 85.8245];
  }, [selectedPlot, filteredPlots, getProjectObj]);

  if (loading) return <Loader />;

  const viewBtns = [
    { key: 'layout', icon: <FaTh />, label: 'Layout' },
    { key: 'map', icon: <FaMap />, label: 'Map' },
    { key: 'table', icon: <FaListAlt />, label: 'Table' },
  ];

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '16px' : '20px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
                <FaMapMarkerAlt style={{ color: '#fff', fontSize: '18px' }} />
              </div>
              <div>
                <h1 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'Poppins, sans-serif', lineHeight: 1.2 }}>
                  Plot Map
                </h1>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>
                  JSM Infrastructure — Site Layout
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { key: 'total', label: 'Total', count: stats.total, color: '#1e293b', bg: '#f1f5f9' },
                { key: 'available', label: 'Available', count: stats.available, color: '#15803d', bg: '#f0fdf4' },
                { key: 'sold', label: 'Sold', count: stats.sold, color: '#b91c1c', bg: '#fef2f2' },
                { key: 'reserved', label: 'Reserved', count: stats.reserved, color: '#b45309', bg: '#fffbeb' },
              ].map((s) => (
                <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '10px', background: s.bg, border: '1px solid #e5e7eb' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: s.color }}>{s.count}</span>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '16px' : '24px 32px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

        {/* LEFT SIDEBAR */}
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
                  {[...new Set(plots.map((p) => getProjectName(p)))].map((name) => (
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

        {/* RIGHT CONTENT */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {isMobile && !showFilters && (
            <button type="button" onClick={() => setShowFilters(true)}
              style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 150, padding: '14px 20px', background: '#2563eb', border: 'none', borderRadius: '14px', boxShadow: '0 4px 16px rgba(37,99,235,0.4)', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaFilter /> Filters ({filteredPlots.length})
            </button>
          )}

          {/* PROJECT SUMMARY BAR */}
          {selectedPlot && currentProject && (
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: isMobile ? '16px' : '18px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FaBuilding style={{ color: '#fff', fontSize: '14px' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentProject.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                    {currentProject.location?.city}{currentProject.location?.state ? `, ${currentProject.location.state}` : ''}
                    {currentProject.status && <span style={{ marginLeft: '8px', padding: '2px 8px', borderRadius: '6px', background: '#f0fdf4', color: '#15803d', fontWeight: 600, fontSize: '11px', textTransform: 'capitalize' }}>{currentProject.status}</span>}
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)', gap: '10px' }}>
                <SummaryItem label="Total" value={projectStats?.total || 0} color="#1e293b" />
                <SummaryItem label="Available" value={projectStats?.available || 0} color="#15803d" />
                <SummaryItem label="Reserved" value={projectStats?.reserved || 0} color="#b45309" />
                <SummaryItem label="Sold" value={projectStats?.sold || 0} color="#b91c1c" />
                {!isMobile && <SummaryItem label="Price/Sqft" value={currentProject.pricePerSqft ? formatCurrency(currentProject.pricePerSqft) : 'N/A'} color="#2563eb" />}
                {currentProject.possessionDate && !isMobile && (
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Possession</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                      <FaCalendarAlt style={{ fontSize: '11px', marginRight: '4px', color: '#94a3b8' }} />
                      {new Date(currentProject.possessionDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW SWITCHER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
              {viewBtns.map((v) => (
                <button key={v.key} type="button" onClick={() => setActiveView(v.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px',
                    border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                    background: activeView === v.key ? '#2563eb' : 'transparent',
                    color: activeView === v.key ? '#fff' : '#64748b',
                    transition: 'all 0.15s', fontFamily: 'Inter, sans-serif',
                  }}>
                  {v.icon} {v.label}
                </button>
              ))}
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: cfg.color }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* LAYOUT VIEW */}
              {activeView === 'layout' && (
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: isMobile ? '12px' : '24px', overflowX: 'auto' }}>
                  {filteredPlots.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                      <FaMapMarkerAlt style={{ fontSize: '40px', marginBottom: '12px', color: '#cbd5e1' }} />
                      <p style={{ fontSize: '15px', fontWeight: 600 }}>No plots to display</p>
                      <p style={{ fontSize: '13px', marginTop: '4px' }}>Adjust your filters or search query.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                      {groupedByProject.map(([projectName, projectPlots], pi) => {
                        const colorSet = projectColors[pi % projectColors.length];
                        const cols = 5;
                        const rows = Math.ceil(projectPlots.length / cols);
                        return (
                          <div key={projectName} style={{ border: `2px solid ${colorSet.stroke}`, borderRadius: '16px', overflow: 'hidden', background: colorSet.fill }}>
                            <div style={{ background: colorSet.header, color: '#fff', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaHome style={{ fontSize: '16px', opacity: 0.9 }} />
                                <span style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>{projectName}</span>
                              </div>
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', fontWeight: 600, opacity: 0.85, background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '8px' }}>
                                  {projectPlots.length} Plots
                                </span>
                                <span style={{ fontSize: '12px', fontWeight: 600, opacity: 0.85, background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '8px' }}>
                                  {rows} Rows
                                </span>
                              </div>
                            </div>
                            <div style={{ background: '#e5e7eb', padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <FaRoad style={{ color: '#6b7280', fontSize: '11px' }} />
                              <span style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Main Access Road — 30 ft</span>
                            </div>
                            <div style={{ padding: '16px 20px' }}>
                              {Array.from({ length: rows }, (_, rowIdx) => {
                                const rowPlots = projectPlots.slice(rowIdx * cols, (rowIdx + 1) * cols);
                                return (
                                  <div key={rowIdx}>
                                    {rowIdx > 0 && (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '10px 0', padding: '4px 0' }}>
                                        <div style={{ flex: 1, height: '1px', background: 'repeating-linear-gradient(90deg, #d1d5db 0, #d1d5db 6px, transparent 6px, transparent 12px)' }} />
                                        <FaRoad style={{ color: '#9ca3af', fontSize: '9px' }} />
                                        <span style={{ fontSize: '9px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Internal Road — 20 ft</span>
                                        <div style={{ flex: 1, height: '1px', background: 'repeating-linear-gradient(90deg, #d1d5db 0, #d1d5db 6px, transparent 6px, transparent 12px)' }} />
                                      </div>
                                    )}
                                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(rowPlots.length, cols)}, 1fr)`, gap: '10px' }}>
                                      {rowPlots.map((plot) => {
                                        const st = statusConfig[plot.status] || statusConfig.available;
                                        const sel = selectedPlot?._id === plot._id;
                                        return (
                                          <div key={plot._id} onClick={() => setSelectedPlot(plot)}
                                            style={{
                                              border: `2px solid ${sel ? st.color : st.border}`,
                                              borderRadius: '10px',
                                              background: sel ? st.bg : '#fff',
                                              cursor: 'pointer',
                                              padding: '10px',
                                              textAlign: 'center',
                                              transition: 'all 0.15s',
                                              boxShadow: sel ? `0 4px 12px ${st.color}25` : '0 1px 3px rgba(0,0,0,0.06)',
                                              position: 'relative',
                                            }}
                                            onMouseEnter={(e) => { if (!sel) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; } }}
                                            onMouseLeave={(e) => { if (!sel) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; } }}
                                          >
                                            <div style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', borderRadius: '50%', background: st.color }} />
                                            {plot.corner && (
                                              <div style={{ position: 'absolute', top: '6px', left: '6px', fontSize: '8px', fontWeight: 700, color: '#d97706', background: '#fffbeb', padding: '1px 4px', borderRadius: '4px', border: '1px solid #fde68a' }}>
                                                CORNER
                                              </div>
                                            )}
                                            <div style={{ fontSize: '16px', fontWeight: 800, color: sel ? st.color : '#0f172a', fontFamily: 'Poppins, sans-serif', lineHeight: 1.2 }}>
                                              {plot.plotNumber}
                                            </div>
                                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginTop: '4px' }}>
                                              {formatSize(plot.size)} sqft
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px', fontSize: '10px', color: '#94a3b8' }}>
                                              <FaCompass style={{ fontSize: '9px' }} />
                                              {plot.facing}
                                            </div>
                                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#d97706', marginTop: '4px' }}>
                                              {formatCurrency(plot.price)}
                                            </div>
                                            {plot.roadWidth && (
                                              <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '3px' }}>
                                                <FaRulerCombined style={{ fontSize: '8px', marginRight: '2px' }} />
                                                {plot.roadWidth} ft road
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div style={{ margin: '0 20px 16px', padding: '10px 16px', background: '#f0fdf4', border: '1.5px dashed #86efac', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                              <FaTree style={{ color: '#22c55e', fontSize: '14px' }} />
                              <span style={{ fontSize: '12px', fontWeight: 600, color: '#15803d' }}>Central Park & Green Area</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* MAP VIEW */}
              {activeView === 'map' && (
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', height: '600px' }}>
                  <MapContainer center={mapCenter} zoom={12} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true}>
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapRecenter center={mapCenter} />
                    {filteredPlots.filter((p) => {
                      const proj = getProjectObj(p);
                      return proj?.location?.coordinates?.lat;
                    }).map((plot) => {
                      const proj = getProjectObj(plot);
                      const center = proj.location.coordinates;
                      const city = getProjectCity(plot);
                      const landmarks = getLandmarks(city);
                      const sel = selectedPlot?._id === plot._id;
                      return (
                        <div key={plot._id}>
                          <Marker
                            position={[center.lat, center.lng]}
                            icon={sel ? selectedIcon : makeIcon}
                            eventHandlers={{ click: () => setSelectedPlot(plot) }}
                          >
                            <Popup>
                              <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '180px' }}>
                                <strong style={{ fontSize: '14px' }}>Plot {plot.plotNumber}</strong><br />
                                <span style={{ color: '#64748b', fontSize: '12px' }}>{getProjectName(plot)}</span><br />
                                <span style={{ fontSize: '12px' }}>{formatSize(plot.size)} sqft &middot; {plot.facing}</span><br />
                                <strong style={{ color: '#d97706' }}>{formatCurrency(plot.price)}</strong>
                              </div>
                            </Popup>
                          </Marker>
                          {landmarks.map((lm, li) => (
                            <Marker key={li} position={[lm.lat, lm.lng]} icon={makeLandmarkIcon(lm.emoji)}>
                              <Popup><span style={{ fontFamily: 'Inter, sans-serif' }}><strong>{lm.name}</strong><br />{lm.type}</span></Popup>
                            </Marker>
                          ))}
                        </div>
                      );
                    })}
                  </MapContainer>
                </div>
              )}

              {/* TABLE VIEW */}
              {activeView === 'table' && (
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          {['Plot #', 'Project', 'Size (sqft)', 'Facing', 'Road', 'Price', 'Status'].map((h) => (
                            <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPlots.map((plot) => {
                          const cfg = statusConfig[plot.status] || statusConfig.available;
                          const sel = selectedPlot?._id === plot._id;
                          return (
                            <tr key={plot._id} onClick={() => setSelectedPlot(plot)}
                              style={{ cursor: 'pointer', background: sel ? cfg.bg : '#fff', borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s' }}
                              onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = '#f8fafc'; }}
                              onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = '#fff'; }}
                            >
                              <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{plot.plotNumber}</td>
                              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{getProjectName(plot)}</td>
                              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>{formatSize(plot.size)}</td>
                              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{plot.facing}</td>
                              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{plot.roadWidth ? `${plot.roadWidth} ft` : '—'}</td>
                              <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#d97706' }}>{formatCurrency(plot.price)}</td>
                              <td style={{ padding: '12px 16px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredPlots.length === 0 && (
                          <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '48px 16px', color: '#94a3b8', fontSize: '14px' }}>No plots match your filters.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* STICKY PLOT DETAILS (Desktop) */}
            {!isMobile && selectedPlot && (
              <div style={{ width: '380px', flexShrink: 0, position: 'sticky', top: '24px' }}>
                <PlotDetailsContent plot={selectedPlot} onClose={() => setSelectedPlot(null)} getProjectName={getProjectName} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET */}
      <AnimatePresence>
        {selectedPlot && isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedPlot(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300 }}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxHeight: '75vh', background: '#fff', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', zIndex: 310, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -4px 24px rgba(0,0,0,0.12)' }}
            >
              <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#d1d5db' }} />
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <PlotDetailsContent plot={selectedPlot} onClose={() => setSelectedPlot(null)} getProjectName={getProjectName} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .plot-map-layout { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}

function PlotDetailsContent({ plot, onClose, getProjectName }) {
  const ai = getAIInsights(plot);
  const st = statusConfig[plot.status] || statusConfig.available;
  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{getProjectName(plot)}</span>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '4px 0 0', fontFamily: 'Poppins, sans-serif' }}>Plot {plot.plotNumber}</h2>
          <span style={{ display: 'inline-block', marginTop: '8px', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>{st.label}</span>
        </div>
        <button type="button" onClick={onClose}
          style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#64748b', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', outline: 'none', flexShrink: 0 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#64748b'; }}>
          <FaTimes />
        </button>
      </div>

      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <InfoCard icon={<FaRulerCombined />} label="Plot Size" value={`${formatSize(plot.size)} sqft`} />
          <InfoCard icon={<FaCompass />} label="Facing" value={plot.facing || '—'} />
          {plot.roadWidth && <InfoCard icon={<FaRoad />} label="Road Width" value={`${plot.roadWidth} ft`} />}
          {plot.corner && <InfoCard icon={<FaMapMarkerAlt />} label="Type" value="Corner Plot" highlight />}
        </div>

        <div style={{ padding: '16px', background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', borderRadius: '12px', border: '1px solid #fde68a' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Total Price</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#92400e', fontFamily: 'Poppins, sans-serif' }}>{formatCurrency(plot.price)}</div>
          {plot.pricePerSqft && <div style={{ fontSize: '13px', color: '#b45309', marginTop: '2px', fontWeight: 500 }}>@ {formatCurrency(plot.pricePerSqft)}/sqft</div>}
        </div>

        {ai && (
          <div style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderRadius: '12px', border: '1px solid #bfdbfe', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <FaChartLine style={{ color: '#2563eb', fontSize: '16px' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af', fontFamily: 'Poppins, sans-serif' }}>AI Insights</span>
              <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 600, color: '#93c5fd', fontStyle: 'italic' }}>placeholder</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff', border: '2px solid #2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#2563eb' }}>{ai.score}</span>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af' }}>Investment Score</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Based on location, price & demand</div>
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', marginBottom: '6px' }}>Best For</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {ai.bestFor.map((b) => (
                  <span key={b} style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '6px', background: '#fff', color: '#1e40af', border: '1px solid #bfdbfe' }}>{b}</span>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', marginBottom: '6px' }}>Key Highlights</div>
              {ai.highlights.map((h) => (
                <div key={h} style={{ fontSize: '12px', color: '#475569', padding: '3px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaStar style={{ color: '#f59e0b', fontSize: '10px', flexShrink: 0 }} /> {h}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: '#fff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <FaChartLine style={{ color: '#22c55e', fontSize: '13px' }} />
              <span style={{ fontSize: '12px', color: '#475569' }}>Future Appreciation: </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#15803d' }}>{ai.appreciation}</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { label: 'Plot Number', value: plot.plotNumber },
            { label: 'Facing', value: plot.facing },
            plot.roadWidth && { label: 'Road Width', value: `${plot.roadWidth} ft` },
            plot.corner !== undefined && { label: 'Corner Plot', value: plot.corner ? 'Yes' : 'No' },
            { label: 'Price/Sqft', value: plot.pricePerSqft ? formatCurrency(plot.pricePerSqft) : '—' },
          ].filter(Boolean).map((item, idx, arr) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: idx < arr.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>{item.label}</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {plot.status === 'available' ? (
          <>
            <Link to="/book-visit" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '12px',
              fontSize: '14px', fontWeight: 700, textDecoration: 'none', border: 'none', borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
            }}>
              <FaExternalLinkAlt style={{ fontSize: '13px', marginRight: '8px' }} /> Book Site Visit
            </Link>
            <Link to="/contact" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '12px',
              fontSize: '14px', fontWeight: 700, textDecoration: 'none', border: '2px solid #e5e7eb', borderRadius: '12px',
              background: '#fff', color: '#1e293b', fontFamily: 'Inter, sans-serif',
            }}>
              <FaBookmark style={{ fontSize: '13px', marginRight: '8px' }} /> Reserve Plot
            </Link>
          </>
        ) : (
          <div style={{ width: '100%', textAlign: 'center', padding: '12px', background: '#f8fafc', color: '#94a3b8', fontSize: '14px', fontWeight: 600, borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            This plot is currently {plot.status}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryItem({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: 800, color, fontFamily: 'Poppins, sans-serif' }}>{value}</div>
    </div>
  );
}

function InfoCard({ icon, label, value, highlight }) {
  return (
    <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
        <span style={{ color: '#94a3b8', fontSize: '12px' }}>{icon}</span>
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      </div>
      <div style={{ fontSize: '15px', fontWeight: 700, color: highlight ? '#d97706' : '#1e293b' }}>{value}</div>
    </div>
  );
}

const selectStyle = {
  width: '100%', padding: '8px 10px', background: '#fff', border: '1px solid #e5e7eb',
  borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: '#334155', outline: 'none',
  cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
};
