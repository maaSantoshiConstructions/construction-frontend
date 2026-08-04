import React, { useState } from 'react';
import { LuCalculator } from 'react-icons/lu';

export default function ConstructionCalculator() {
  const [plotSize, setPlotSize] = useState(1200);
  const [floors, setFloors] = useState(2);
  const [quality, setQuality] = useState('standard');

  const qualityRates = { basic: 1500, standard: 2200, premium: 3200 };
  const rate = qualityRates[quality];
  const builtUpArea = plotSize * 0.6 * floors;
  const constructionCost = builtUpArea * rate;
  const materialCost = constructionCost * 0.55;
  const laborCost = constructionCost * 0.25;
  const overheadCost = constructionCost * 0.1;
  const contingencyCost = constructionCost * 0.1;

  const formatCurrency = (val) => '₹ ' + Math.round(val).toLocaleString('en-IN');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-9 transition-all">
      <h2 className="font-['Poppins',sans-serif] text-xl font-extrabold text-slate-900 mb-7 flex items-center gap-2">
        <LuCalculator size={22} className="text-indigo-600 shrink-0" /> Built Construction Estimator
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-9">

        {/* Sliders & Quality Selection */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-800">Plot Area Size</span>
              <span className="text-xs sm:text-sm font-bold text-indigo-700">{plotSize} Sq.ft</span>
            </div>
            <input
              type="range"
              min={500}
              max={5000}
              step={50}
              value={plotSize}
              onChange={(e) => setPlotSize(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-md appearance-none accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10.5px] text-slate-400 mt-1">
              <span>500 Sq.ft</span>
              <span>5000 Sq.ft</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-800">Total Floors</span>
              <span className="text-xs sm:text-sm font-bold text-indigo-700">{floors} Floors</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={floors}
              onChange={(e) => setFloors(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-md appearance-none accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10.5px] text-slate-400 mt-1">
              <span>1 Floor</span>
              <span>5 Floors</span>
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-800 mb-2">Material Quality Selection</span>
            <div className="flex gap-2.5">
              {Object.entries(qualityRates).map(([key, val]) => {
                const isSelected = quality === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setQuality(key)}
                    className={`flex-1 p-3 rounded-xl border text-center cursor-pointer transition-all outline-none ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold capitalize">{key}</div>
                    <div className={`text-[10.5px] mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                      ₹{val}/Sq.ft
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 rounded-xl p-5.5 text-white shadow-lg shadow-indigo-900/10">
            <p className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Total Construction Cost</p>
            <p className="text-3xl font-extrabold mt-1">{formatCurrency(constructionCost)}</p>
            <p className="text-[11px] text-indigo-200 mt-1.5">
              Estimated Built-up area: {builtUpArea.toFixed(0)} Sq.ft (at 60% coverage)
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { label: 'Material Cost (55%)', value: materialCost, col: '#3a2fb8' },
              { label: 'Labor Cost (25%)', value: laborCost, col: '#2f9e5c' },
              { label: 'Overheads (10%)', value: overheadCost, col: '#d99f36' },
              { label: 'Contingency (10%)', value: contingencyCost, col: '#7d7aa3' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 px-3.5 rounded-lg bg-[#f7f7fb] border border-slate-100 text-xs sm:text-sm"
              >
                <span className="text-slate-500 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: item.col }} />
                  {item.label}
                </span>
                <span className="font-extrabold text-slate-800">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
