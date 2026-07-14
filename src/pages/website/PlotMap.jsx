import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getPlotMapData } from '../../api/plots';
import { getProjects } from '../../api/projects';
import { FaMapMarkerAlt, FaFilter, FaTimes, FaCrosshairs, FaPlus, FaMinus, FaSearch, FaRedoAlt } from 'react-icons/fa';
import Loader from '../../components/common/Loader';

const statusConfig = {
  available: { color: '#10b981', bg: '#ecfdf5', text: '#059669', label: 'Available' },
  reserved: { color: '#f59e0b', bg: '#fef3c7', text: '#d97706', label: 'Reserved' },
  sold: { color: '#ef4444', bg: '#fee2e2', text: '#dc2626', label: 'Sold' },
};

const projectColors = [
  { fill: '#eef2ff', stroke: '#c7d2fe', header: '#4338ca' },
  { fill: '#ecfdf5', stroke: '#a7f3d0', header: '#059669' },
  { fill: '#fefce8', stroke: '#fde68a', header: '#ca8a04' },
  { fill: '#fdf2f8', stroke: '#fbcfe8', header: '#be185d' },
  { fill: '#f0f9ff', stroke: '#bae6fd', header: '#0284c7' },
];

const GRID = { cols: 4, plotW: 88, plotH: 62, padX: 20, padY: 16, gapX: 14, gapY: 12, headerH: 36, blockPad: 20 };

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png', iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png' });

const makeIcon = (color) => L.divIcon({ className: '', iconSize: [14, 14], iconAnchor: [7, 7], html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>` });
const selectedIcon = L.divIcon({ className: '', iconSize: [20, 20], iconAnchor: [10, 10], html: `<div style="width:20px;height:20px;border-radius:50%;background:var(--gold);border:3px solid #fff;box-shadow:0 2px 8px rgba(232,179,85,0.5)"></div>` });

function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || map.getZoom(), { duration: 0.8 });
  }, [center, zoom, map]);
  return null;
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
  const [filters, setFilters] = useState({ project: '', facing: '', status: '', sizeRange: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [zoom, setZoom] = useState(1);

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

  const svgLayout = useMemo(() => {
    let yOffset = 0;
    const blocks = [];

    groupedByProject.forEach(([projectName, projectPlots], pi) => {
      const cols = GRID.cols;
      const rows = Math.ceil(projectPlots.length / cols);
      const blockContentH = rows * (GRID.plotH + GRID.gapY) - GRID.gapY + GRID.padY * 2;
      const totalBlockH = GRID.headerH + blockContentH;
      const colorSet = projectColors[pi % projectColors.length];

      const plotPositions = projectPlots.map((plot, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return {
          plot,
          x: GRID.padX + col * (GRID.plotW + GRID.gapX),
          y: GRID.headerH + GRID.padY + row * (GRID.plotH + GRID.gapY),
        };
      });

      blocks.push({
        projectName,
        plots: plotPositions,
        colorSet,
        y: yOffset,
        h: totalBlockH,
        w: GRID.padX * 2 + cols * (GRID.plotW + GRID.gapX) - GRID.gapX,
      });

      yOffset += totalBlockH + GRID.blockPad;
    });

    return { blocks, totalH: Math.max(yOffset, 400) };
  }, [groupedByProject]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2.4));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.8));
  const handleResetZoom = () => setZoom(1);

  const formatCurrency = (val) => '\u20B9 ' + (val || 0).toLocaleString('en-IN');

  if (loading) return <Loader />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 67px)', background: '#f4f6fa', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'row', overflow: 'hidden', position: 'relative' }}>

      {/* Left Sidebar */}
      <div style={{
        width: isMobile ? '100%' : '340px',
        background: '#fff',
        borderRight: '1px solid var(--line)',
        display: isMobile ? (showFilters ? 'flex' : 'none') : 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
        position: isMobile ? 'absolute' : 'relative',
        top: 0, left: 0, zIndex: 100,
        boxShadow: isMobile ? 'none' : '4px 0 20px rgba(0,0,0,0.02)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
              <FaMapMarkerAlt style={{ color: 'var(--indigo)', fontSize: '14px' }} /> Plot Map
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--gray)', fontWeight: 500, marginTop: '2px', display: 'block' }}>
              JSM Infrastructure Layout Plan
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ background: '#f0effc', color: 'var(--indigo)', fontSize: '11.5px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px' }}>
              {filteredPlots.length} Plots
            </span>
            {isMobile && (
              <button type="button" onClick={() => setShowFilters(false)} style={{ background: '#f4f6fa', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '14px', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Filters & List */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 1 }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)', fontSize: '13px' }} />
            <input type="text" placeholder="Search plot number..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...inputStyle, paddingLeft: '34px' }} />
          </div>

          {/* Filter Fields */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Project Name</label>
              <select value={filters.project} onChange={(e) => setFilters({ ...filters, project: e.target.value })} style={inputStyle}>
                <option value="">All Projects</option>
                {[...new Set(plots.map((p) => getProjectName(p)))].map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={labelStyle}>Facing</label>
                <select value={filters.facing} onChange={(e) => setFilters({ ...filters, facing: e.target.value })} style={inputStyle}>
                  <option value="">All</option>
                  {['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Size (sqft)</label>
                <select value={filters.sizeRange} onChange={(e) => setFilters({ ...filters, sizeRange: e.target.value })} style={inputStyle}>
                  <option value="">Any</option>
                  <option value="0-1000">Up to 1000</option>
                  <option value="1000-1500">1000 - 1500</option>
                  <option value="1500-2000">1500 - 2000</option>
                  <option value="2000-99999">2000+</option>
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {Object.entries(statusConfig).map(([key, cfg]) => {
                  const sel = filters.status === key;
                  return (
                    <button key={key} type="button" onClick={() => setFilters({ ...filters, status: sel ? '' : key })}
                      style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, border: `1px solid ${sel ? 'transparent' : 'var(--line)'}`, cursor: 'pointer', background: sel ? cfg.color : '#fff', color: sel ? '#fff' : 'var(--gray)', outline: 'none' }}>
                      <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: sel ? '#fff' : cfg.color, marginRight: '6px' }} />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <button type="button" onClick={() => { setFilters({ project: '', facing: '', status: '', sizeRange: '' }); setSearchQuery(''); }}
              style={{ padding: '4px', border: 'none', background: 'none', color: 'var(--indigo)', fontWeight: 600, fontSize: '12px', cursor: 'pointer', textAlign: 'left', alignSelf: 'flex-start', outline: 'none' }}>
              Clear filters
            </button>
          </div>

          {/* Plot List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>Plots ({filteredPlots.length})</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredPlots.map((plot) => {
                const sel = selectedPlot?._id === plot._id;
                const cfg = statusConfig[plot.status] || statusConfig.available;
                return (
                  <div key={plot._id} onClick={() => setSelectedPlot(plot)}
                    style={{ padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${sel ? 'var(--indigo)' : '#eef1f6'}`, background: sel ? '#f5f4fd' : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: 'var(--text)', fontSize: '14.5px' }}>Plot {plot.plotNumber}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', background: cfg.bg, color: cfg.text }}>{cfg.label}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <span style={{ fontSize: '11.5px', color: 'var(--gray)' }}>{getProjectName(plot)}</span>
                      <span style={{ fontSize: '11.5px', color: 'var(--text)', fontWeight: 600 }}>{plot.size?.toLocaleString()} sqft</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', borderTop: '1px solid #f4f6fa', paddingTop: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--gray)' }}>Facing: <strong>{plot.facing}</strong></span>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--gold)' }}>{formatCurrency(plot.price)}</span>
                    </div>
                  </div>
                );
              })}
              {filteredPlots.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--gray)', fontSize: '13px' }}>
                  No plots match your filters. Try adjusting.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Layout + Map */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {isMobile && (
          <button type="button" onClick={() => setShowFilters(true)}
            style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10, padding: '10px 16px', background: '#fff', border: '1px solid var(--line)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaFilter style={{ color: 'var(--indigo)' }} /> Filter Plots
          </button>
        )}

        {/* Top: Layout Grid (scrollable) */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px', boxSizing: 'border-box', borderBottom: '2px solid var(--line)' }}>
          {filteredPlots.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--gray)', fontSize: '15px', fontWeight: 600 }}>
              <div style={{ textAlign: 'center' }}>
                <FaMapMarkerAlt style={{ fontSize: '40px', marginBottom: '12px', color: 'var(--line)' }} />
                <p>No plots to display. {projectFilter ? 'Try removing the project filter.' : 'Add plots via the admin panel.'}</p>
              </div>
            </div>
          ) : (
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1)', minHeight: '100%' }}>
              {svgLayout.blocks.map((block) => (
                <div key={block.projectName} style={{
                  marginBottom: GRID.blockPad,
                  border: `2px solid ${block.colorSet.stroke}`,
                  borderRadius: '14px',
                  background: block.colorSet.fill,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ background: block.colorSet.header, color: '#fff', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, fontFamily: 'Poppins, sans-serif', letterSpacing: '0.3px' }}>
                      <FaMapMarkerAlt style={{ marginRight: '8px', fontSize: '12px' }} />
                      {block.projectName}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, opacity: 0.85 }}>
                      {block.plots.length} {block.plots.length === 1 ? 'Plot' : 'Plots'}
                    </span>
                  </div>
                  <div style={{ padding: `${GRID.padY}px ${GRID.padX}px`, display: 'grid', gridTemplateColumns: `repeat(${GRID.cols}, ${GRID.plotW}px)`, gap: `${GRID.gapY}px ${GRID.gapX}px`, justifyContent: 'start' }}>
                    {block.plots.map(({ plot }) => {
                      const st = statusConfig[plot.status] || statusConfig.available;
                      const sel = selectedPlot?._id === plot._id;
                      return (
                        <div key={plot._id} onClick={() => setSelectedPlot(plot)} style={{
                          width: GRID.plotW, height: GRID.plotH,
                          border: `1.5px solid ${sel ? 'var(--gold)' : '#d1d5db'}`,
                          borderRadius: '10px',
                          background: sel ? '#fffbeb' : '#fff',
                          cursor: 'pointer',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          gap: '2px',
                          transition: 'all 0.15s ease',
                          boxShadow: sel ? '0 4px 12px rgba(232,179,85,0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
                          position: 'relative',
                          padding: '6px',
                          boxSizing: 'border-box',
                        }}>
                          <span style={{ position: 'absolute', top: '5px', right: '5px', width: '7px', height: '7px', borderRadius: '50%', background: st.color }} />
                          <span style={{ fontSize: '12px', fontWeight: 800, color: sel ? 'var(--gold)' : 'var(--text)', lineHeight: 1 }}>{plot.plotNumber}</span>
                          <span style={{ fontSize: '8px', fontWeight: 600, color: 'var(--gray)', lineHeight: 1 }}>{plot.size?.toLocaleString()} sqft</span>
                          <span style={{ fontSize: '8px', fontWeight: 600, color: 'var(--gray)' }}>{plot.facing}</span>
                          <span style={{ fontSize: '8px', fontWeight: 700, color: 'var(--gold)' }}>{formatCurrency(plot.price)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Zoom Controls */}
          <div style={{ position: 'absolute', top: isMobile ? '60px' : '24px', left: isMobile ? '16px' : '360px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid var(--line)', borderRadius: '12px', padding: '6px', boxShadow: '0 10px 25px rgba(15,19,58,0.08)' }}>
            <button type="button" onClick={handleZoomIn} title="Zoom In" style={mapBtn}><FaPlus /></button>
            <button type="button" onClick={handleZoomOut} title="Zoom Out" style={mapBtn}><FaMinus /></button>
            <button type="button" onClick={handleResetZoom} title="Reset" style={mapBtn}><FaRedoAlt style={{ fontSize: '11px' }} /></button>
          </div>

          {/* Legend */}
          {!isMobile && (
            <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid var(--line)', borderRadius: '10px', padding: '10px 14px', display: 'flex', gap: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text)', fontWeight: 600 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cfg.color }} />
                  <span>{cfg.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom: Real Leaflet Map */}
        {filteredPlots.length > 0 && (() => {
          const withCoords = filteredPlots.filter((p) => p.coordinates?.lat && p.coordinates?.lng);
          const mapCenter = withCoords.length > 0
            ? [withCoords.reduce((s, p) => s + p.coordinates.lat, 0) / withCoords.length, withCoords.reduce((s, p) => s + p.coordinates.lng, 0) / withCoords.length]
            : [20.3, 85.8];
          const mapZoom = withCoords.length === 1 ? 16 : withCoords.length <= 4 ? 13 : 11;

          return (
            <div style={{ height: isMobile ? '220px' : '35%', minHeight: '220px', position: 'relative', borderTop: '2px solid var(--line)' }}>
              <div style={{ position: 'absolute', top: '10px', left: '12px', zIndex: 1000, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: 'var(--text)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontFamily: 'Poppins, sans-serif' }}>
                <FaMapMarkerAlt style={{ color: 'var(--indigo)', marginRight: '6px' }} />
                Project Locations ({withCoords.length} plots on map)
              </div>
              <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapRecenter center={selectedPlot?.coordinates?.lat ? [selectedPlot.coordinates.lat, selectedPlot.coordinates.lng] : null} zoom={16} />
                {withCoords.map((plot) => {
                  const st = statusConfig[plot.status] || statusConfig.available;
                  const sel = selectedPlot?._id === plot._id;
                  return (
                    <Marker
                      key={plot._id}
                      position={[plot.coordinates.lat, plot.coordinates.lng]}
                      icon={sel ? selectedIcon : makeIcon(st.color)}
                      eventHandlers={{ click: () => setSelectedPlot(plot) }}
                    >
                      <Popup>
                        <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '140px' }}>
                          <strong style={{ fontSize: '13px' }}>{getProjectName(plot)}</strong><br />
                          <span style={{ fontSize: '12px', fontWeight: 700 }}>Plot {plot.plotNumber}</span><br />
                          <span style={{ fontSize: '11px', color: '#666' }}>{plot.size?.toLocaleString()} sqft | {plot.facing}</span><br />
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#b58a1a' }}>{formatCurrency(plot.price)}</span>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          );
        })()}

        {/* Plot Detail Modal */}
        <AnimatePresence>
          {selectedPlot && (
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }}
              style={{
                position: 'absolute', bottom: isMobile ? '16px' : '20px', left: isMobile ? '16px' : 'auto', right: '16px',
                width: isMobile ? 'calc(100% - 32px)' : '330px',
                background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderRadius: '16px',
                border: '1px solid var(--line)', boxShadow: '0 20px 45px rgba(10,15,46,0.1)', padding: '24px', zIndex: 120, boxSizing: 'border-box',
              }}>
              <button type="button" onClick={() => setSelectedPlot(null)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: '#f4f6fa', border: 'none', color: 'var(--text)', cursor: 'pointer', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', outline: 'none' }}>
                <FaTimes />
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--indigo)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
                    {getProjectName(selectedPlot)}
                  </span>
                  <h4 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', margin: '4px 0 0', fontFamily: 'Poppins, sans-serif' }}>
                    Plot {selectedPlot.plotNumber}
                  </h4>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: statusConfig[selectedPlot.status]?.bg, color: statusConfig[selectedPlot.status]?.text, textTransform: 'capitalize' }}>
                  {selectedPlot.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '12px 0' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--gray)', fontWeight: 600, display: 'block' }}>FACING</span>
                  <p style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text)', margin: '2px 0 0' }}>{selectedPlot.facing}</p>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--gray)', fontWeight: 600, display: 'block' }}>SIZE</span>
                  <p style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text)', margin: '2px 0 0' }}>{selectedPlot.size?.toLocaleString()} sqft</p>
                </div>
                {selectedPlot.roadWidth && (
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--gray)', fontWeight: 600, display: 'block' }}>ROAD WIDTH</span>
                    <p style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text)', margin: '2px 0 0' }}>{selectedPlot.roadWidth} ft</p>
                  </div>
                )}
                {selectedPlot.corner && (
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--gray)', fontWeight: 600, display: 'block' }}>PLOT TYPE</span>
                    <p style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text)', margin: '2px 0 0' }}>Corner Plot</p>
                  </div>
                )}
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '10px', color: 'var(--gray)', fontWeight: 600, display: 'block' }}>TOTAL PRICE</span>
                  <p style={{ fontSize: '19px', fontWeight: 800, color: 'var(--gold)', margin: '2px 0 0' }}>{formatCurrency(selectedPlot.price)}</p>
                </div>
              </div>

              {selectedPlot.status === 'available' ? (
                <Link to="/book-visit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', border: 'none', display: 'flex' }}>
                  <FaCrosshairs style={{ fontSize: '13px', marginRight: '6px' }} /> Schedule Visit to Book
                </Link>
              ) : (
                <div style={{ width: '100%', textAlign: 'center', padding: '12px', background: '#f8f8fc', color: 'var(--gray)', fontSize: '13px', fontWeight: 600, borderRadius: '8px', border: '1px solid var(--line)' }}>
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

const labelStyle = { display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px', fontSize: '13.5px', color: 'var(--text)', outline: 'none', background: '#fff', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', transition: 'border-color 0.2s' };
const mapBtn = { width: '32px', height: '32px', background: '#fff', border: 'none', color: 'var(--text)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.06)', fontSize: '13px', transition: 'background 0.2s', outline: 'none' };
