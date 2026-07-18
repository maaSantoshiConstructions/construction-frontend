import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

export default function CRMWorkflow() {
  const stepsList = [
    'Visitor submits a booking form or inquiries on website.',
    'The system auto-records details directly in CRM dashboard.',
    'Instant alerts are sent straight to coordinates via WhatsApp.',
    'Immediate brochures are sent to the visitor via automation.',
    'Team can instantly chat with customers via single interface.',
  ];

  const benefitsList = [
    { label: 'Unchecked Lead Leakage', before: '35% Loss', after: '< 2% Loss' },
    { label: 'Average Response Time', before: '5 Hours', after: '< 2 Mins' },
    { label: 'Conversion Performance', before: '10% Avg', after: '32% High' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm"
      >
        <h3 className="text-sm font-bold text-slate-800 mb-5 font-poppins">
          How It Works
        </h3>
        <ol className="flex flex-col gap-4">
          {stepsList.map((step, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-poppins">
                {i + 1}
              </span>
              <span className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">{step}</span>
            </li>
          ))}
        </ol>
      </motion.div>

      {/* Key Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm"
      >
        <h3 className="text-sm font-bold text-slate-800 mb-5 font-poppins">
          CRM Key Benefits
        </h3>
        <div className="flex flex-col gap-3">
          {benefitsList.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <div>
                <span className="block text-xs font-bold text-slate-800 font-poppins">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-semibold">
                <span className="text-slate-400 line-through">{item.before}</span>
                <FaArrowRight className="text-slate-300 text-[9px]" />
                <span className="text-emerald-500 font-extrabold text-xs md:text-sm">{item.after}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
