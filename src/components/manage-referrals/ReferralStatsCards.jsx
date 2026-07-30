import React from 'react';
import { motion } from 'framer-motion';
import { LuGift, LuCircleCheck, LuAward } from 'react-icons/lu';

export default function ReferralStatsCards({ totalCount = 0, convertedCount = 0, paidCount = 0 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
          <LuGift size={22} />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Referrals</p>
          <p className="text-2xl font-extrabold text-slate-900">{totalCount}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
          <LuCircleCheck size={22} />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Converted Bookings</p>
          <p className="text-2xl font-extrabold text-slate-900">{convertedCount}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-xl">
          <LuAward size={22} />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Rewards Paid Out</p>
          <p className="text-2xl font-extrabold text-slate-900">{paidCount}</p>
        </div>
      </motion.div>
    </div>
  );
}
