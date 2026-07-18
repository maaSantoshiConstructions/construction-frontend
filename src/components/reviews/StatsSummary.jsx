import React from 'react';
import { FaStar, FaPlus, FaCheckCircle } from 'react-icons/fa';
import { renderStars } from './ReviewCard';

export default function StatsSummary({
  stats,
  ratingFilter,
  onRatingFilterChange,
  onOpenModal,
}) {
  return (
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
                onClick={() => onRatingFilterChange(isSelected ? '' : String(stars))}
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
            onClick={onOpenModal}
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
  );
}
