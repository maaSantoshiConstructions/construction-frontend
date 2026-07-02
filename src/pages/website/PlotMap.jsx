import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPlotMapData, getPlots } from '../../api/plots';
import { getProjects } from '../../api/projects';
import { FaMapMarkerAlt, FaFilter, FaTimes, FaCircle, FaCrosshairs } from 'react-icons/fa';
import Loader from '../../components/common/Loader';

export default function PlotMap() {
  const [searchParams] = useSearchParams();
  const projectFilter = searchParams.get('project');
  const [plots, setPlots] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    project: projectFilter || '',
    facing: '',
    status: '',
    sizeRange: '',
  });
  const [mapError, setMapError] = useState(false);

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
          { _id: '1', plotNumber: 'A-101', project: 'Green Valley Estate', facing: 'North', size: 1200, price: 3500000, status: 'available', coordinates: { lat: 28.4595, lng: 77.0266 } },
          { _id: '2', plotNumber: 'A-102', project: 'Green Valley Estate', facing: 'East', size: 1500, price: 4200000, status: 'reserved', coordinates: { lat: 28.4600, lng: 77.0270 } },
          { _id: '3', plotNumber: 'B-201', project: 'Green Valley Estate', facing: 'South', size: 1000, price: 2800000, status: 'sold', coordinates: { lat: 28.4605, lng: 77.0260 } },
          { _id: '4', plotNumber: 'B-202', project: 'Green Valley Estate', facing: 'West', size: 1800, price: 5000000, status: 'available', coordinates: { lat: 28.4590, lng: 77.0275 } },
          { _id: '5', plotNumber: 'C-101', project: 'Lakeview Residency', facing: 'North-East', size: 1350, price: 3800000, status: 'available', coordinates: { lat: 28.4610, lng: 77.0255 } },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectFilter]);

  const statusConfig = {
    available: { color: '#22c55e', bg: 'bg-green-100', text: 'text-green-700', label: 'Available' },
    reserved: { color: '#eab308', bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Reserved' },
    sold: { color: '#ef4444', bg: 'bg-red-100', text: 'text-red-700', label: 'Sold' },
  };

  const filteredPlots = plots.filter((plot) => {
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

  if (loading) return <Loader />;

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-slate-50">
      <div className={`lg:w-80 bg-white border-r border-slate-200 overflow-y-auto ${showFilters ? 'block' : 'hidden'} lg:block flex-shrink-0`}>
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800 flex items-center gap-2"><FaFilter /> Filters</h2>
            <button onClick={() => setShowFilters(false)} className="lg:hidden text-slate-400 hover:text-slate-600"><FaTimes /></button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
            <select
              value={filters.project}
              onChange={(e) => setFilters({ ...filters, project: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Projects</option>
              {projects.map((p) => <option key={p._id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Facing</label>
            <select
              value={filters.facing}
              onChange={(e) => setFilters({ ...filters, facing: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Directions</option>
              {['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Size (sq ft)</label>
            <select
              value={filters.sizeRange}
              onChange={(e) => setFilters({ ...filters, sizeRange: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Any Size</option>
              <option value="0-1000">Up to 1000</option>
              <option value="1000-1500">1000 - 1500</option>
              <option value="1500-2000">1500 - 2000</option>
              <option value="2000">2000+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setFilters({ ...filters, status: filters.status === key ? '' : key })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-colors ${filters.status === key ? `${cfg.bg} ${cfg.text} border-transparent` : 'bg-white text-slate-500 border-slate-200'}`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setFilters({ project: '', facing: '', status: '', sizeRange: '' })}
            className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear All Filters
          </button>
        </div>

        <div className="px-4 pb-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><FaCircle className="text-xs" /> Legend</h3>
          <div className="space-y-2">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2 text-sm text-slate-600">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }} />
                <span className="capitalize">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 pb-4 space-y-2">
          <h3 className="text-sm font-semibold text-slate-700">Plots ({filteredPlots.length})</h3>
          {filteredPlots.map((plot) => (
            <button
              key={plot._id}
              onClick={() => handlePlotClick(plot)}
              className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${selectedPlot?._id === plot._id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800">{plot.plotNumber}</span>
                <span className={`text-xs font-medium capitalize ${statusConfig[plot.status]?.text}`}>{plot.status}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{plot.project} • {plot.facing} • {plot.size} sq ft</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative">
        <button
          onClick={() => setShowFilters(true)}
          className="lg:hidden absolute top-4 left-4 z-10 px-4 py-2 bg-white rounded-lg shadow-md text-sm font-medium text-slate-700 flex items-center gap-2"
        >
          <FaFilter /> Filters
        </button>

        {mapError ? (
          <div className="h-full flex items-center justify-center bg-slate-100">
            <div className="text-center p-8">
              <FaMapMarkerAlt className="text-4xl text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Map View Unavailable</h3>
              <p className="text-sm text-slate-500 mb-4">We&apos;re having trouble loading the map. Please try again later.</p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {filteredPlots.map((plot) => (
                  <div
                    key={plot._id}
                    onClick={() => handlePlotClick(plot)}
                    className={`p-3 rounded-lg border text-center cursor-pointer text-sm transition-colors ${selectedPlot?._id === plot._id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300'}`}
                  >
                    <span className="block font-medium text-slate-800">{plot.plotNumber}</span>
                    <span className={`text-xs font-medium capitalize ${statusConfig[plot.status]?.text}`}>{plot.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full bg-slate-200 flex items-center justify-center relative">
            <div className="text-center">
              <FaMapMarkerAlt className="text-5xl text-blue-600 mx-auto mb-4" />
              <p className="text-slate-500 text-sm">Map component would render here with Leaflet</p>
              <p className="text-xs text-slate-400 mt-1">{filteredPlots.length} plots loaded</p>
            </div>

            {filteredPlots.map((plot) => (
              <button
                key={plot._id}
                onClick={() => handlePlotClick(plot)}
                className="absolute cursor-pointer"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
              >
                <div className="relative">
                  <FaMapMarkerAlt
                    className="text-2xl drop-shadow-lg"
                    style={{ color: statusConfig[plot.status]?.color }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedPlot && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-80 bg-white rounded-2xl shadow-xl p-5 z-20"
          >
            <button onClick={() => setSelectedPlot(null)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"><FaTimes /></button>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-slate-800">{selectedPlot.plotNumber}</h4>
                <p className="text-sm text-slate-500">{selectedPlot.project}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusConfig[selectedPlot.status]?.bg} ${statusConfig[selectedPlot.status]?.text}`}>
                {selectedPlot.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div><span className="text-slate-400">Size</span><p className="font-medium text-slate-700">{selectedPlot.size} sq ft</p></div>
              <div><span className="text-slate-400">Facing</span><p className="font-medium text-slate-700">{selectedPlot.facing}</p></div>
              <div><span className="text-slate-400">Price</span><p className="font-medium text-blue-600">₹{(selectedPlot.price || 0).toLocaleString('en-IN')}</p></div>
            </div>
            <Link
              to="/book-visit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FaCrosshairs /> Book Now
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
