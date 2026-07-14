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
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-[14px] tracking-tight">#{r.plotNumber}</span>
            {r.corner && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-full uppercase tracking-wide">
                Corner
              </span>
            )}
          </div>
          {r.coordinates?.lat && r.coordinates?.lng && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${r.coordinates.lat},${r.coordinates.lng}`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-amber-600 hover:text-amber-700 flex items-center gap-1 font-semibold transition-colors duration-200"
            >
              <FaMapMarkerAlt className="text-[10px]" /> View Map
            </a>
          )}
        </div>
      )
    },
    {
      key: 'project',
      label: 'Project Details',
      render: r => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-slate-900 text-[14px] leading-snug">{r.project?.name || '-'}</span>
          {r.project?.type && (
            <span className="text-[12px] text-slate-400 capitalize font-medium">
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
        <div className="flex flex-col gap-0.5">
          <div className="font-semibold text-slate-900 text-[14px] flex items-center gap-1.5">
            <FaRulerCombined className="text-[11px] text-slate-400 shrink-0" />
            <span>{r.size ? `${r.size.toLocaleString('en-IN')} sq.ft` : '-'}</span>
          </div>
          {r.length && r.width && (
            <span className="text-[12px] text-slate-400 font-medium pl-5">
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
        <div className="flex flex-col gap-0.5">
          <div className="font-semibold text-slate-900 text-[14px] flex items-center gap-1.5">
            <FaCompass className="text-[11px] text-slate-400 shrink-0" />
            <span>{r.facing || '-'}</span>
          </div>
          {r.roadWidth && (
            <span className="text-[12px] text-slate-400 font-medium pl-5 flex items-center gap-1">
              <FaRoad className="text-[10px]" /> {r.roadWidth} ft road
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
            bg: 'bg-slate-100 text-slate-600 border-slate-200',
            dot: 'bg-slate-400',
            label: 'BLOCKED'
          },
        };
        const st = config[r.status] || config.available;
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border ${st.bg}`}>
            <span className={`w-2 h-2 rounded-full ${st.dot}`} />
            {st.label}
          </span>
        );
      }
    },
    {
      key: 'price',
      label: 'Pricing Details',
      render: r => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-900 text-[14px]">
            {r.price ? `₹${r.price.toLocaleString('en-IN')}` : '-'}
          </span>
          {r.price && r.size && (
            <span className="text-[12px] text-slate-400 font-medium">
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
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-slate-900 text-[14px]">{r.owner.name}</span>
          <span className="text-[12px] text-slate-400 font-medium">{r.owner.phone || r.owner.email}</span>
        </div>
      ) : (
        <span className="inline-flex items-center px-2.5 py-1 bg-slate-50 text-slate-400 text-[12px] font-semibold rounded-lg border border-slate-100">Not Assigned</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: r => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(r)}
            className="w-8 h-8 flex items-center justify-center text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-full border border-transparent hover:border-amber-200 transition-all duration-200"
            title="Edit Plot"
          >
            <FaEdit className="text-[13px]" />
          </button>
          <button
            onClick={() => handleDelete(r._id)}
            className="w-8 h-8 flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-full border border-transparent hover:border-rose-200 transition-all duration-200"
            title="Delete Plot"
          >
            <FaTrash className="text-[12px]" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-7">
      {/* ─── Page Header ─── */}
      <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, letterSpacing: '-0.5px', margin: 0 }}>Manage Plots</h1>
          <p style={{ fontSize: '15px', color: '#94a3b8', marginTop: '6px', fontWeight: 500, margin: '6px 0 0 0' }}>Real-time plot inventory, pricing, and specs</p>
        </div>
        <button
          onClick={openCreate}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 22px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', fontSize: '14px', fontWeight: 700, borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(245,158,11,0.3)', transition: 'all 0.2s ease', fontFamily: 'inherit' }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(245,158,11,0.4)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(245,158,11,0.3)'; }}
        >
          <FaPlus style={{ fontSize: '11px' }} /> Add Plot
        </button>
      </div>

      {/* ─── Stats Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* Total */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', minHeight: '88px', position: 'relative', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
          onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
          onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)'}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#94a3b8', borderRadius: '12px 0 0 12px' }} />
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
            <FaRulerCombined style={{ fontSize: '16px' }} />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Total Plots</p>
            <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b', lineHeight: 1.1, margin: '2px 0 0 0' }}>{stats.total}</h3>
          </div>
        </motion.div>

        {/* Available */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', minHeight: '88px', position: 'relative', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
          onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
          onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)'}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#10b981', borderRadius: '12px 0 0 12px' }} />
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#ecfdf5', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', flexShrink: 0 }}>
            <FaCheckCircle style={{ fontSize: '16px' }} />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Available</p>
            <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#059669', lineHeight: 1.1, margin: '2px 0 0 0' }}>{stats.available}</h3>
          </div>
        </motion.div>

        {/* Reserved */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', minHeight: '88px', position: 'relative', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
          onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
          onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)'}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#f59e0b', borderRadius: '12px 0 0 12px' }} />
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fffbeb', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', flexShrink: 0 }}>
            <FaLock style={{ fontSize: '16px' }} />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Reserved</p>
            <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#d97706', lineHeight: 1.1, margin: '2px 0 0 0' }}>{stats.reserved}</h3>
          </div>
        </motion.div>

        {/* Sold */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', minHeight: '88px', position: 'relative', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
          onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
          onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)'}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#f43f5e', borderRadius: '12px 0 0 12px' }} />
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fff1f2', border: '1px solid #fecdd3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', flexShrink: 0 }}>
            <FaCheckDouble style={{ fontSize: '16px' }} />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Sold</p>
            <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#e11d48', lineHeight: 1.1, margin: '2px 0 0 0' }}>{stats.sold}</h3>
          </div>
        </motion.div>

        {/* Blocked */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', minHeight: '88px', position: 'relative', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
          onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
          onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)'}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#64748b', borderRadius: '12px 0 0 12px' }} />
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
            <FaTimes style={{ fontSize: '16px' }} />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Blocked</p>
            <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#475569', lineHeight: 1.1, margin: '2px 0 0 0' }}>{stats.blocked}</h3>
          </div>
        </motion.div>

      </div>

      {/* ─── Search & Filters Bar ─── */}
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

      {/* ─── Table / Error ─── */}
      {error ? <ErrorMessage message={error} onRetry={() => fetchPlots()} /> : (
        <>
          <DataTable columns={columns} data={plots} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* ─── Add / Edit Plot Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 shrink-0">
                <div>
                  <h2 className="text-[20px] font-bold text-slate-900 leading-tight">{editing ? 'Edit Plot Inventory' : 'Add New Plot'}</h2>
                  <p className="text-[13px] text-slate-400 font-medium mt-0.5">{editing ? 'Update the details of this plot' : 'Fill in the details to add a new plot'}</p>
                </div>
                <button type="button" onClick={() => setShowModal(false)} className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-all duration-200 text-slate-400 hover:text-slate-700">
                  <FaTimes className="text-[14px]" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto px-7 py-6 space-y-8">
                {/* Section 1: Basic Info */}
                <div>
                  <h3 className="text-[13px] font-semibold text-slate-700 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2 uppercase tracking-wide">
                    <span className="w-1 h-4 bg-amber-500 rounded-full" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-2">Plot Number *</label>
                      <input
                        placeholder="e.g. 104"
                        {...register('plotNumber', { required: 'Plot number is required' })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400"
                      />
                      {errors.plotNumber && <p className="text-rose-500 text-[12px] mt-1.5">{errors.plotNumber.message}</p>}
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-2">Project *</label>
                      <select
                        {...register('project', { required: 'Project is required' })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium"
                      >
                        <option value="">Select Project</option>
                        {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                      </select>
                      {errors.project && <p className="text-rose-500 text-[12px] mt-1.5">{errors.project.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Section 2: Dimensions & Specs */}
                <div>
                  <h3 className="text-[13px] font-semibold text-slate-700 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2 uppercase tracking-wide">
                    <span className="w-1 h-4 bg-amber-500 rounded-full" />
                    Dimensions &amp; Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-x-5 gap-y-5">
                    <div className="md:col-span-2">
                      <label className="block text-[12px] font-semibold text-slate-600 mb-2">Size (sq.ft)</label>
                      <input
                        type="number"
                        placeholder="e.g. 1200"
                        {...register('size')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[12px] font-semibold text-slate-600 mb-2">Length (ft)</label>
                      <input
                        type="number"
                        placeholder="e.g. 40"
                        {...register('length')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[12px] font-semibold text-slate-600 mb-2">Width (ft)</label>
                      <input
                        type="number"
                        placeholder="e.g. 30"
                        {...register('width')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[12px] font-semibold text-slate-600 mb-2">Facing Direction</label>
                      <select
                        {...register('facing')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium"
                      >
                        {facings.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[12px] font-semibold text-slate-600 mb-2">Road Width (ft)</label>
                      <input
                        type="number"
                        placeholder="e.g. 30"
                        {...register('roadWidth')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400"
                      />
                    </div>

                    <div className="md:col-span-6 mt-1">
                      <label className="flex items-center gap-3 text-[13px] font-semibold text-slate-700 cursor-pointer select-none hover:text-slate-900 transition-colors duration-200">
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
                  <h3 className="text-[13px] font-semibold text-slate-700 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2 uppercase tracking-wide">
                    <span className="w-1 h-4 bg-amber-500 rounded-full" />
                    Pricing &amp; Location Coordinates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-2">Total Price (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 1500000"
                        {...register('price')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-2">Plot Status</label>
                      <select
                        {...register('status')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium"
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[12px] font-semibold text-slate-600 mb-2">Coordinates (latitude,longitude)</label>
                      <input
                        placeholder="e.g. 20.2961,85.8245"
                        {...register('coordinates')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400"
                      />
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">Comma-separated GPS coordinates for plotting on the master plan layout.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 px-7 py-4.5 bg-slate-50 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 text-[14px] font-semibold border border-slate-200 rounded-xl transition-all duration-200 shadow-sm active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-[14px] rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
