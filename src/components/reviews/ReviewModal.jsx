import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaStar, FaSpinner } from 'react-icons/fa';

export default function ReviewModal({
  isOpen,
  onClose,
  newReview,
  setNewReview,
  onSubmit,
  submitting,
  projectOptions = [],
}) {
  const [starHover, setStarHover] = useState(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg relative z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-poppins font-extrabold text-slate-800 text-base">Write Customer Review</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={onSubmit} className="p-6 space-y-5">
              {/* Rating Input */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-poppins">
                  Select Star Rating *
                </label>
                <div className="flex gap-2.5">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setNewReview(prev => ({ ...prev, rating: stars }))}
                      onMouseEnter={() => setStarHover(stars)}
                      onMouseLeave={() => setStarHover(null)}
                      className="text-3xl transition duration-150 transform hover:scale-110 cursor-pointer"
                    >
                      <FaStar
                        className={
                          stars <= (starHover || newReview.rating)
                            ? 'text-[#e8b355]'
                            : 'text-slate-200'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-poppins">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Full name"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                />
              </div>

              {/* Project Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-poppins">
                  Project / Phase *
                </label>
                <select
                  value={newReview.project}
                  onChange={(e) => setNewReview(prev => ({ ...prev, project: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:bg-white focus:border-indigo-600 outline-none cursor-pointer transition font-semibold"
                >
                  {projectOptions.map((proj) => (
                    <option key={proj} value={proj}>{proj}</option>
                  ))}
                </select>
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-poppins">
                  Your Review *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Tell us about your experience buying plots or construction with us..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                />
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    Submitting review...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
