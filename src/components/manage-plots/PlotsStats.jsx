import React from 'react';
import { motion } from 'framer-motion';
import { LuRuler, LuCircleCheck, LuLock, LuCheckCheck, LuBan } from 'react-icons/lu';

export default function PlotsStats({ stats }) {
  const cards = [
    {
      label: 'Total Plots',
      val: stats?.total || 0,
      border: 'bg-slate-400',
      iconBg: 'bg-slate-50 border-slate-200 text-slate-500',
      textCol: 'text-slate-800',
      icon: LuRuler,
      delay: 0,
    },
    {
      label: 'Available',
      val: stats?.available || 0,
      border: 'bg-emerald-500',
      iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
      textCol: 'text-emerald-600',
      icon: LuCircleCheck,
      delay: 0.05,
    },
    {
      label: 'Reserved',
      val: stats?.reserved || 0,
      border: 'bg-amber-500',
      iconBg: 'bg-amber-50 border-amber-200 text-amber-600',
      textCol: 'text-amber-600',
      icon: LuLock,
      delay: 0.1,
    },
    {
      label: 'Sold',
      val: stats?.sold || 0,
      border: 'bg-rose-500',
      iconBg: 'bg-rose-50 border-rose-200 text-rose-600',
      textCol: 'text-rose-600',
      icon: LuCheckCheck,
      delay: 0.15,
    },
    {
      label: 'Blocked',
      val: stats?.blocked || 0,
      border: 'bg-slate-500',
      iconBg: 'bg-slate-100 border-slate-200 text-slate-600',
      textCol: 'text-slate-700',
      icon: LuBan,
      delay: 0.2,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((c, idx) => {
        const IconComponent = c.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: c.delay }}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3 p-4 min-h-[72px] relative overflow-hidden hover:shadow-md transition-all"
          >
            <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${c.border}`} />
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center text-sm shrink-0 ${c.iconBg}`}
            >
              <IconComponent />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {c.label}
              </p>
              <h3 className={`text-xl sm:text-2xl font-extrabold leading-tight ${c.textCol}`}>
                {c.val}
              </h3>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
