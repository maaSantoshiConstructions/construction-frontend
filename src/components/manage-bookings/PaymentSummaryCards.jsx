import React from 'react';
import {
  FaRupeeSign, FaCheckCircle, FaExclamationCircle, FaChartLine, FaCalendarAlt,
} from 'react-icons/fa';

import { fmt, fmtDate } from '../../utils/formatters';

const PAYMENT_STATUS_LABEL = {
  token_paid:     { label: 'Token Paid',     color: '#f59e0b' },
  partially_paid: { label: 'Partially Paid', color: '#f97316' },
  fully_paid:     { label: 'Fully Paid',     color: '#10b981' },
  refunded:       { label: 'Refunded',       color: '#6366f1' },
};

export default function PaymentSummaryCards({
  totalAmount = 0,
  paidAmount = 0,
  remainingAmount = 0,
  progressPercent = 0,
  lastPaymentDate = null,
  paymentStatus = 'token_paid',
}) {
  const status = PAYMENT_STATUS_LABEL[paymentStatus] || PAYMENT_STATUS_LABEL.token_paid;

  const cards = [
    {
      icon: <FaRupeeSign />,
      label: 'Total Amount',
      value: `₹${fmt(totalAmount)}`,
      sub: null,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-700',
      borderColor: 'border-green-200',
    },
    {
      icon: <FaCheckCircle />,
      label: 'Amount Paid',
      value: `₹${fmt(paidAmount)}`,
      sub: <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${status.color}1a`, color: status.color }}>{status.label}</span>,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
    },
    {
      icon: <FaExclamationCircle />,
      label: 'Outstanding',
      value: `₹${fmt(remainingAmount)}`,
      sub: null,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200',
    },
    {
      icon: <FaChartLine />,
      label: 'Payment Progress',
      value: `${progressPercent}%`,
      sub: (
        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5">
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{
              width: `${progressPercent}%`,
              backgroundColor:
                progressPercent >= 75 ? '#10b981' :
                progressPercent >= 25 ? '#f97316' : '#ef4444',
            }}
          />
        </div>
      ),
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
      borderColor: 'border-sky-200',
    },
    {
      icon: <FaCalendarAlt />,
      label: 'Last Payment',
      value: fmtDate(lastPaymentDate),
      sub: null,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      borderColor: 'border-violet-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-white rounded-2xl border ${card.borderColor} p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg} ${card.iconColor} text-sm`}>
            {card.icon}
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{card.label}</p>
          <p className="text-lg font-bold text-slate-800 leading-tight">{card.value}</p>
          {card.sub && <div>{card.sub}</div>}
        </div>
      ))}
    </div>
  );
}
