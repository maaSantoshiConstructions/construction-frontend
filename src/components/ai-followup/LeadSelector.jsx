import React from 'react';
import { FaSpinner } from 'react-icons/fa';

export default function LeadSelector({
  loadingLeads,
  leads = [],
  selectedLeadId,
  setSelectedLeadId
}) {
  const selectedLead = leads.find((l) => l._id === selectedLeadId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 mb-6">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-poppins">
        1. Select Lead for Simulation
      </h3>
      {loadingLeads ? (
        <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
          <FaSpinner className="animate-spin text-indigo-600" />
          Loading active leads...
        </div>
      ) : leads.length === 0 ? (
        <div className="text-xs text-slate-500 py-2">
          No active leads found in the database. Please add a lead first.
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <select
            value={selectedLeadId}
            onChange={(e) => setSelectedLeadId(e.target.value)}
            className="w-full md:w-2/3 px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer"
          >
            {leads.map((l) => (
              <option key={l._id} value={l._id}>
                {l.name} — {l.phone || 'No phone'} ({l.status.toUpperCase()})
              </option>
            ))}
          </select>
          {selectedLead && (
            <div className="w-full md:w-1/3 text-xs bg-slate-50 border border-slate-100 rounded-lg p-3 text-slate-500">
              <div><strong>Status:</strong> {selectedLead.status.toUpperCase()}</div>
              <div className="mt-1"><strong>Score:</strong> {selectedLead.score || 0}%</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
