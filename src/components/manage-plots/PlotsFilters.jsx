import React from 'react';
import { LuSearch } from 'react-icons/lu';

export default function PlotsFilters({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  projects,
  facings,
  setPage,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 mb-6">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-[220px] max-w-sm">
        <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
        <input
          type="text"
          placeholder="Search by Plot Number (e.g. 104)..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 focus:bg-white"
        />
      </div>

      {/* Filter Selects */}
      <div className="flex flex-wrap items-center gap-2.5">
        <select
          value={filters.project}
          onChange={(e) => {
            setFilters((f) => ({ ...f, project: e.target.value }));
            setPage(1);
          }}
          className="h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 outline-none cursor-pointer min-w-[140px] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 focus:bg-white transition-all"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => {
            setFilters((f) => ({ ...f, status: e.target.value }));
            setPage(1);
          }}
          className="h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 outline-none cursor-pointer min-w-[130px] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 focus:bg-white transition-all"
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
          <option value="blocked">Blocked</option>
        </select>

        <select
          value={filters.facing}
          onChange={(e) => {
            setFilters((f) => ({ ...f, facing: e.target.value }));
            setPage(1);
          }}
          className="h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 outline-none cursor-pointer min-w-[130px] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 focus:bg-white transition-all"
        >
          <option value="">All Facings</option>
          {facings.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
