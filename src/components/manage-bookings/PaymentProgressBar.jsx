import React from 'react';

export default function PaymentProgressBar({ paidAmount = 0, totalAmount = 0, showLabel = true, height = 'h-2' }) {
  const percent = totalAmount > 0 ? Math.min(100, Math.round((paidAmount / totalAmount) * 100)) : 0;

  const color =
    percent >= 100 ? '#10b981' :
    percent >= 75  ? '#22c55e' :
    percent >= 25  ? '#f97316' : '#ef4444';

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-200 rounded-full ${height} overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <p className="text-xs font-semibold mt-1" style={{ color }}>
          {percent}%
        </p>
      )}
    </div>
  );
}
