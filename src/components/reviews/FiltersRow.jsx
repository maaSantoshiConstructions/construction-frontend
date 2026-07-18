import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function FiltersRow({
  projectFilter,
  onProjectFilterChange,
  ratingFilter,
  onRatingFilterChange,
  sortOption,
  onSortOptionChange,
  projectOptions = [],
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      {/* Active Filters Summary */}
      <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 font-poppins">Filter:</span>
        
        {/* Project Filter Select */}
        <select
          value={projectFilter}
          onChange={(e) => onProjectFilterChange(e.target.value)}
          className="px-3.5 py-1.5 rounded-full border border-slate-200 text-xs bg-white text-slate-700 font-semibold outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 cursor-pointer shadow-sm"
        >
          <option value="">All Projects</option>
          {projectOptions.map(proj => (
            <option key={proj} value={proj}>{proj}</option>
          ))}
        </select>

        {/* Rating Filter Pill */}
        {ratingFilter && (
          <button
            onClick={() => onRatingFilterChange('')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
          >
            {ratingFilter} Stars <FaTimes className="text-[9px]" />
          </button>
        )}
        
        {/* Clear Filters Button */}
        {(projectFilter || ratingFilter) && (
          <button
            onClick={() => { onRatingFilterChange(''); onProjectFilterChange(''); }}
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
          onChange={(e) => onSortOptionChange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-700 font-semibold outline-none focus:border-indigo-600 cursor-pointer shadow-sm"
        >
          <option value="newest">Most Recent</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>
    </div>
  );
}
