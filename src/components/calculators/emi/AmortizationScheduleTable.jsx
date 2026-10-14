import React from 'react';
import { LuTable, LuChevronUp, LuChevronDown } from 'react-icons/lu';

export default function AmortizationScheduleTable({
  tenureYears,
  calculationResults,
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
}) {
  return (
    <div className="mt-9 border-t border-slate-200 pt-6">
      <button
        type="button"
        onClick={() => setShowSchedule(!showSchedule)}
        aria-expanded={showSchedule}
        className={`w-full flex items-center justify-between p-3.5 sm:p-4.5 rounded-xl border transition-all cursor-pointer ${
          showSchedule ? 'bg-green-50/50 border-green-200' : 'bg-[#f7f7fb] hover:bg-slate-100 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <LuTable size={18} className="text-green-700" />
          <span className="text-sm sm:text-base font-bold text-slate-800">
            Payment Amortization Schedule ({tenureYears} Years / {calculationResults.totalMonths} Months)
          </span>
        </div>
        {showSchedule ? <LuChevronUp size={20} className="text-green-700" /> : <LuChevronDown size={20} className="text-slate-400" />}
      </button>

      {showSchedule && (
        <div className="mt-4 bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
          {/* View Mode Toggle & Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setViewMode('monthly')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold cursor-pointer transition-all ${
                  viewMode === 'monthly' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Monthly Schedule
              </button>
              <button
                type="button"
                onClick={() => setViewMode('yearly')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold cursor-pointer transition-all ${
                  viewMode === 'yearly' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Yearly Summary
              </button>
            </div>

            {viewMode === 'monthly' && (
              <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
                <span className="text-slate-500">
                  Year {currentPage} of {totalPages} ({paginatedMonthlySchedule.length} Months)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold cursor-pointer"
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Amortization Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm text-left">
              <thead>
                <tr className="bg-[#f7f7fb] border-b-2 border-slate-200">
                  <th className="p-2.5 font-bold text-slate-800">
                    {viewMode === 'monthly' ? 'Month' : 'Year'}
                  </th>
                  <th className="p-2.5 font-bold text-slate-800">
                    {viewMode === 'monthly' ? 'Date' : 'Tenure Year'}
                  </th>
                  <th className="p-2.5 font-bold text-slate-800 text-right">EMI Amount</th>
                  <th className="p-2.5 font-bold text-green-700 text-right">Principal Component</th>
                  <th className="p-2.5 font-bold text-amber-600 text-right">Interest Component</th>
                  <th className="p-2.5 font-bold text-slate-800 text-right">Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {viewMode === 'monthly'
                  ? paginatedMonthlySchedule.map((row) => (
                      <tr key={row.monthNum} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-2.5 font-semibold text-slate-400">#{row.monthNum}</td>
                        <td className="p-2.5 font-semibold text-slate-700">{row.dateStr}</td>
                        <td className="p-2.5 text-right font-semibold text-slate-800">{formatIndianCurrency(row.emi)}</td>
                        <td className="p-2.5 text-right font-semibold text-green-700">
                          {formatIndianCurrency(row.principal)}
                        </td>
                        <td className="p-2.5 text-right font-semibold text-amber-600">
                          {formatIndianCurrency(row.interest)}
                        </td>
                        <td className="p-2.5 text-right font-bold text-slate-900">
                          {formatIndianCurrency(row.balance)}
                        </td>
                      </tr>
                    ))
                  : yearlySchedule.map((row) => (
                      <tr key={row.yearNum} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-2.5 font-bold text-green-700">Year {row.yearNum}</td>
                        <td className="p-2.5 text-slate-500">12 Months</td>
                        <td className="p-2.5 text-right font-semibold text-slate-800">{formatIndianCurrency(row.emi)}</td>
                        <td className="p-2.5 text-right font-semibold text-green-700">
                          {formatIndianCurrency(row.principal)}
                        </td>
                        <td className="p-2.5 text-right font-semibold text-amber-600">
                          {formatIndianCurrency(row.interest)}
                        </td>
                        <td className="p-2.5 text-right font-bold text-slate-900">
                          {formatIndianCurrency(row.balance)}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
}
