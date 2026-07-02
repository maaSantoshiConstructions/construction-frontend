import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaRupeeSign, FaHome, FaChartLine, FaCalculator, FaBuilding } from 'react-icons/fa';

const tabs = [
  { id: 'investment', label: 'Investment Return', icon: FaChartLine },
  { id: 'loan', label: 'Loan Eligibility', icon: FaCalculator },
  { id: 'construction', label: 'Construction Cost', icon: FaBuilding },
];

export default function Calculators() {
  const [activeTab, setActiveTab] = useState('investment');

  const tabsContent = {
    investment: <InvestmentCalculator />,
    loan: <LoanCalculator />,
    construction: <ConstructionCalculator />,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-orange-600 to-amber-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Calculators</h1>
            <p className="text-orange-100">Plan your investment with our smart tools</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-sm p-1 flex mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <tab.icon /> {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="pb-16"
        >
          {tabsContent[activeTab]}
        </motion.div>
      </div>
    </div>
  );
}

function InvestmentCalculator() {
  const [amount, setAmount] = useState(5000000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);

  const futureValue = amount * Math.pow(1 + rate / 100, years);
  const roi = ((futureValue - amount) / amount) * 100;
  const rentalYield = 3.5;

  const formatCurrency = (val) => '₹ ' + Math.round(val).toLocaleString('en-IN');

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Investment Return Calculator</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Investment Amount: <span className="text-orange-600 font-bold">{formatCurrency(amount)}</span></label>
            <input type="range" min={100000} max={50000000} step={100000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>₹1L</span><span>₹5Cr</span></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Expected Appreciation Rate: <span className="text-orange-600 font-bold">{rate}%</span></label>
            <input type="range" min={1} max={30} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>1%</span><span>30%</span></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tenure: <span className="text-orange-600 font-bold">{years} years</span></label>
            <input type="range" min={1} max={25} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>1 yr</span><span>25 yrs</span></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100">
            <p className="text-sm text-slate-500 mb-1">Future Value</p>
            <p className="text-3xl font-bold text-orange-600">{formatCurrency(futureValue)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100 text-center">
              <p className="text-sm text-slate-500">Total Returns</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(futureValue - amount)}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-center">
              <p className="text-sm text-slate-500">ROI</p>
              <p className="text-lg font-bold text-amber-600">{roi.toFixed(1)}%</p>
            </div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-center">
            <p className="text-sm text-slate-500">Estimated Rental Yield</p>
            <p className="text-lg font-bold text-amber-600">{rentalYield}% p.a.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoanCalculator() {
  const [income, setIncome] = useState(80000);
  const [existingEMI, setExistingEMI] = useState(0);
  const [age, setAge] = useState(30);
  const [tenure, setTenure] = useState(20);
  const [rate, setRate] = useState(8.5);

  const monthlyAvailable = income * 0.5 - existingEMI;
  const maxLoanAmount = monthlyAvailable * ((1 - Math.pow(1 + rate / 12 / 100, -tenure * 12)) / (rate / 12 / 100));
  const emi = monthlyAvailable;

  const formatCurrency = (val) => '₹ ' + Math.round(val).toLocaleString('en-IN');

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Loan Eligibility Calculator</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Income: <span className="text-orange-600 font-bold">{formatCurrency(income)}</span></label>
            <input type="range" min={20000} max={500000} step={5000} value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Existing EMI: <span className="text-orange-600 font-bold">{formatCurrency(existingEMI)}</span></label>
            <input type="range" min={0} max={100000} step={1000} value={existingEMI} onChange={(e) => setExistingEMI(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Age: <span className="text-orange-600 font-bold">{age} yrs</span></label>
            <input type="range" min={21} max={60} step={1} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Loan Tenure: <span className="text-orange-600 font-bold">{tenure} yrs</span></label>
            <input type="range" min={5} max={30} step={1} value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100">
            <p className="text-sm text-slate-500 mb-1">Maximum Loan Amount</p>
            <p className="text-3xl font-bold text-orange-600">{maxLoanAmount > 0 ? formatCurrency(maxLoanAmount) : '₹ 0'}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100 text-center">
              <p className="text-sm text-slate-500">Estimated EMI</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(emi)}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-center">
              <p className="text-sm text-slate-500">Interest Rate</p>
              <p className="text-lg font-bold text-amber-600">{rate}%</p>
            </div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-center">
            <p className="text-sm text-slate-500">Monthly Surplus</p>
            <p className="text-lg font-bold text-amber-600">{formatCurrency(monthlyAvailable)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConstructionCalculator() {
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
    <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Construction Cost Calculator</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Plot Size: <span className="text-orange-600 font-bold">{plotSize} sq ft</span></label>
            <input type="range" min={500} max={5000} step={50} value={plotSize} onChange={(e) => setPlotSize(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Floors: <span className="text-orange-600 font-bold">{floors}</span></label>
            <input type="range" min={1} max={5} step={1} value={floors} onChange={(e) => setFloors(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Quality</label>
            <div className="flex gap-3">
              {Object.entries(qualityRates).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setQuality(key)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all border ${quality === key ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'}`}
                >
                  {key}
                  <span className="block text-xs mt-0.5 opacity-75">₹{val}/sq ft</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100">
            <p className="text-sm text-slate-500 mb-1">Total Construction Cost</p>
            <p className="text-3xl font-bold text-orange-600">{formatCurrency(constructionCost)}</p>
            <p className="text-xs text-slate-400 mt-1">Built-up area: {builtUpArea.toFixed(0)} sq ft</p>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Material Cost', value: materialCost, color: 'bg-orange-500' },
              { label: 'Labor Cost', value: laborCost, color: 'bg-green-500' },
              { label: 'Overheads', value: overheadCost, color: 'bg-amber-500' },
              { label: 'Contingency', value: contingencyCost, color: 'bg-amber-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-slate-600">{item.label}</span>
                </div>
                <span className="font-medium text-slate-800">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
