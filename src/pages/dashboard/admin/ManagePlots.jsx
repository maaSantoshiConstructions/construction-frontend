import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaLock,
  FaCheckDouble,
  FaRulerCombined,
  FaCompass,
  FaRoad
} from 'react-icons/fa';
import { getPlots, createPlot, updatePlot, deletePlot } from '../../../api/plots';
import { getProjects } from '../../../api/projects';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';

const facings = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];

export default function ManagePlots() {
  const [plots, setPlots] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({ project: '', status: '', facing: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, available: 0, reserved: 0, sold: 0, blocked: 0 });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchPlots = useCallback(async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: p, limit: 10 };
      if (filters.project) params.project = filters.project;
      if (filters.status) params.status = filters.status;
      if (filters.facing) params.facing = filters.facing;
      if (searchTerm) params.search = searchTerm;
      const { data: res } = await getPlots(params);
      setPlots(res?.data || []);
      setTotalPages(res?.totalPages || 1);
      if (res?.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load plots');
    } finally {
      setLoading(false);
    }
  }, [page, filters, searchTerm]);

  const fetchProjectsList = async () => {
    try {
      const { data: res } = await getProjects({ limit: 100 });
      setProjects(res?.data || []);
    } catch { }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPlots();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchPlots]);

  useEffect(() => {
    fetchProjectsList();
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ plotNumber: '', project: '', size: '', length: '', width: '', facing: 'North', roadWidth: '', price: '', corner: false, coordinates: '', status: 'available' });
    setShowModal(true);
  };

  const openEdit = (plot) => {
    setEditing(plot);
    reset({
      plotNumber: plot.plotNumber || '',
      project: plot.project?._id || plot.project || '',
      size: plot.size || '',
      length: plot.length || '',
      width: plot.width || '',
      facing: plot.facing || 'North',
      roadWidth: plot.roadWidth || '',
      price: plot.price || '',
      corner: plot.corner || false,
      coordinates: plot.coordinates ? `${plot.coordinates.lat || ''},${plot.coordinates.lng || ''}` : '',
      status: plot.status || 'available',
    });
    setShowModal(true);
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const coords = formData.coordinates ? formData.coordinates.split(',').map(c => parseFloat(c.trim())) : [];
      const payload = {
        ...formData,
        size: formData.size ? parseFloat(formData.size) : undefined,
        length: formData.length ? parseFloat(formData.length) : undefined,
        width: formData.width ? parseFloat(formData.width) : undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        roadWidth: formData.roadWidth ? parseFloat(formData.roadWidth) : undefined,
        corner: Boolean(formData.corner),
        coordinates: coords.length === 2 ? { lat: coords[0], lng: coords[1] } : undefined,
      };
      if (editing) {
        await updatePlot(editing._id, payload);
        toast.success('Plot updated successfully');
      } else {
        await createPlot(payload);
        toast.success('Plot created successfully');
      }
      setShowModal(false);
      fetchPlots();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plot?')) return;
    try {
      await deletePlot(id);
      toast.success('Plot deleted');
      fetchPlots();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    {
      key: 'plotNumber',
      label: 'Plot #',
      render: r => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-900 text-sm">#{r.plotNumber}</span>
            {r.corner && (
              <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-amber-50 text-amber-750 border border-amber-200 rounded uppercase tracking-wider">
                Corner
              </span>
            )}
          </div>
          {r.coordinates?.lat && r.coordinates?.lng && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${r.coordinates.lat},${r.coordinates.lng}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-amber-600 hover:text-amber-750 flex items-center gap-0.5 font-medium underline"
            >
              <FaMapMarkerAlt className="text-[9px]" /> View Map
            </a>
          )}
        </div>
      )
    },
    {
      key: 'project',
      label: 'Project Details',
      render: r => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{r.project?.name || '-'}</span>
          {r.project?.type && (
            <span className="text-[11px] text-slate-500 capitalize">
              {r.project.type.replace(/_/g, ' ')}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'size',
      label: 'Dimensions & Size',
      render: r => (
        <div className="flex flex-col">
          <div className="font-medium text-slate-900 flex items-center gap-1">
            <FaRulerCombined className="text-[11px] text-slate-400" />
            <span>{r.size ? `${r.size.toLocaleString('en-IN')} sq.ft` : '-'}</span>
          </div>
          {r.length && r.width && (
            <span className="text-[11px] text-slate-500 pl-4">
              {r.length} × {r.width} ft
            </span>
          )}
        </div>
      )
    },
    {
      key: 'facing',
      label: 'Facing & Road',
      render: r => (
        <div className="flex flex-col">
          <div className="font-medium text-slate-900 flex items-center gap-1">
            <FaCompass className="text-[11px] text-slate-400" />
            <span>{r.facing || '-'}</span>
          </div>
          {r.roadWidth && (
            <span className="text-[11px] text-slate-500 pl-4 flex items-center gap-0.5">
              <FaRoad className="text-[9px]" /> {r.roadWidth} ft road
            </span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Inventory Status',
      render: r => {
        const config = {
          available: {
            bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            dot: 'bg-emerald-500',
            label: 'AVAILABLE'
          },
          reserved: {
            bg: 'bg-amber-50 text-amber-700 border-amber-200',
            dot: 'bg-amber-500',
            label: 'RESERVED'
          },
          sold: {
            bg: 'bg-rose-50 text-rose-700 border-rose-200',
            dot: 'bg-rose-500',
            label: 'SOLD'
          },
          blocked: {
            bg: 'bg-slate-50 text-slate-600 border-slate-200',
            dot: 'bg-slate-500',
            label: 'BLOCKED'
          },
        };
        const st = config[r.status] || config.available;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${st.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
            {st.label}
          </span>
        );
      }
    },
    {
      key: 'price',
      label: 'Pricing Details',
      render: r => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">
            {r.price ? `₹${r.price.toLocaleString('en-IN')}` : '-'}
          </span>
          {r.price && r.size && (
            <span className="text-[10px] text-slate-500 font-medium">
              ₹{Math.round(r.price / r.size).toLocaleString('en-IN')}/sq.ft
            </span>
          )}
        </div>
      )
    },
    {
      key: 'owner',
      label: 'Owner / Booking',
      render: r => r.owner ? (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 text-sm">{r.owner.name}</span>
          <span className="text-[11px] text-slate-500">{r.owner.phone || r.owner.email}</span>
        </div>
      ) : (
        <span className="text-slate-400 text-xs font-medium">Not Assigned</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: r => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(r)}
            className="p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
            title="Edit Plot"
          >
            <FaEdit className="text-base" />
          </button>
          <button
            onClick={() => handleDelete(r._id)}
            className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Plot"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Manage Plots</h1>
          <p className="text-slate-500 text-sm">Real-time plot inventory, pricing, and specs</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-750 text-slate-950 text-sm font-bold rounded-xl shadow-md shadow-amber-500/10 active:scale-[0.98] transition-all"
        >
          <FaPlus className="text-xs" /> Add Plot
        </button>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Plots */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm relative overflow-hidden group flex items-center gap-3.5"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-400" />
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
            <FaRulerCombined className="text-base" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">Total Plots</p>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5 leading-none">{stats.total}</h3>
          </div>
        </motion.div>

        {/* Available Plots */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.03 }}
          className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm relative overflow-hidden group flex items-center gap-3.5"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <FaCheckCircle className="text-base" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">Available</p>
            <h3 className="text-xl font-bold text-emerald-600 mt-0.5 leading-none">{stats.available}</h3>
          </div>
        </motion.div>

        {/* Reserved Plots */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm relative overflow-hidden group flex items-center gap-3.5"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <FaLock className="text-base" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">Reserved</p>
            <h3 className="text-xl font-bold text-amber-600 mt-0.5 leading-none">{stats.reserved}</h3>
          </div>
        </motion.div>

        {/* Sold Plots */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.09 }}
          className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm relative overflow-hidden group flex items-center gap-3.5"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <FaCheckDouble className="text-base" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">Sold</p>
            <h3 className="text-xl font-bold text-rose-600 mt-0.5 leading-none">{stats.sold}</h3>
          </div>
        </motion.div>

        {/* Blocked Plots */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm relative overflow-hidden group flex items-center gap-3.5"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-500" />
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
            <FaTimes className="text-base" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">Blocked</p>
            <h3 className="text-xl font-bold text-slate-750 mt-0.5 leading-none">{stats.blocked}</h3>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search by Plot Number (e.g. 104)..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 transition-all placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filters.project}
            onChange={e => { setFilters(f => ({ ...f, project: e.target.value })); setPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 transition-all font-semibold text-slate-700 min-w-[140px]"
          >
            <option value="">All Projects</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>

          <select
            value={filters.status}
            onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 transition-all font-semibold text-slate-700 min-w-[130px]"
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
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 transition-all font-semibold text-slate-700 min-w-[130px]"
          >
            <option value="">All Facings</option>
            {facings.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      {/* Error / Data table */}
      {error ? <ErrorMessage message={error} onRetry={() => fetchPlots()} /> : (
        <>
          <DataTable columns={columns} data={plots} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Add / Edit Plot Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-h-[90vh] overflow-hidden">
              {/* Sticky Header */}
              <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{editing ? 'Edit Plot Inventory' : 'Add New Plot'}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{editing ? 'Update the details of this plot' : 'Fill in the details to add a new plot'}</p>
                </div>
                <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-700">
                  <FaTimes />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto px-7 py-6 space-y-8">
                {/* Section 1: Basic Info */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Plot Number *</label>
                      <input
                        placeholder="e.g. 104"
                        {...register('plotNumber', { required: 'Plot number is required' })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium placeholder:text-slate-400"
                      />
                      {errors.plotNumber && <p className="text-rose-500 text-xs mt-1">{errors.plotNumber.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Project *</label>
                      <select
                        {...register('project', { required: 'Project is required' })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium"
                      >
                        <option value="">Select Project</option>
                        {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                      </select>
                      {errors.project && <p className="text-rose-500 text-xs mt-1">{errors.project.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Section 2: Dimensions & Specs */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
                    Dimensions &amp; Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-x-5 gap-y-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Size (sq.ft)</label>
                      <input
                        type="number"
                        placeholder="e.g. 1200"
                        {...register('size')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium placeholder:text-slate-400"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Length (ft)</label>
                      <input
                        type="number"
                        placeholder="e.g. 40"
                        {...register('length')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium placeholder:text-slate-400"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Width (ft)</label>
                      <input
                        type="number"
                        placeholder="e.g. 30"
                        {...register('width')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium placeholder:text-slate-400"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Facing Direction</label>
                      <select
                        {...register('facing')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium"
                      >
                        {facings.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Road Width (ft)</label>
                      <input
                        type="number"
                        placeholder="e.g. 30"
                        {...register('roadWidth')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium placeholder:text-slate-400"
                      />
                    </div>

                    <div className="md:col-span-6 mt-1">
                      <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          {...register('corner')}
                          className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500/20 accent-amber-500 transition-all"
                        />
                        <span>Corner Plot (Premium Location)</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Section 3: Pricing & Location */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
                    Pricing &amp; Location Coordinates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Total Price (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 1500000"
                        {...register('price')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Plot Status</label>
                      <select
                        {...register('status')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium"
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Coordinates (latitude,longitude)</label>
                      <input
                        placeholder="e.g. 20.2961,85.8245"
                        {...register('coordinates')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium placeholder:text-slate-400"
                      />
                      <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">Comma-separated GPS coordinates for plotting on the master plan layout.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex justify-end gap-3 px-7 py-5 bg-slate-50/80 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-600 text-sm font-semibold border border-slate-200 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{editing ? 'Save Changes' : 'Create Plot'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
