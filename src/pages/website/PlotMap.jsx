import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaMapMarkerAlt, FaFilter, FaTh, FaMap, FaListAlt,
  FaCalendarAlt, FaBuilding,
} from 'react-icons/fa';
import Loader from '../../components/common/Loader';

// Import refactored modular components
import FilterSidebar from '../../components/plot-map/FilterSidebar';
import PlotDetailsContent from '../../components/plot-map/PlotDetailsContent';
import LayoutView from '../../components/plot-map/LayoutView';
import MapView from '../../components/plot-map/MapView';
import TableView from '../../components/plot-map/TableView';

import { getPlotMapData } from '../../api/plots';
import { getProjects } from '../../api/projects';

const statusConfig = {
  available: { color: '#22c55e', bg: '#f0fdf4', text: '#15803d', border: '#86efac', label: 'Available' },
  reserved: { color: '#f59e0b', bg: '#fffbeb', text: '#b45309', border: '#fcd34d', label: 'Reserved' },
  sold: { color: '#ef4444', bg: '#fef2f2', text: '#b91c1c', border: '#fca5a5', label: 'Sold' },
  blocked: { color: '#94a3b8', bg: '#f8fafc', text: '#475569', border: '#cbd5e1', label: 'Blocked' },
};

const formatCurrency = (val) => '₹' + (val || 0).toLocaleString('en-IN');

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
        <FilterSidebar
          isMobile={isMobile}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          setFilters={setFilters}
          plots={plots}
          filteredPlots={filteredPlots}
          selectedPlot={selectedPlot}
          setSelectedPlot={setSelectedPlot}
          getProjectName={getProjectName}
        />

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
                <LayoutView
                  isMobile={isMobile}
                  filteredPlots={filteredPlots}
                  groupedByProject={groupedByProject}
                  selectedPlot={selectedPlot}
                  setSelectedPlot={setSelectedPlot}
                />
              )}

              {/* MAP VIEW */}
              {activeView === 'map' && (
                <MapView
                  filteredPlots={filteredPlots}
                  selectedPlot={selectedPlot}
                  setSelectedPlot={setSelectedPlot}
                  mapCenter={mapCenter}
                  getProjectObj={getProjectObj}
                  getProjectCity={getProjectCity}
                  getProjectName={getProjectName}
                />
              )}

              {/* TABLE VIEW */}
              {activeView === 'table' && (
                <TableView
                  filteredPlots={filteredPlots}
                  selectedPlot={selectedPlot}
                  setSelectedPlot={setSelectedPlot}
                  getProjectName={getProjectName}
                />
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

function SummaryItem({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: 800, color, fontFamily: 'Poppins, sans-serif' }}>{value}</div>
    </div>
  );
}
