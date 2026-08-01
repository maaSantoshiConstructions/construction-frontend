/**
 * Status Badge Styling Dictionaries & Label Maps
 * Shared across Admin & Customer Dashboards
 */

export const BOOKING_STATUS_COLORS = {
  active:    'bg-sky-100 text-sky-700 border border-sky-200',
  completed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border border-red-200',
};

export const PAYMENT_STATUS_COLORS = {
  token_paid:     'bg-amber-100 text-amber-700 border border-amber-200',
  partially_paid: 'bg-orange-100 text-orange-700 border border-orange-200',
  fully_paid:     'bg-emerald-100 text-emerald-700 border border-emerald-200',
  refunded:       'bg-violet-100 text-violet-700 border border-violet-200',
};

export const TXSTATUS_COLORS = {
  success:   'bg-emerald-100 text-emerald-700 border border-emerald-200',
  cancelled: 'bg-slate-100 text-slate-500 border border-slate-200',
  refunded:  'bg-violet-100 text-violet-700 border border-violet-200',
};

export const TYPE_COLORS = {
  token:             'bg-indigo-100 text-indigo-700',
  installment:       'bg-sky-100 text-sky-700',
  final_payment:     'bg-emerald-100 text-emerald-700',
  loan_disbursement: 'bg-teal-100 text-teal-700',
  refund:            'bg-violet-100 text-violet-700',
};

export const TYPE_LABELS = {
  token:             'Token',
  installment:       'Installment',
  final_payment:     'Final Payment',
  loan_disbursement: 'Loan Disbursement',
  refund:            'Refund',
};

export const PLAN_LABELS = {
  full_payment: 'Full Payment',
  installment:  'Installment Plan',
  loan:         'Bank Loan',
};
