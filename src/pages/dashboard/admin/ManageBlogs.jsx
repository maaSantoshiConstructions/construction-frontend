import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { getBlogs, createBlog, updateBlog, deleteBlog, togglePublish } from '../../../api/blogs';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchBlogs = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getBlogs({ page: p, limit: 10 });
      setBlogs(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, [page]);

  const openCreate = () => {
    setEditing(null);
    reset({ title: '', content: '', excerpt: '', tags: '', category: '', published: false });
    setShowModal(true);
  };

  const openEdit = (blog) => {
    setEditing(blog);
    reset({
      title: blog.title || '',
      content: blog.content || '',
      excerpt: blog.excerpt || '',
      tags: blog.tags?.join(', ') || '',
      category: blog.category || '',
      published: blog.published || false,
    });
    setShowModal(true);
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const payload = { ...formData, tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [] };
      if (editing) {
        await updateBlog(editing._id, payload);
        toast.success('Blog updated');
      } else {
        await createBlog(payload);
        toast.success('Blog created');
      }
      setShowModal(false);
      fetchBlogs();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    try {
      await deleteBlog(id);
      toast.success('Blog deleted');
      fetchBlogs();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await togglePublish(id);
      toast.success('Published status toggled');
      fetchBlogs();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Toggle failed');
    }
  };

  const columns = [
    { key: 'title', label: 'Title', render: r => <span className="font-medium text-slate-800">{r.title}</span> },
    { key: 'author', label: 'Author', render: r => r.author?.name || r.author || '-' },
    { key: 'published', label: 'Published', render: r => (
      <button onClick={() => handleTogglePublish(r._id)} className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'} hover:opacity-80`}>
        {r.published ? 'Published' : 'Draft'}
      </button>
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
          <h1 className="text-2xl font-bold text-slate-800">Manage Blogs</h1>
          <p className="text-slate-500 text-sm">Create and manage blog posts</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
          <FaPlus /> Add Blog
        </button>
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => fetchBlogs()} /> : (
        <>
          <DataTable columns={columns} data={blogs} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">{editing ? 'Edit Blog' : 'Add Blog'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input {...register('title', { required: 'Title is required' })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content *</label>
                <textarea {...register('content', { required: 'Content is required' })} rows={6} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
                <textarea {...register('excerpt')} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input {...register('category')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
                  <input {...register('tags')} placeholder="e.g. real-estate, tips" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" {...register('published')} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <label className="text-sm text-slate-700">Publish immediately</label>
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
