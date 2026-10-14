import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

export default function RecommendationLoading({ analyzingStep }) {
  const steps = [
    'Scanning available plots...',
    'Analyzing location data...',
    'Calculating price matches...',
    'Ranking best options...',
  ];

  return (
    <div className="bg-[#f7f7fb] min-h-screen pb-[90px]">
      <div className="bg-white rounded-2xl p-9 sm:p-12 shadow-[0_20px_60px_rgba(20,20,60,0.1)] text-center max-w-[440px] w-[90%] my-20 sm:my-30 mx-auto">
        <motion.div
          className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-slate-200 border-t-green-700"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Finding Your Perfect Plot</h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-7 leading-relaxed">
          Our intelligent engine is analyzing hundreds of plots to match your preferences.
        </p>
        <div className="flex flex-col gap-2.5 text-left">
          {steps.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: analyzingStep >= i ? 1 : 0.35, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                analyzingStep >= i ? 'bg-green-50 text-green-700 font-bold' : 'bg-[#f7f7fb] text-slate-400'
              }`}
            >
              {analyzingStep > i ? (
                <FaCheckCircle className="text-emerald-500 text-sm shrink-0" />
              ) : analyzingStep === i ? (
                <motion.div
                  className="w-3.5 h-3.5 rounded-full border-2 border-green-600 border-t-transparent shrink-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 shrink-0" />
              )}
              {msg}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
