import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaHeart, FaTrash, FaBookmark, FaRupeeSign, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import EmptyState from '../../../components/common/EmptyState';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlist(saved);
    } catch {
      setWishlist([]);
    }
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => (item._id || item.id) !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    toast.success('Removed from wishlist');
  };

  const handleBookNow = (item) => {
    window.location.href = `/book-visit?plot=${item._id || item.id}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Wishlist</h1>
        <p className="text-slate-500 text-sm">Your saved properties</p>
      </div>

      {wishlist.length === 0 ? (
        <EmptyState
          icon={FaHeart}
          title="Your wishlist is empty"
          description="Browse properties and save your favorites here"
          action={{ label: 'Browse Properties', onClick: () => window.location.href = '/projects' }}
        />
      ) : (
        <div className="grid gap-4">
          {wishlist.map((item, i) => (
            <motion.div
              key={item._id || item.id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 h-40 bg-slate-200 flex items-center justify-center flex-shrink-0">
                  {item.images?.[0] || item.image ? (
                    <img src={item.images?.[0] || item.image} alt={item.plotNumber || item.title} className="w-full h-full object-cover" />
                  ) : (
                    <FaBuilding className="text-slate-400 text-3xl" />
                  )}
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{item.project?.name || item.projectName || item.title || 'Property'}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                        <FaMapMarkerAlt className="text-xs" /> {item.project?.location || item.location || '-'}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromWishlist(item._id || item.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from wishlist"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-slate-400 text-xs">Plot Number</p>
                      <p className="font-medium text-slate-800">{item.plotNumber || item.number || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Size</p>
                      <p className="font-medium text-slate-800">{item.size || item.plotSize || '-'} sq.yd</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Price</p>
                      <p className="font-semibold text-blue-600">₹{((item.price || item.totalPrice || 0)).toLocaleString()}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookNow(item)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <FaBookmark /> Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
