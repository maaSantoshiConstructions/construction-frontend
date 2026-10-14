import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { LuRotateCcw, LuChartPie } from 'react-icons/lu';

// Subcomponents & Hooks
import useEMICalculator from '../../hooks/useEMICalculator';
import EMIInputs from './emi/EMIInputs';
import EMIResultsCard from './emi/EMIResultsCard';
import AmortizationScheduleTable from './emi/AmortizationScheduleTable';
import {
  LOAN_MIN,
  LOAN_MAX,
  LOAN_STEP,
  RATE_MIN,
  RATE_MAX,
  RATE_STEP,
  TENURE_MIN,
  TENURE_MAX,
} from '../../utils/emiHelpers';

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

export default function EMICalculator() {
  const {
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
    handleReset,

    calculationResults,
    chartData,
    chartOptions,
    principalPct,
    interestPct,

    showSchedule,
    setShowSchedule,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedMonthlySchedule,
    yearlySchedule,

    formatIndianCurrency,
  } = useEMICalculator();

  return (
    <div className="bg-white rounded-2xl border border-[var(--line,#e6e6f0)] shadow-sm p-6 sm:p-9 transition-all">
      {/* Header with Title & Reset Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 font-['Poppins',sans-serif]">
          <LuChartPie size={22} className="text-green-700 shrink-0" /> Home Loan EMI Calculator
        </h2>
        <button
          type="button"
          onClick={handleReset}
          aria-label="Reset Calculator inputs to default"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-[#f7f7fb] hover:bg-[#eeeef7] hover:border-green-600 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
        >
          <LuRotateCcw size={14} className="text-green-700" /> Reset Calculator
        </button>
      </div>

      {/* Main Grid: Inputs vs Summary & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-9">
        {/* Left Column: Interactive Inputs Subcomponent */}
        <EMIInputs
          loanAmount={loanAmount}
          loanInputStr={loanInputStr}
          isLoanFocused={isLoanFocused}
          handleLoanSliderChange={handleLoanSliderChange}
          handleLoanInputChange={handleLoanInputChange}
          handleLoanFocus={handleLoanFocus}
          handleLoanBlur={handleLoanBlur}
          interestRate={interestRate}
          rateInputStr={rateInputStr}
          handleRateSliderChange={handleRateSliderChange}
          handleRateInputChange={handleRateInputChange}
          handleRateBlur={handleRateBlur}
          tenureYears={tenureYears}
          tenureInputStr={tenureInputStr}
          handleTenureSliderChange={handleTenureSliderChange}
          handleTenureInputChange={handleTenureInputChange}
          handleTenureBlur={handleTenureBlur}
          errors={errors}
          formatIndianCurrency={formatIndianCurrency}
          calculationResults={calculationResults}
          LOAN_MIN={LOAN_MIN}
          LOAN_MAX={LOAN_MAX}
          LOAN_STEP={LOAN_STEP}
          RATE_MIN={RATE_MIN}
          RATE_MAX={RATE_MAX}
          RATE_STEP={RATE_STEP}
          TENURE_MIN={TENURE_MIN}
          TENURE_MAX={TENURE_MAX}
        />

        {/* Right Column: Results & Chart Subcomponent */}
        <EMIResultsCard
          tenureYears={tenureYears}
          calculationResults={calculationResults}
          formatIndianCurrency={formatIndianCurrency}
          chartData={chartData}
          chartOptions={chartOptions}
          principalPct={principalPct}
          interestPct={interestPct}
        />
      </div>

      {/* Amortization Schedule Table Subcomponent */}
      <AmortizationScheduleTable
        tenureYears={tenureYears}
        calculationResults={calculationResults}
        showSchedule={showSchedule}
        setShowSchedule={setShowSchedule}
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        paginatedMonthlySchedule={paginatedMonthlySchedule}
        yearlySchedule={yearlySchedule}
        formatIndianCurrency={formatIndianCurrency}
      />
    </div>
  );
}
