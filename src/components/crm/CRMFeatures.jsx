import React from 'react';
import { FaRobot, FaBell, FaUsers } from 'react-icons/fa';

export default function CRMFeatures() {
  const featuresList = [
    { icon: FaRobot, label: 'Auto Replies', desc: 'Instant WhatsApp responses for user queries 24/7' },
    { icon: FaBell, label: 'Instant Alerts', desc: 'Every booking & inquiry notified instantly to you' },
    { icon: FaUsers, label: 'Shared Team Inbox', desc: 'Collaborative inbox for sales team assignments' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {featuresList.map((item, i) => (
        <div
          key={i}
          className="p-5 bg-slate-50 border border-slate-200 rounded-xl"
        >
          <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center mb-4">
            <item.icon className="text-lg" />
          </div>
          <h3 className="text-slate-800 text-sm font-bold mb-1.5 font-poppins">
            {item.label}
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed m-0">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
