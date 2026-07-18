import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaStar, FaSpinner } from 'react-icons/fa';
import { getReviews, createReview, voteHelpful } from '../../api/reviews';

// Import sub-components
import StatsSummary from '../../components/reviews/StatsSummary';
import FiltersRow from '../../components/reviews/FiltersRow';
import ReviewCard from '../../components/reviews/ReviewCard';
import ReviewModal from '../../components/reviews/ReviewModal';

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

  // Track voted review IDs in local state
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
        fetchReviewsData();
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
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
        <StatsSummary
          stats={stats}
          ratingFilter={ratingFilter}
          onRatingFilterChange={setRatingFilter}
          onOpenModal={() => setIsModalOpen(true)}
        />

        {/* CONTROLS ROW */}
        <FiltersRow
          projectFilter={projectFilter}
          onProjectFilterChange={setProjectFilter}
          ratingFilter={ratingFilter}
          onRatingFilterChange={setRatingFilter}
          sortOption={sortOption}
          onSortOptionChange={setSortOption}
          projectOptions={PROJECT_OPTIONS}
        />

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
                  >
                    <ReviewCard
                      review={rev}
                      votedIds={votedIds}
                      onVoteHelpful={handleVoteHelpful}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ===== WRITE A REVIEW MODAL ===== */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newReview={newReview}
        setNewReview={setNewReview}
        onSubmit={handleCreateReview}
        submitting={submitting}
        projectOptions={PROJECT_OPTIONS}
      />
    </div>
  );
}
