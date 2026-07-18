import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaChartLine, FaClock } from 'react-icons/fa';

export default function FollowupStats() {
  const statsList = [
    { icon: FaUsers, label: 'Lead Capture Rate', value: '100%', sub: 'Zero lead leakage guaranteed' },
    { icon: FaChartLine, label: 'Conversion Rate', value: '35%', sub: 'vs Real estate avg: 12%' },
    { icon: FaClock, label: 'Average Response', value: '< 2 Mins', sub: 'Instant chatbot handover' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {statsList.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center"
        >
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <stat.icon className="text-base" />
          </div>
          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider m-0 font-poppins">
            {stat.label}
          </h4>
          <p className="text-2xl font-extrabold text-slate-800 my-1">
            {stat.value}
          </p>
          <p className="text-[10px] text-slate-400 font-medium m-0">
            {stat.sub}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
