import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { getUpdates, createUpdate, updateUpdate, deleteUpdate } from '../../../api/constructionUpdates';
import { getProjects } from '../../../api/projects';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';

export default function ManageConstructionUpdates() {
  const [updates, setUpdates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchUpdates = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getUpdates({ page: p, limit: 10 });
      setUpdates(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load updates');
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

  useEffect(() => { fetchUpdates(); }, [page]);
  useEffect(() => { fetchProjectsList(); }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ title: '', description: '', project: '', plot: '', stage: '', progress: '' });
    setShowModal(true);
  };

  const openEdit = (update) => {
    setEditing(update);
    reset({
      title: update.title || '',
      description: update.description || '',
      project: update.project?._id || update.project || '',
      plot: update.plot?._id || update.plot || '',
      stage: update.stage || '',
      progress: update.progress || '',
    });
    setShowModal(true);
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const payload = { ...formData, progress: formData.progress ? parseInt(formData.progress) : undefined };
      if (editing) {
        await updateUpdate(editing._id, payload);
        toast.success('Update saved');
      } else {
        await createUpdate(payload);
        toast.success('Update created');
      }
      setShowModal(false);
      fetchUpdates();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this update?')) return;
    try {
      await deleteUpdate(id);
      toast.success('Update deleted');
      fetchUpdates();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { key: 'title', label: 'Title', render: r => <span className="font-medium text-slate-800">{r.title}</span> },
    { key: 'project', label: 'Project', render: r => r.project?.name || '-' },
    { key: 'plot', label: 'Plot', render: r => r.plot?.plotNumber ? `#${r.plot.plotNumber}` : '-' },
    { key: 'stage', label: 'Stage', render: r => r.stage || '-' },
    { key: 'progress', label: 'Progress %', render: r => (
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${r.progress || 0}%` }} />
        </div>
        <span className="text-xs font-medium text-slate-600">{r.progress || 0}%</span>
      </div>
    )},
    { key: 'date', label: 'Date', render: r => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-' },
    { key: 'actions', label: 'Actions', render: r => (
      <div className="flex items-center gap-2">
        <button onClick={() => openEdit(r)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><FaEdit /></button>
        <button onClick={() => handleDelete(r._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><FaTrash /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Construction Updates</h1>
          <p className="text-slate-500 text-sm">Track construction progress</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
          <FaPlus /> Add Update
        </button>
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => fetchUpdates()} /> : (
        <>
          <DataTable columns={columns} data={updates} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">{editing ? 'Edit Update' : 'Add Update'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input {...register('title', { required: 'Title is required' })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea {...register('description')} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                  <select {...register('project')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stage</label>
                  <input {...register('stage')} placeholder="e.g. Foundation, Roofing" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Progress (%)</label>
                <input type="number" min="0" max="100" {...register('progress')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg flex items-center gap-2">
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
