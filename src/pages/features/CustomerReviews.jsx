import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaStar, FaThumbsUp, FaPlus, FaTimes, FaSpinner, FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import { getReviews, createReview, voteHelpful } from '../../api/reviews';

const PROJECT_OPTIONS = [
  'Royal Gardens Phase 1',
  'Royal Gardens Phase 2',
  'Santoshi Vihar',
  'Santoshi Enclave',
  'Maa Santoshi Heights',
];

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Filter & Sort State
  const [ratingFilter, setRatingFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    project: PROJECT_OPTIONS[0],
    comment: ''
  });
  
  // Hover state for interactive stars in form
  const [starHover, setStarHover] = useState(null);

  // Track voted review IDs in local state to prevent double voting in current session
  const [votedIds, setVotedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('voted_reviews');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fetchReviewsData = async () => {
    try {
      setLoading(true);
      const res = await getReviews({
        sort: sortOption,
        rating: ratingFilter,
        project: projectFilter
      });
      if (res.data?.success) {
        setReviews(res.data.data || []);
        setStats(res.data.stats || {
          totalReviews: 0,
          averageRating: 0,
          breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        });
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      toast.error('Unable to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsData();
  }, [sortOption, ratingFilter, projectFilter]);

  const handleVoteHelpful = async (id) => {
    if (votedIds.includes(id)) {
      toast.error('You have already voted this review as helpful!');
      return;
    }
    
    try {
      const res = await voteHelpful(id);
      if (res.data?.success) {
        // Update locally
        setReviews(prev => prev.map(rev => rev._id === id ? { ...rev, helpfulVotes: rev.helpfulVotes + 1 } : rev));
        const newVoted = [...votedIds, id];
        setVotedIds(newVoted);
        localStorage.setItem('voted_reviews', JSON.stringify(newVoted));
        toast.success('Thank you for your feedback!');
      }
    } catch (err) {
      console.error('Failed to vote helpful:', err);
      toast.error('Could not submit vote.');
    }
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();
    if (!newReview.name.trim()) {
      toast.error('Please enter your name.');
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error('Please write a comment.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await createReview(newReview);
      if (res.data?.success) {
        toast.success('Your review has been submitted successfully!');
        setIsModalOpen(false);
        setNewReview({
          name: '',
          rating: 5,
          project: PROJECT_OPTIONS[0],
          comment: ''
        });
        // Reload to update stats and list
        fetchReviewsData();
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to generate star elements
  const renderStars = (ratingValue, size = 'text-sm') => {
    return (
      <div className="flex gap-0.5 text-[#e8b355]">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`${size} ${i < ratingValue ? 'text-[#e8b355]' : 'text-slate-200'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* ===== HERO BANNER ===== */}
      <div className="relative overflow-hidden text-center py-16 px-4 bg-gradient-to-br from-slate-900 to-indigo-950">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/10 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-amber-500/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <span className="inline-block bg-white/10 text-[#e8b355] font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3.5">
            CLIENT TESTIMONIALS
          </span>
          <h1 className="font-poppins text-white text-3xl md:text-4xl font-extrabold mt-2 mb-3">
            Customer Reviews & Ratings
          </h1>
          <p className="text-indigo-200 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Read verified reviews and feedback directly from our property owners.
          </p>
        </div>
      </div>

      {/* ===== MAIN CONTAINER ===== */}
      <div className="max-w-6xl mx-auto px-6 -mt-7 relative z-10">
        {/* SUMMARY & STATS CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left: Overall Avg Score */}
            <div className="md:col-span-4 text-center md:border-r md:border-slate-100 md:pr-8 py-2">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 font-poppins">Overall Rating</h2>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-6xl font-extrabold text-slate-800 tracking-tight font-poppins">
                  {stats.averageRating}
                </span>
                <span className="text-2xl font-bold text-slate-300">/ 5</span>
              </div>
              <div className="flex justify-center my-3">
                {renderStars(Math.round(stats.averageRating), 'text-xl')}
              </div>
              <p className="text-xs text-slate-400 font-medium font-poppins">
                Based on {stats.totalReviews} verified submissions
              </p>
            </div>

            {/* Middle: Star Distribution */}
            <div className="md:col-span-5 flex flex-col gap-2.5">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = stats.breakdown[stars] || 0;
                const percent = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                const isSelected = ratingFilter === String(stars);

                return (
                  <button
                    key={stars}
                    onClick={() => setRatingFilter(isSelected ? '' : String(stars))}
                    className={`flex items-center gap-3 text-left w-full hover:bg-slate-50 p-1 rounded transition group cursor-pointer ${
                      isSelected ? 'bg-indigo-50/70 hover:bg-indigo-50' : ''
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-600 w-12 flex items-center gap-1">
                      {stars} <FaStar className="text-amber-400 text-[10px]" />
                    </span>
                    <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSelected ? 'bg-indigo-600' : 'bg-amber-400 group-hover:bg-amber-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 font-bold w-8 text-right">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: Submit Call to Action & Trust Indicators */}
            <div className="md:col-span-3 flex flex-col items-center md:items-stretch justify-center pl-0 md:pl-4 text-center md:text-left gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md hover:shadow-lg cursor-pointer"
              >
                <FaPlus className="text-[10px]" /> Write a Review
              </button>
              
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-600 text-xs font-semibold">
                  <FaCheckCircle className="text-emerald-500 text-sm flex-shrink-0" />
                  <span>100% Verified Owners</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-600 text-xs font-semibold">
                  <FaCheckCircle className="text-emerald-500 text-sm flex-shrink-0" />
                  <span>Transparent RERA Plots</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CONTROLS ROW */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* Active Filters Summary */}
          <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 font-poppins">Filter:</span>
            
            {/* Project Filter Select */}
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-3.5 py-1.5 rounded-full border border-slate-200 text-xs bg-white text-slate-700 font-semibold outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 cursor-pointer shadow-sm"
            >
              <option value="">All Projects</option>
              {PROJECT_OPTIONS.map(proj => (
                <option key={proj} value={proj}>{proj}</option>
              ))}
            </select>

            {/* Rating Filter Pill */}
            {ratingFilter && (
              <button
                onClick={() => setRatingFilter('')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
              >
                {ratingFilter} Stars <FaTimes className="text-[9px]" />
              </button>
            )}
            
            {/* Clear Filters Button */}
            {(projectFilter || ratingFilter) && (
              <button
                onClick={() => { setRatingFilter(''); setProjectFilter(''); }}
                className="text-xs font-semibold text-slate-400 hover:text-red-500 transition cursor-pointer px-1 py-1"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-poppins">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-700 font-semibold outline-none focus:border-indigo-600 cursor-pointer shadow-sm"
            >
              <option value="newest">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* FEED SECTION */}
        <div>
          {loading ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-xl">
              <FaSpinner className="text-3xl text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-sm font-semibold text-slate-400">Loading verified customer reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-xl px-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-2xl text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1 font-poppins">No reviews found</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                There are no reviews matching your current filters. Try resetting the filters or write the first one!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {reviews.map((rev) => (
                  <motion.div
                    key={rev._id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition"
                  >
                    <div>
                      {/* Rating & Date */}
                      <div className="flex items-center justify-between mb-3.5">
                        {renderStars(rev.rating)}
                        <span className="text-[11px] text-slate-400 font-semibold font-poppins">
                          {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* Comment */}
                      <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">
                        "{rev.comment}"
                      </p>
                    </div>

                    {/* Bottom Metadata & Helpful vote */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                      <div className="flex items-center gap-2">
                        <FaUserCircle className="text-slate-300 text-3xl" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 font-poppins">{rev.name}</h4>
                          {rev.project && (
                            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider">
                              Verified Owner • {rev.project}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleVoteHelpful(rev._id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          votedIds.includes(rev._id)
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                            : 'bg-white border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-600'
                        }`}
                      >
                        <FaThumbsUp className="text-[10px]" />
                        <span>{rev.helpfulVotes || 0}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ===== WRITE A REVIEW MODAL ===== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
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
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleCreateReview} className="p-6 space-y-5">
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
                    {PROJECT_OPTIONS.map((proj) => (
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
    </div>
  );
}
