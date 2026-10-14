import React, { useState } from 'react';
import { LuTrendingUp } from 'react-icons/lu';

export default function InvestmentCalculator() {
  const [amount, setAmount] = useState(5000000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);

  const futureValue = amount * Math.pow(1 + rate / 100, years);
  const roi = ((futureValue - amount) / amount) * 100;
  const rentalYield = 3.5;

  const formatCurrency = (val) => '₹ ' + Math.round(val).toLocaleString('en-IN');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-9 transition-all">
      <h2 className="font-['Poppins',sans-serif] text-xl font-extrabold text-slate-900 mb-7 flex items-center gap-2">
        <LuTrendingUp size={22} className="text-green-700 shrink-0" /> Real Estate Appreciation &amp; Investment returns
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-9">

        {/* Sliders */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-800">Investment Amount</span>
              <span className="text-xs sm:text-sm font-bold text-green-700">{formatCurrency(amount)}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={50000000}
              step={100000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-md appearance-none accent-green-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10.5px] text-slate-400 mt-1"><span>₹1 Lakh</span><span>₹5 Crore</span></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-800">Expected Appreciation (p.a.)</span>
              <span className="text-xs sm:text-sm font-bold text-green-700">{rate}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-md appearance-none accent-green-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10.5px] text-slate-400 mt-1"><span>1%</span><span>30%</span></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-800">Holding Tenure</span>
              <span className="text-xs sm:text-sm font-bold text-green-700">{years} Years</span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-md appearance-none accent-green-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10.5px] text-slate-400 mt-1"><span>1 Year</span><span>25 Years</span></div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-r from-[#2d6a2d] via-[#4a8c3f] to-[#3a7a2a] rounded-xl p-5.5 text-white shadow-lg shadow-green-950/10">
            <p className="text-xs text-green-100 uppercase font-bold tracking-wider">Estimated Future Value</p>
            <p className="text-3xl font-extrabold mt-1">{formatCurrency(futureValue)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f7f7fb] border border-slate-200 rounded-xl p-3.5 flex flex-col">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Wealth Gain</span>
              <span className="text-base font-extrabold text-emerald-600 mt-0.5">{formatCurrency(futureValue - amount)}</span>
            </div>
            <div className="bg-[#f7f7fb] border border-slate-200 rounded-xl p-3.5 flex flex-col">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">ROI (Percentage)</span>
              <span className="text-base font-extrabold text-green-700 mt-0.5">{roi.toFixed(1)}%</span>
            </div>
          </div>
          <div className="bg-[#f7f7fb] border border-slate-200 rounded-xl p-3.5 flex flex-col">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Estimated Rental Yield</span>
            <span className="text-base font-extrabold text-green-700 mt-0.5">{rentalYield}% p.a.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
