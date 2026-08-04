import React from 'react';
import { motion } from 'framer-motion';
import { LuCheck, LuArrowLeft } from 'react-icons/lu';
import { FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import config from '../../config';

export default function BookVisitSuccess({ visitDetails, setSuccess, setVisitDetails }) {
  return (
    <div className="bg-[#f7f7fb] min-h-screen pb-[90px]">
      {/* ===== PAGE HEADER ===== */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-center py-16 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-white/10 text-amber-400 border border-white/10">
            SUCCESS
          </span>
          <h1 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl font-extrabold text-white my-3">
            Booking Confirmed!
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-7 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-9 text-center"
        >
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-emerald-500 text-3xl" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
            Visit Scheduled Successfully
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed">
            Your site visit has been scheduled. Our executive will contact you shortly to confirm the details.
          </p>

          <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-5 mb-7 text-left flex flex-col gap-3">
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block uppercase tracking-wider">Project</span>
              <span className="text-sm font-extrabold text-slate-900">{visitDetails.projectName}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block uppercase tracking-wider">Preferred Date</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  {new Date(visitDetails.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block uppercase tracking-wider">Time Slot</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">{visitDetails.timeSlot}</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block uppercase tracking-wider">Pickup Location</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">{visitDetails.pickupLocation}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            For instant confirmation, please share this booking with our support team:
          </p>

          <a
            href={`https://wa.me/${config.supportWhatsapp}?text=Hi! I have booked a site visit for project "${visitDetails.projectName}" on ${visitDetails.date} at ${visitDetails.timeSlot}. Please confirm.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-white transition-all no-underline shadow-xs border-0"
          >
            <FaWhatsapp className="text-lg" /> Confirm via WhatsApp
          </a>

          <button
            onClick={() => { setSuccess(false); setVisitDetails(null); }}
            className="bg-transparent border-0 text-indigo-600 hover:text-indigo-800 font-semibold text-xs sm:text-sm mt-5 cursor-pointer inline-flex items-center gap-1 transition-colors"
          >
            <LuArrowLeft /> Book Another Visit
          </button>
        </motion.div>
      </div>
    </div>
  );
}
