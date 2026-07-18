import React from 'react';
import { FaStar, FaThumbsUp, FaUserCircle } from 'react-icons/fa';

export const renderStars = (ratingValue, size = 'text-sm') => {
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

export default function ReviewCard({ review, votedIds, onVoteHelpful }) {
  const isVoted = votedIds.includes(review._id);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition h-full">
      <div>
        {/* Rating & Date */}
        <div className="flex items-center justify-between mb-3.5">
          {renderStars(review.rating)}
          <span className="text-[11px] text-slate-400 font-semibold font-poppins">
            {new Date(review.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        {/* Comment */}
        <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">
          "{review.comment}"
        </p>
      </div>

      {/* Bottom Metadata & Helpful vote */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-slate-300 text-3xl" />
          <div>
            <h4 className="text-xs font-bold text-slate-800 font-poppins">{review.name}</h4>
            {review.project && (
              <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider">
                Verified Owner • {review.project}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onVoteHelpful(review._id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
            isVoted
              ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
              : 'bg-white border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-600'
          }`}
        >
          <FaThumbsUp className="text-[10px]" />
          <span>{review.helpfulVotes || 0}</span>
        </button>
      </div>
    </div>
  );
}
