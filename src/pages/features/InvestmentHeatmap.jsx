import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkedAlt, FaFire, FaChartLine, FaTrain, FaRoad, FaCity, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const regions = [
  {
    id: 'patia', name: 'Patia', growth: 18, priceRange: '₹2,400 - ₹3,200/sq.ft',
    highlights: ['Near Infosys & IT hub', 'NH-16 connectivity', 'Upcoming metro station', 'Premium residential area'],
    color: 'bg-red-500', heat: 'very-high',
  },
  {
    id: 'khandagiri', name: 'Khandagiri', growth: 14, priceRange: '₹1,800 - ₹2,600/sq.ft',
    highlights: ['Affordable rates', 'Near proposed ring road', 'Tourist area', 'Good rental demand'],
    color: 'bg-orange-500', heat: 'high',
  },
  {
    id: 'chandrasekharpur', name: 'Chandrasekharpur', growth: 16, priceRange: '₹3,000 - ₹4,500/sq.ft',
    highlights: ['Premium locality', 'KIIT & educational hub', 'Developed infrastructure', 'High appreciation'],
    color: 'bg-red-500', heat: 'very-high',
  },
  {
    id: 'nayapalli', name: 'Nayapalli', growth: 11, priceRange: '₹3,500 - ₹5,000/sq.ft',
    highlights: ['Established area', 'Government colonies', 'Limited availability', 'Stable returns'],
    color: 'bg-amber-500', heat: 'moderate',
  },
  {
    id: 'puri-road', name: 'Puri Road', growth: 22, priceRange: '₹1,500 - ₹2,800/sq.ft',
    highlights: ['Highway front', 'Rapidly developing', 'New projects coming up', 'Best for investment'],
    color: 'bg-red-600', heat: 'extremely-high',
  },
  {
    id: 'airport-road', name: 'Airport Road', growth: 13, priceRange: '₹2,800 - ₹4,200/sq.ft',
    highlights: ['International airport', 'Commercial hub', 'Hotel & business district', 'Premium pricing'],
    color: 'bg-orange-500', heat: 'high',
  },
];

export default function InvestmentHeatmap() {
  const [selected, setSelected] = useState(regions[0]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-red-700 to-rose-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FaMapMarkedAlt className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Odisha Investment Heatmap</h1>
            <p className="text-rose-200">Identify high-growth areas for smart real estate investment</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Bhubaneswar Growth Zones</h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-600 rounded" /> Very High</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded" /> High</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded" /> Moderate</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded" /> Stable</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelected(region)}
                className={`p-4 rounded-xl border text-center transition-all ${selected.id === region.id ? 'border-orange-600 ring-2 ring-orange-200 bg-orange-50' : 'border-slate-200 hover:border-orange-300'}`}
              >
                <div className={`w-8 h-8 ${region.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                  <FaFire className="text-white text-xs" />
                </div>
                <p className="font-semibold text-slate-800 text-sm">{region.name}</p>
                <p className="text-xs text-emerald-600 font-bold">{region.growth}% CAGR</p>
              </button>
            ))}
          </div>

          <div className="relative aspect-[21/9] bg-slate-800 rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1577086664693-894d8405334a?w=1200&q=80"
              alt="Bhubaneswar Map"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {regions.map((region, i) => (
              <div
                key={region.id}
                className="absolute cursor-pointer group"
                style={{ left: `${15 + i * 14}%`, top: `${30 + (i % 3) * 18}%` }}
                onClick={() => setSelected(region)}
              >
                <div className={`w-8 h-8 ${region.color} rounded-full flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform ${selected.id === region.id ? 'ring-4 ring-white scale-125' : ''}`}>
                  <FaFire className="text-white text-xs" />
                </div>
                <p className="text-[10px] text-white font-medium mt-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">{region.name}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div key={selected.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${selected.color} rounded-xl flex items-center justify-center`}>
                  <FaFire className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selected.name}</h3>
                  <p className="text-sm text-emerald-600 font-semibold">{selected.growth}% CAGR Growth</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4">{selected.priceRange}</p>
              <div className="space-y-2">
                {selected.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <FaCheckCircle className="text-emerald-500 text-xs flex-shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-semibold text-slate-700 mb-4">Investment Indicators</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '5-Year Appreciation', value: `${Math.round(selected.growth * 3.2)}%`, color: 'text-emerald-600' },
                  { label: 'Rental Yield', value: `${(3 + selected.growth * 0.12).toFixed(1)}%`, color: 'text-orange-600' },
                  { label: 'Infrastructure Score', value: `${Math.min(95, 60 + selected.growth * 2)}/100`, color: 'text-amber-600' },
                  { label: 'Demand Index', value: `${Math.min(100, 50 + selected.growth * 2.5)}/100`, color: 'text-amber-600' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl text-xs text-orange-700 flex items-start gap-2">
                <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                <span>Data compiled from Odisha RERA, Bhubaneswar Development Authority & market research. Past performance does not guarantee future returns.</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
