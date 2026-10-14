import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LuMapPin, LuFilter, LuLayoutGrid, LuMap, LuListFilter } from 'react-icons/lu';
import Loader from '../../components/common/Loader';

// Import refactored modular components
import FilterSidebar from '../../components/plot-map/FilterSidebar';
import PlotDetailsContent from '../../components/plot-map/PlotDetailsContent';
import LayoutView from '../../components/plot-map/LayoutView';
import MapView from '../../components/plot-map/MapView';
import TableView from '../../components/plot-map/TableView';
import ProjectSummaryBar from '../../components/plot-map/ProjectSummaryBar';

import { getPlotMapData } from '../../api/plots';
import { getProjects } from '../../api/projects';

const statusConfig = {
  available: { colorClass: 'bg-emerald-500', label: 'Available' },
  reserved: { colorClass: 'bg-amber-500', label: 'Reserved' },
  sold: { colorClass: 'bg-rose-500', label: 'Sold' },
  blocked: { colorClass: 'bg-slate-400', label: 'Blocked' },
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

  const getProjectName = useCallback(
    (plot) => {
      if (plot.project?.name) return plot.project.name;
      if (typeof plot.project === 'string') {
        const found = projects.find((p) => p._id === plot.project);
        return found?.name || 'Unknown Project';
      }
      return 'Unknown Project';
    },
    [projects]
  );

  const getProjectCity = useCallback(
    (plot) => {
      if (plot.project?.location?.city) return plot.project.location.city;
      if (typeof plot.project === 'string') {
        const found = projects.find((p) => p._id === plot.project);
        return found?.location?.city || '';
      }
      return '';
    },
    [projects]
  );

  const getProjectObj = useCallback(
    (plot) => {
      if (plot.project && typeof plot.project === 'object') return plot.project;
      if (typeof plot.project === 'string')
        return projects.find((p) => p._id === plot.project) || null;
      return null;
    },
    [projects]
  );

  const filteredPlots = useMemo(() => {
    return plots.filter((plot) => {
      if (searchQuery && !plot.plotNumber?.toLowerCase().includes(searchQuery.toLowerCase()))
        return false;
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
    filteredPlots.forEach((p) => {
      if (s[p.status] !== undefined) s[p.status]++;
    });
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
    projPlots.forEach((p) => {
      if (s[p.status] !== undefined) s[p.status]++;
    });
    return s;
  }, [selectedPlot, plots, getProjectName]);

  const mapCenter = useMemo(() => {
    if (!selectedPlot && filteredPlots.length === 0) return [20.2961, 85.8245];
    if (selectedPlot) {
      if (selectedPlot.coordinates?.lat)
        return [selectedPlot.coordinates.lat, selectedPlot.coordinates.lng];
      const proj = getProjectObj(selectedPlot);
      if (proj?.location?.coordinates?.lat)
        return [proj.location.coordinates.lat, proj.location.coordinates.lng];
    }
    for (const p of filteredPlots) {
      if (p.coordinates?.lat) return [p.coordinates.lat, p.coordinates.lng];
      const proj = getProjectObj(p);
      if (proj?.location?.coordinates?.lat)
        return [proj.location.coordinates.lat, proj.location.coordinates.lng];
    }
    return [20.2961, 85.8245];
  }, [selectedPlot, filteredPlots, getProjectObj]);

  if (loading) return <Loader />;

  const viewBtns = [
    { key: 'layout', icon: <LuLayoutGrid />, label: 'Layout' },
    { key: 'map', icon: <LuMap />, label: 'Map' },
    { key: 'table', icon: <LuListFilter />, label: 'Table' },
  ];

  return (
    <div className="bg-[#f5f9f3] min-h-screen">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-green-700 to-green-800 flex items-center justify-center text-white text-lg shadow-md shadow-green-700/20 shrink-0">
                <LuMapPin />
              </div>
              <div>
                <h1 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  Plot Map
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  JSM Infrastructure — Site Layout
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {[
                { key: 'total', label: 'Total', count: stats.total, color: 'text-slate-800', bg: 'bg-slate-100', dot: 'bg-slate-800' },
                { key: 'available', label: 'Available', count: stats.available, color: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
                { key: 'sold', label: 'Sold', count: stats.sold, color: 'text-rose-700', bg: 'bg-rose-50', dot: 'bg-rose-500' },
                { key: 'reserved', label: 'Reserved', count: stats.reserved, color: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
              ].map((s) => (
                <div
                  key={s.key}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 ${s.bg}`}
                >
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className={`text-xs font-extrabold ${s.color}`}>{s.count}</span>
                  <span className="text-xs text-slate-500 font-medium">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 sm:py-6 flex gap-6 items-start">
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
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {isMobile && !showFilters && (
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="fixed bottom-6 right-6 z-[150] px-5 py-3.5 bg-green-700 border-0 rounded-2xl shadow-lg shadow-green-700/30 text-xs font-bold text-white cursor-pointer flex items-center gap-2"
            >
              <LuFilter className="text-sm" /> Filters ({filteredPlots.length})
            </button>
          )}

          {/* PROJECT SUMMARY BAR */}
          <ProjectSummaryBar
            currentProject={currentProject}
            projectStats={projectStats}
            isMobile={isMobile}
            formatCurrency={formatCurrency}
          />

          {/* VIEW SWITCHER */}
          <div className="flex items-center gap-2 flex-wrap justify-between">
            <div className="flex bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs p-1 gap-1">
              {viewBtns.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setActiveView(v.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border-0 cursor-pointer text-xs font-bold transition-all ${
                    activeView === v.key
                      ? 'bg-green-700 text-white shadow-xs'
                      : 'bg-transparent text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm">{v.icon}</span>
                  <span>{v.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded ${cfg.colorClass}`} />
                  <span className="text-xs font-semibold text-slate-600">{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex gap-5 items-start">
            <div className="flex-1 min-w-0">
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
              <div className="w-[380px] shrink-0 sticky top-6 z-20">
                <PlotDetailsContent
                  plot={selectedPlot}
                  onClose={() => setSelectedPlot(null)}
                  getProjectName={getProjectName}
                />
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlot(null)}
              className="fixed inset-0 bg-slate-950/40 z-[300]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 maxHeight-[75vh] bg-white rounded-t-3xl z-[310] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="py-3 px-6 flex justify-center">
                <div className="w-10 h-1 rounded-full bg-slate-300" />
              </div>
              <div className="flex-1 overflow-y-auto">
                <PlotDetailsContent
                  plot={selectedPlot}
                  onClose={() => setSelectedPlot(null)}
                  getProjectName={getProjectName}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
