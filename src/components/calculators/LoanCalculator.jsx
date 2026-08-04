import React, { useState } from 'react';
import { LuBadgePercent } from 'react-icons/lu';

export default function LoanCalculator() {
  const [income, setIncome] = useState(80000);
  const [existingEMI, setExistingEMI] = useState(0);
  const [age, setAge] = useState(30);
  const [tenure, setTenure] = useState(20);
  const [rate] = useState(8.5);

  const monthlyAvailable = income * 0.5 - existingEMI;
  const maxLoanAmount = monthlyAvailable * ((1 - Math.pow(1 + rate / 12 / 100, -tenure * 12)) / (rate / 12 / 100));
  const emi = monthlyAvailable;

  const formatCurrency = (val) => '₹ ' + Math.round(val).toLocaleString('en-IN');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-9 transition-all">
      <h2 className="font-['Poppins',sans-serif] text-xl font-extrabold text-slate-900 mb-7 flex items-center gap-2">
        <LuBadgePercent size={22} className="text-indigo-600 shrink-0" /> Plot &amp; Housing Loan Eligibility
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-9">

        {/* Sliders */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-800">Monthly Income</span>
              <span className="text-xs sm:text-sm font-bold text-indigo-700">{formatCurrency(income)}</span>
            </div>
            <input
              type="range"
              min={20000}
              max={500000}
              step={5000}
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-md appearance-none accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10.5px] text-slate-400 mt-1"><span>₹20k</span><span>₹5L</span></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-800">Existing Monthly EMIs</span>
              <span className="text-xs sm:text-sm font-bold text-indigo-700">{formatCurrency(existingEMI)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100000}
              step={1000}
              value={existingEMI}
              onChange={(e) => setExistingEMI(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-md appearance-none accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10.5px] text-slate-400 mt-1"><span>₹0</span><span>₹1L</span></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-800">Age of Applicant</span>
              <span className="text-xs sm:text-sm font-bold text-indigo-700">{age} Years</span>
            </div>
            <input
              type="range"
              min={21}
              max={60}
              step={1}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-md appearance-none accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10.5px] text-slate-400 mt-1"><span>21 yrs</span><span>60 yrs</span></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-800">Loan Tenure</span>
              <span className="text-xs sm:text-sm font-bold text-indigo-700">{tenure} Years</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-md appearance-none accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10.5px] text-slate-400 mt-1"><span>5 yrs</span><span>30 yrs</span></div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 rounded-xl p-5.5 text-white shadow-lg shadow-indigo-900/10">
            <p className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Maximum Loan Amount Eligible</p>
            <p className="text-3xl font-extrabold mt-1">{maxLoanAmount > 0 ? formatCurrency(maxLoanAmount) : '₹ 0'}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f7f7fb] border border-slate-200 rounded-xl p-3.5 flex flex-col">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Estimated Monthly EMI</span>
              <span className="text-base font-extrabold text-emerald-600 mt-0.5">{formatCurrency(emi > 0 ? emi : 0)}</span>
            </div>
            <div className="bg-[#f7f7fb] border border-slate-200 rounded-xl p-3.5 flex flex-col">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Expected Interest Rate</span>
              <span className="text-base font-extrabold text-indigo-700 mt-0.5">{rate}% p.a.</span>
            </div>
          </div>
          <div className="bg-[#f7f7fb] border border-slate-200 rounded-xl p-3.5 flex flex-col">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Monthly Cash Surplus</span>
            <span className="text-base font-extrabold text-indigo-700 mt-0.5">{formatCurrency(monthlyAvailable > 0 ? monthlyAvailable : 0)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
