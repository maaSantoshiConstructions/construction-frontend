import React from 'react';
import { FaWhatsapp, FaCheckCircle } from 'react-icons/fa';

export default function CRMComposer({
  phone,
  setPhone,
  customerName,
  setCustomerName,
  template,
  setTemplate,
  selectedProject,
  setSelectedProject,
  selectedPlotId,
  setSelectedPlotId,
  customMessage,
  setCustomMessage,
  loading,
  uniqueProjects = [],
  filteredPlots = [],
  onSend,
  sent,
}) {
  return (
    <div className="bg-slate-50 border border-dashed border-indigo-200 rounded-2xl p-6 md:p-8">
      <h3 className="text-base font-bold text-slate-800 mb-1.5 font-poppins">
        Smart Message Composer (WhatsApp CRM)
      </h3>
      <p className="text-slate-500 text-xs md:text-sm font-medium mb-5">
        Test and customize dynamic templates powered by actual property records before opening WhatsApp:
      </p>

      {/* Step 1: Template Toggles */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-poppins">
          1. Select Communication Template:
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'property_alert', label: '🏡 Property Alert' },
            { id: 'site_visit', label: '📅 Site Visit Invitation' },
            { id: 'payment_reminder', label: '💰 Payment Reminder' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition duration-200 outline-none cursor-pointer ${
                template === t.id
                  ? 'bg-indigo-50 border border-indigo-600 text-indigo-600'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Property Filter Dropdowns */}
      {(template === 'property_alert' || template === 'payment_reminder') && (
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-poppins">
            2. Select Property Details:
          </label>
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                disabled={loading || uniqueProjects.length === 0}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 outline-none cursor-pointer focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
              >
                {uniqueProjects.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <select
                value={selectedPlotId}
                onChange={(e) => setSelectedPlotId(e.target.value)}
                disabled={loading || filteredPlots.length === 0}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 outline-none cursor-pointer focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
              >
                {filteredPlots.map((p) => (
                  <option key={p.id} value={p.id}>
                    Plot {p.plotNumber} — {p.size} sq.ft (₹{p.price} L)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Recipient Personalization */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-poppins">
          {template === 'property_alert' || template === 'payment_reminder' ? '3.' : '2.'} Customer Personalization & Recipient:
        </label>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Customer Name (e.g. Rahul)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Recipient Phone (+91 XXXXX XXXXX)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
        </div>
      </div>

      {/* Step 4: Editable Message Preview Area */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-poppins">
          Message Preview (Directly editable text):
        </label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="w-full h-44 px-4 py-3.5 rounded-xl border border-indigo-600 text-xs md:text-sm font-sans leading-relaxed outline-none bg-slate-50 text-slate-800 resize-y focus:bg-white transition"
        />
      </div>

      {/* Step 5: Send Redirection */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onSend}
          disabled={loading || !phone}
          className="px-6 py-3 rounded-lg text-white font-bold text-xs md:text-sm flex items-center gap-2 transition duration-200 bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
        >
          <FaWhatsapp className="text-base md:text-lg" /> Send Custom Alert on WhatsApp
        </button>

        {sent && (
          <div className="flex items-center gap-2 text-xs md:text-sm text-emerald-500 font-semibold">
            <FaCheckCircle /> WhatsApp redirect triggered!
          </div>
        )}
      </div>
    </div>
  );
}
