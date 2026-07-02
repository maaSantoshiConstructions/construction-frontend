import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaUpload, FaTrash, FaTimes } from 'react-icons/fa';
import { getGalleryItems, createGalleryItem, deleteGalleryItem } from '../../../api/gallery';
import ErrorMessage from '../../../components/common/ErrorMessage';

export default function ManageGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [type, setType] = useState('image');
  const fileRef = useRef(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (typeFilter) params.type = typeFilter;
      const { data: res } = await getGalleryItems(params);
      setItems(res?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [typeFilter]);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', caption);
      formData.append('type', type);
      await createGalleryItem(formData);
      toast.success('Image uploaded');
      setShowUpload(false);
      setCaption('');
      setType('image');
      fileRef.current.value = '';
      fetchItems();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await deleteGalleryItem(id);
      toast.success('Image deleted');
      fetchItems();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Gallery</h1>
          <p className="text-slate-500 text-sm">Upload and manage project images</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="virtual_tour">Virtual Tours</option>
          </select>
          <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
            <FaUpload /> Upload
          </button>
        </div>
      </div>

      {error ? <ErrorMessage message={error} onRetry={fetchItems} /> : (
        <>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-video bg-slate-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <p className="text-lg font-medium">No gallery items</p>
              <p className="text-sm">Upload images to showcase your projects.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item, i) => (
                <motion.div
                  key={item._id || i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  <div className="aspect-video bg-slate-100">
                    {item.type === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center text-slate-400"><span className="text-lg">🎬</span></div>
                    ) : (
                      <img src={item.url || item.imageUrl} alt={item.caption || ''} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs text-slate-600 truncate">{item.caption || 'No caption'}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowUpload(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Upload Image</h2>
              <button onClick={() => setShowUpload(false)} className="p-1 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Caption</label>
                <input value={caption} onChange={e => setCaption(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="virtual_tour">Virtual Tour</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">File</label>
                <input ref={fileRef} type="file" accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowUpload(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={handleUpload} disabled={uploading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg flex items-center gap-2">
                  {uploading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  Upload
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
