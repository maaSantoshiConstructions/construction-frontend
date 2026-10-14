import React from 'react';
import { motion } from 'framer-motion';
import { LuTrendingUp, LuTrendingDown, LuMinus } from 'react-icons/lu';

export default function StatsCard({ title, value, icon: Icon, color = 'blue', trend }) {
  const colorMap = {
    blue: 'bg-green-50 text-green-700',
    green: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    indigo: 'bg-green-50 text-green-700',
    teal: 'bg-teal-50 text-teal-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  const TrendIcon = trend > 0 ? LuTrendingUp : trend < 0 ? LuTrendingDown : LuMinus;
  const trendColor = trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-500' : 'text-slate-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[color] || colorMap.blue}`}>
          {Icon && <Icon className="text-lg" />}
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
            <TrendIcon className="text-xs" />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs font-semibold text-slate-500 mt-0.5">{title}</p>
    </motion.div>
  );
}
