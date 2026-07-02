import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '../../../api/faqs';
import ErrorMessage from '../../../components/common/ErrorMessage';

export default function ManageFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchFAQs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getFAQs({ limit: 100 });
      setFaqs(res?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFAQs(); }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ question: '', answer: '', category: '', order: '' });
    setShowModal(true);
  };

  const openEdit = (faq) => {
    setEditing(faq);
    reset({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || '',
      order: faq.order || '',
    });
    setShowModal(true);
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const payload = { ...formData, order: formData.order ? parseInt(formData.order) : undefined };
      if (editing) {
        await updateFAQ(editing._id, payload);
        toast.success('FAQ updated');
      } else {
        await createFAQ(payload);
        toast.success('FAQ created');
      }
      setShowModal(false);
      fetchFAQs();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      await deleteFAQ(id);
      toast.success('FAQ deleted');
      fetchFAQs();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-slate-200 rounded-xl animate-pulse" />)}</div>;
  if (error) return <ErrorMessage message={error} onRetry={fetchFAQs} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage FAQs</h1>
          <p className="text-slate-500 text-sm">Manage frequently asked questions</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-xl transition-colors">
          <FaPlus /> Add FAQ
        </button>
      </div>

      {faqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <p className="text-lg font-medium">No FAQs yet</p>
          <p className="text-sm">Click "Add FAQ" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq._id || i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-xl border border-slate-200 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">{faq.category || 'General'}</span>
                    {faq.order && <span className="text-xs text-slate-400">Order: {faq.order}</span>}
                  </div>
                  <h3 className="font-medium text-slate-800">{faq.question}</h3>
                  <p className="text-sm text-slate-500 mt-1">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(faq)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg"><FaEdit /></button>
                  <button onClick={() => handleDelete(faq._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><FaTrash /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">{editing ? 'Edit FAQ' : 'Add FAQ'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Question *</label>
                <input {...register('question', { required: 'Question is required' })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Answer *</label>
                <textarea {...register('answer', { required: 'Answer is required' })} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input {...register('category')} placeholder="e.g. Booking, Payment" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
                  <input type="number" {...register('order')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
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
