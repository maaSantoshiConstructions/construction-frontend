import React from 'react';
import { LuSearch } from 'react-icons/lu';

export default function ReferralFilterToolbar({
  search = '',
  setSearch,
  statusFilter = '',
  setStatusFilter,
  onSearchEnter,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
      <div className="relative w-full sm:w-72">
        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Search by friend or referrer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearchEnter && onSearchEnter()}
          className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="interested">Interested</option>
          <option value="booking_done">Booking Done</option>
          <option value="commission_paid">Commission Paid</option>
          <option value="lost">Lost</option>
        </select>
      </div>
    </div>
  );
}
