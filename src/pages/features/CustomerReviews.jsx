import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaUser, FaGoogle } from 'react-icons/fa';

const fallbackReviews = [
  { _id: '1', customer: { name: 'Rajesh Kumar', avatar: '' }, rating: 5, title: 'Excellent experience', comment: 'Very transparent process. The team guided us through every step. Highly recommended for anyone looking to invest in Bhubaneswar.', createdAt: '2026-03-15' },
  { _id: '2', customer: { name: 'Anita Sharma', avatar: '' }, rating: 4, title: 'Great location and value', comment: 'Booked a plot in Santoshi Enclave. The live map feature helped us choose the perfect plot. Construction quality is impressive.', createdAt: '2026-02-20' },
  { _id: '3', customer: { name: 'Debasis Patra', avatar: '' }, rating: 5, title: 'Best real estate platform', comment: 'The AI recommendation was spot on! Found the perfect villa that matched all my requirements. Digital documentation made it very smooth.', createdAt: '2026-01-10' },
  { _id: '4', customer: { name: 'Suchitra Rout', avatar: '' }, rating: 4, title: 'Satisfied customer', comment: 'Good investment option in Patia area. The team is responsive and the WhatsApp updates keep us informed about construction progress.', createdAt: '2025-12-05' },
  { _id: '5', customer: { name: 'Prakash Mohanty', avatar: '' }, rating: 5, title: 'Trustworthy developers', comment: 'After researching multiple options, we chose JSM Infrastructure. The RERA registration gave us confidence. Great after-sales support.', createdAt: '2025-11-18' },
  { _id: '6', customer: { name: 'Sunita Das', avatar: '' }, rating: 5, title: 'Dream home realized', comment: 'From plot selection to possession, everything was handled professionally. The owner dashboard is very useful to track progress.', createdAt: '2025-10-22' },
];

const RatingStars = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <FaStar key={star} className={star <= rating ? 'text-yellow-400' : 'text-slate-200'} />
    ))}
  </div>
);

const Avatar = ({ name }) => (
  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
    {name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
  </div>
);

export default function CustomerReviews() {
  const [reviews] = useState(fallbackReviews);
  const [filter, setFilter] = useState(0);

  const filteredReviews = filter ? reviews.filter((r) => r.rating === filter) : reviews;
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const distribution = [0, 0, 0, 0, 0];
  reviews.forEach((r) => distribution[r.rating - 1]++);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 via-orange-900 to-amber-900 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Customer Reviews</h1>
            <p className="text-orange-200">Hear from our happy customers about their experience</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="text-center md:text-left">
              <p className="text-sm text-slate-500 mb-1">Overall Rating</p>
              <p className="text-5xl font-bold text-slate-800">{avgRating.toFixed(1)}</p>
              <div className="mt-2">
                <RatingStars rating={Math.round(avgRating)} />
              </div>
              <p className="text-sm text-slate-500 mt-1">{reviews.length} reviews</p>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-12 text-right text-slate-600">{star} <FaStar className="inline text-yellow-400 -mt-0.5" /></span>
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${(distribution[star - 1] / reviews.length) * 100}%` }} />
                  </div>
                  <span className="w-8 text-slate-500 text-xs">{distribution[star - 1]}</span>
                </div>
              ))}
            </div>
            <div className="text-center md:text-right">
              <a
                href="https://g.co/kgs/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <FaGoogle /> Write a Review
              </a>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFilter(0)} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === 0 ? 'bg-orange-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'}`}>All</button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => setFilter(filter === star ? 0 : star)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${filter === star ? 'bg-orange-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'}`}
            >
              <FaStar /> {star}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReviews.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow"
            >
              <FaQuoteLeft className="text-orange-200 text-xl mb-3" />
              <RatingStars rating={review.rating} />
              <h3 className="font-semibold text-slate-800 mt-2 mb-1">{review.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100">
                <Avatar name={review.customer.name} />
                <div>
                  <p className="font-medium text-sm text-slate-800">{review.customer.name}</p>
                  <p className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
