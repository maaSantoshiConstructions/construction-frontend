import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { getPlots, createPlot, updatePlot, deletePlot, updatePlotStatus } from '../../../api/plots';
import { getProjects } from '../../../api/projects';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';

const statusColors = {
  available: 'bg-green-100 text-green-700',
  reserved: 'bg-yellow-100 text-yellow-700',
  sold: 'bg-red-100 text-red-700',
  blocked: 'bg-slate-100 text-slate-600',
};

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

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchPlots = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: p, limit: 10 };
      if (filters.project) params.project = filters.project;
      if (filters.status) params.status = filters.status;
      if (filters.facing) params.facing = filters.facing;
      const { data: res } = await getPlots(params);
      setPlots(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load plots');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectsList = async () => {
    try {
      const { data: res } = await getProjects({ limit: 100 });
      setProjects(res?.data || []);
    } catch {}
  };

  useEffect(() => { fetchPlots(); }, [page, filters]);

  useEffect(() => { fetchProjectsList(); }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ plotNumber: '', project: '', size: '', length: '', width: '', facing: 'North', roadWidth: '', price: '', corner: false, coordinates: '' });
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
    { key: 'plotNumber', label: 'Plot #', render: r => <span className="font-medium">#{r.plotNumber}</span> },
    { key: 'project', label: 'Project', render: r => r.project?.name || '-' },
    { key: 'size', label: 'Size', render: r => r.size ? `${r.size} sq.ft` : r.length && r.width ? `${r.length}x${r.width}` : '-' },
    { key: 'facing', label: 'Facing', render: r => r.facing || '-' },
    { key: 'status', label: 'Status', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status}</span> },
    { key: 'price', label: 'Price', render: r => r.price ? `₹${r.price.toLocaleString()}` : '-' },
    { key: 'owner', label: 'Owner', render: r => r.owner?.name || '-' },
    { key: 'actions', label: 'Actions', render: r => (
      <div className="flex items-center gap-2">
        <button onClick={() => openEdit(r)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg"><FaEdit /></button>
        <button onClick={() => handleDelete(r._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><FaTrash /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Plots</h1>
          <p className="text-slate-500 text-sm">Manage plot inventory across projects</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-xl transition-colors">
          <FaPlus /> Add Plot
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={filters.project} onChange={e => { setFilters(f => ({ ...f, project: e.target.value })); setPage(1); }} className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500">
          <option value="">All Projects</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <select value={filters.status} onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }} className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500">
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
          <option value="blocked">Blocked</option>
        </select>
        <select value={filters.facing} onChange={e => { setFilters(f => ({ ...f, facing: e.target.value })); setPage(1); }} className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500">
          <option value="">All Facings</option>
          {facings.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => fetchPlots()} /> : (
        <>
          <DataTable columns={columns} data={plots} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">{editing ? 'Edit Plot' : 'Add Plot'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Plot Number *</label>
                <input {...register('plotNumber', { required: 'Plot number is required' })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                {errors.plotNumber && <p className="text-red-500 text-xs mt-1">{errors.plotNumber.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project *</label>
                <select {...register('project', { required: 'Project is required' })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
                {errors.project && <p className="text-red-500 text-xs mt-1">{errors.project.message}</p>}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Size (sq.ft)</label>
                  <input type="number" {...register('size')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Length</label>
                  <input type="number" {...register('length')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Width</label>
                  <input type="number" {...register('width')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Facing</label>
                  <select {...register('facing')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                    {facings.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Road Width</label>
                  <input {...register('roadWidth')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                <input type="number" {...register('price')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Coordinates (lat,lng)</label>
                  <input {...register('coordinates')} placeholder="28.6139,77.2090" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" {...register('corner')} className="rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
                    Corner Plot
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white text-sm font-medium rounded-lg flex items-center gap-2">
                  {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
