import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGalleryItems } from '../../api/gallery';
import { FaTimes, FaChevronLeft, FaChevronRight, FaImage, FaVideo, FaCamera, FaFilter } from 'react-icons/fa';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

const typeFilters = [
  { value: 'all', label: 'All', icon: FaImage },
  { value: 'image', label: 'Images', icon: FaImage },
  { value: 'video', label: 'Videos', icon: FaVideo },
  { value: 'drone', label: 'Drone', icon: FaCamera },
];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filter !== 'all') params.type = filter;
      if (selectedCategory) params.category = selectedCategory;
      const { data } = await getGalleryItems(params);
      setItems(data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load gallery');
      setItems([
        { _id: '1', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', type: 'image', category: 'Project', title: 'Green Valley Overview' },
        { _id: '2', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', type: 'image', category: 'Project', title: 'Lakeview Exterior' },
        { _id: '3', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', type: 'image', category: 'Construction', title: 'Under Construction' },
        { _id: '4', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', type: 'image', category: 'Amenities', title: 'Club House' },
        { _id: '5', url: 'https://images.unsplash.com/photo-1600566753086-00f18f6b7d0a?w=800', type: 'image', category: 'Location', title: 'Neighborhood View' },
        { _id: '6', url: 'https://images.unsplash.com/photo-1600573472556-5c0a1c5a0b1e?w=800', type: 'image', category: 'Project', title: 'Golden Palm Entrance' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [filter, selectedCategory]);

  useEffect(() => {
    const cats = [...new Set(items.map((item) => item.category).filter(Boolean))];
    setCategories(cats);
  }, [items]);

  const filteredItems = items.filter((item) => {
    if (filter !== 'all' && item.type !== filter) return false;
    if (selectedCategory && item.category !== selectedCategory) return false;
    return true;
  });

  const nextImage = () => {
    const currentIndex = filteredItems.findIndex((i) => i._id === lightbox?._id);
    const next = (currentIndex + 1) % filteredItems.length;
    setLightbox(filteredItems[next]);
  };

  const prevImage = () => {
    const currentIndex = filteredItems.findIndex((i) => i._id === lightbox?._id);
    const prev = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setLightbox(filteredItems[prev]);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!lightbox) return;
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox, filteredItems]);

  if (loading) return <Loader />;
  if (error && items.length === 0) return <ErrorMessage message={error} onRetry={fetchGallery} />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Gallery</h1>
            <p className="text-blue-100">Explore our projects through images and videos</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm p-4 mb-8">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {typeFilters.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setFilter(t.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === t.value ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  <t.icon /> {t.label}
                </button>
              ))}
            </div>
            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            )}
          </div>
        </motion.div>

        {filteredItems.length === 0 ? (
          <EmptyState title="No media found" description="Try changing the filter or category." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-16">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="relative group rounded-xl overflow-hidden cursor-pointer aspect-[4/3]"
                onClick={() => setLightbox(item)}
              >
                <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center p-4">
                    {item.type !== 'image' && (
                      <span className="block mb-2 text-2xl">{item.type === 'video' ? '▶' : '🛸'}</span>
                    )}
                    <p className="font-medium text-sm">{item.title}</p>
                    {item.category && <p className="text-xs text-white/70 mt-1">{item.category}</p>}
                  </div>
                </div>
                {item.type !== 'image' && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-black/50 text-white text-xs rounded-full capitalize backdrop-blur-sm">
                    {item.type}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-white/70 hover:text-white z-10"><FaTimes className="text-2xl" /></button>
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10"><FaChevronLeft className="text-3xl" /></button>
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10"><FaChevronRight className="text-3xl" /></button>
            <motion.div
              key={lightbox._id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.type === 'video' ? (
                <video src={lightbox.url} controls className="max-h-[85vh] rounded-lg" autoPlay />
              ) : (
                <img src={lightbox.url} alt={lightbox.title} className="max-h-[85vh] rounded-lg object-contain" />
              )}
              <div className="text-center mt-4">
                <p className="text-white font-medium">{lightbox.title}</p>
                {lightbox.category && <p className="text-white/60 text-sm">{lightbox.category} • {lightbox.type}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
