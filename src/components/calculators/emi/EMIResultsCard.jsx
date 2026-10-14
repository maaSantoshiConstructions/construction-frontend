import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { LuChartPie } from 'react-icons/lu';

export default function EMIResultsCard({
  tenureYears,
  calculationResults,
  formatIndianCurrency,
  chartData,
  chartOptions,
  principalPct,
  interestPct,
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Main EMI Highlight Card */}
      <div className="bg-gradient-to-r from-[#2d6a2d] via-[#4a8c3f] to-[#3a7a2a] rounded-xl p-6 text-white shadow-lg shadow-green-950/10">
        <p className="text-xs text-green-100 uppercase font-bold tracking-wide">
          Monthly EMI
        </p>
        <p className="text-3xl font-extrabold mt-1 mb-0.5">
          {formatIndianCurrency(calculationResults.monthlyEMI)}
        </p>
        <p className="text-xs text-green-100">
          Estimated monthly installment for {tenureYears} years
        </p>
      </div>

      {/* Secondary Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#f7f7fb] border border-slate-200 rounded-xl p-3.5 flex flex-col">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Principal Amount</span>
          <span className="text-base font-extrabold text-green-700 mt-0.5">
            {formatIndianCurrency(calculationResults.principal)}
          </span>
        </div>
        <div className="bg-[#f7f7fb] border border-slate-200 rounded-xl p-3.5 flex flex-col">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Total Interest</span>
          <span className="text-base font-extrabold text-amber-600 mt-0.5">
            {formatIndianCurrency(calculationResults.totalInterest)}
          </span>
        </div>
      </div>

      <div className="bg-[#f7f7fb] border border-slate-200 rounded-xl p-3.5 flex flex-col">
        <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Total Amount Payable</span>
        <span className="text-lg font-extrabold text-emerald-600 mt-0.5">
          {formatIndianCurrency(calculationResults.totalPayment)}
        </span>
      </div>

      {/* Doughnut Chart & Custom Legend */}
      <div className="bg-[#f7f7fb] border border-slate-200 rounded-xl p-5 mt-1">
        <div className="flex items-center gap-2 mb-3.5">
          <LuChartPie size={16} className="text-green-700" />
          <span className="text-xs font-bold text-slate-800">Loan Breakdown</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Doughnut Chart Container */}
          <div className="w-32 h-32 relative shrink-0 mx-auto">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-[10px] text-slate-400 font-semibold block">Ratio</span>
              <span className="text-xs font-extrabold text-slate-800">{principalPct}%</span>
            </div>
          </div>

          {/* Custom Legend */}
          <div className="flex-1 flex flex-col gap-2.5 min-w-[140px]">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-green-700 inline-block" />
                Principal ({principalPct}%)
              </span>
              <strong className="text-slate-900">{formatIndianCurrency(calculationResults.principal)}</strong>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                Interest ({interestPct}%)
              </span>
              <strong className="text-slate-900">{formatIndianCurrency(calculationResults.totalInterest)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
