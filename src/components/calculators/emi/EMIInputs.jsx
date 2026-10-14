import React from 'react';
import { LuCalendar, LuCircleAlert } from 'react-icons/lu';

export default function EMIInputs({
  loanAmount,
  loanInputStr,
  isLoanFocused,
  handleLoanSliderChange,
  handleLoanInputChange,
  handleLoanFocus,
  handleLoanBlur,
  interestRate,
  rateInputStr,
  handleRateSliderChange,
  handleRateInputChange,
  handleRateBlur,
  tenureYears,
  tenureInputStr,
  handleTenureSliderChange,
  handleTenureInputChange,
  handleTenureBlur,
  errors,
  formatIndianCurrency,
  calculationResults,
  LOAN_MIN,
  LOAN_MAX,
  LOAN_STEP,
  RATE_MIN,
  RATE_MAX,
  RATE_STEP,
  TENURE_MIN,
  TENURE_MAX,
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Loan Amount Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="loan-amount-input" className="text-xs font-semibold text-slate-800">
            Loan Amount (₹)
          </label>
          <input
            id="loan-amount-input"
            type="text"
            value={isLoanFocused ? loanInputStr : formatIndianCurrency(loanAmount)}
            onChange={handleLoanInputChange}
            onFocus={handleLoanFocus}
            onBlur={handleLoanBlur}
            aria-label="Loan Amount in Rupees"
            className={`w-36 text-right text-xs font-bold text-green-700 bg-[#f9f9fd] border rounded-lg px-2.5 py-1.5 outline-none transition-colors ${
              errors.loan ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-green-600'
            }`}
          />
        </div>
        <input
          type="range"
          min={LOAN_MIN}
          max={LOAN_MAX}
          step={LOAN_STEP}
          value={loanAmount}
          onChange={handleLoanSliderChange}
          aria-label="Loan Amount range slider"
          aria-valuemin={LOAN_MIN}
          aria-valuemax={LOAN_MAX}
          aria-valuenow={loanAmount}
          className="w-full h-1.5 bg-slate-200 rounded-md appearance-none accent-green-700 cursor-pointer"
        />
        <div className="flex justify-between text-[10.5px] text-slate-400 mt-1">
          <span>₹1 Lakh</span>
          <span>₹10 Crore</span>
        </div>
        {errors.loan && (
          <div className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
            <LuCircleAlert size={13} /> {errors.loan}
          </div>
        )}
      </div>

      {/* Interest Rate Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="interest-rate-input" className="text-xs font-semibold text-slate-800">
            Interest Rate (% p.a.)
          </label>
          <div className="flex items-center gap-1">
            <input
              id="interest-rate-input"
              type="number"
              step={RATE_STEP}
              min={RATE_MIN}
              max={RATE_MAX}
              value={rateInputStr}
              onChange={handleRateInputChange}
              onBlur={handleRateBlur}
              aria-label="Interest Rate per annum"
              className={`w-24 text-right text-xs font-bold text-green-700 bg-[#f9f9fd] border rounded-lg px-2.5 py-1.5 outline-none transition-colors ${
                errors.rate ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-green-600'
              }`}
            />
            <span className="text-xs font-bold text-slate-500">%</span>
          </div>
        </div>
        <input
          type="range"
          min={RATE_MIN}
          max={RATE_MAX}
          step={RATE_STEP}
          value={interestRate}
          onChange={handleRateSliderChange}
          aria-label="Interest rate range slider"
          aria-valuemin={RATE_MIN}
          aria-valuemax={RATE_MAX}
          aria-valuenow={interestRate}
          className="w-full h-1.5 bg-slate-200 rounded-md appearance-none accent-green-700 cursor-pointer"
        />
        <div className="flex justify-between text-[10.5px] text-slate-400 mt-1">
          <span>1%</span>
          <span>20%</span>
        </div>
        {errors.rate && (
          <div className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
            <LuCircleAlert size={13} /> {errors.rate}
          </div>
        )}
      </div>

      {/* Loan Tenure Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="tenure-years-input" className="text-xs font-semibold text-slate-800">
            Loan Tenure (Years)
          </label>
          <div className="flex items-center gap-1">
            <input
              id="tenure-years-input"
              type="number"
              min={TENURE_MIN}
              max={TENURE_MAX}
              step={1}
              value={tenureInputStr}
              onChange={handleTenureInputChange}
              onBlur={handleTenureBlur}
              aria-label="Loan Tenure in years"
              className={`w-24 text-right text-xs font-bold text-green-700 bg-[#f9f9fd] border rounded-lg px-2.5 py-1.5 outline-none transition-colors ${
                errors.tenure ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-green-600'
              }`}
            />
            <span className="text-xs font-bold text-slate-500">Yr</span>
          </div>
        </div>
        <input
          type="range"
          min={TENURE_MIN}
          max={TENURE_MAX}
          step={1}
          value={tenureYears}
          onChange={handleTenureSliderChange}
          aria-label="Loan Tenure range slider"
          aria-valuemin={TENURE_MIN}
          aria-valuemax={TENURE_MAX}
          aria-valuenow={tenureYears}
          className="w-full h-1.5 bg-slate-200 rounded-md appearance-none accent-green-700 cursor-pointer"
        />
        <div className="flex justify-between text-[10.5px] text-slate-400 mt-1">
          <span>1 Year</span>
          <span>30 Years</span>
        </div>
        {errors.tenure && (
          <div className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
            <LuCircleAlert size={13} /> {errors.tenure}
          </div>
        )}
      </div>

      {/* Quick Summary Banner */}
      <div className="bg-green-50/60 border border-green-100 rounded-xl p-4 flex items-center gap-3">
        <LuCalendar size={26} className="text-green-700 shrink-0" />
        <div className="text-xs text-slate-700 leading-relaxed">
          Total of <strong>{calculationResults.totalMonths} EMI payments</strong> over <strong>{tenureYears} years</strong>.
        </div>
      </div>
    </div>
  );
}
