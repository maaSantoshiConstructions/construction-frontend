import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCompass, FaSun, FaWind, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const directions = [
  {
    id: 'north', label: 'North Facing', icon: 'N', score: 92, vastu: 'Excellent',
    benefits: ['Ideal for all purposes', 'Good sunlight throughout day', 'Best for investment', 'Positive energy flow'],
    color: 'emerald',
  },
  {
    id: 'east', label: 'East Facing', icon: 'E', score: 88, vastu: 'Very Good',
    benefits: ['Morning sunlight', 'Vastu compliant', 'Good ventilation', 'Sacred direction'],
    color: 'blue',
  },
  {
    id: 'north-east', label: 'North-East Facing', icon: 'NE', score: 95, vastu: 'Excellent',
    benefits: ['Most auspicious', 'Maximum sunlight', 'Ideal for residential', 'Best Vastu score'],
    color: 'emerald',
  },
  {
    id: 'south', label: 'South Facing', icon: 'S', score: 70, vastu: 'Good',
    benefits: ['Good for commercial', 'Consistent temperature', 'Energy efficient', 'Affordable pricing'],
    color: 'amber',
  },
  {
    id: 'west', label: 'West Facing', icon: 'W', score: 75, vastu: 'Good',
    benefits: ['Evening sunlight', 'Good resale value', 'Wide availability', 'Modern layouts'],
    color: 'amber',
  },
  {
    id: 'south-east', label: 'South-East Facing', icon: 'SE', score: 65, vastu: 'Average',
    benefits: ['Warm afternoon light', 'Good for kitchens', 'Energy efficient', 'Value for money'],
    color: 'orange',
  },
  {
    id: 'south-west', label: 'South-West Facing', icon: 'SW', score: 68, vastu: 'Average',
    benefits: ['Stable temperature', 'Good for master bedroom', 'Privacy', 'Less direct heat'],
    color: 'orange',
  },
  {
    id: 'north-west', label: 'North-West Facing', icon: 'NW', score: 72, vastu: 'Good',
    benefits: ['Balanced light', 'Good ventilation', 'Practical layout', 'Moderate pricing'],
    color: 'amber',
  },
];

const ScoreCircle = ({ score }) => (
  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg ${
    score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-500' : 'bg-orange-500'
  }`}>
    {score}
  </div>
);

export default function PlotDirectionAnalyzer() {
  const [selected, setSelected] = useState(directions[0]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FaCompass className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Plot Direction Analyzer</h1>
            <p className="text-emerald-100">Vastu-compliant plot analysis for your perfect home</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-6 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Select a Direction</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {directions.map((dir) => (
              <button
                key={dir.id}
                onClick={() => setSelected(dir)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selected.id === dir.id ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="text-lg font-bold text-slate-700">{dir.icon}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{dir.label.split(' ')[0]}</div>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div key={selected.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-4 mb-4">
                <ScoreCircle score={selected.score} />
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selected.label}</h3>
                  <p className={`text-sm font-medium ${
                    selected.score >= 85 ? 'text-emerald-600' : selected.score >= 70 ? 'text-amber-600' : 'text-orange-600'
                  }`}>Vastu: {selected.vastu}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {selected.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-slate-50 rounded-xl p-6">
                <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><FaSun className="text-amber-500" /> Sunlight & Environment Analysis</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-slate-600">Morning Sunlight (6-10 AM)</span>
                    <span className={`font-medium ${['east', 'north-east', 'north'].includes(selected.id) ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {['east', 'north-east', 'north'].includes(selected.id) ? 'Excellent' : 'Moderate'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-slate-600">Afternoon Sun (12-4 PM)</span>
                    <span className={`font-medium ${['south', 'south-east', 'south-west'].includes(selected.id) ? 'text-amber-600' : 'text-slate-400'}`}>
                      {['south', 'south-east', 'south-west'].includes(selected.id) ? 'High' : 'Low'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-slate-600">Wind Flow</span>
                    <span className={`font-medium ${['north', 'north-east', 'north-west'].includes(selected.id) ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {['north', 'north-east', 'north-west'].includes(selected.id) ? 'Good' : 'Average'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-slate-600">Vastu Compliance</span>
                    <span className={`font-medium ${selected.score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {selected.score >= 80 ? 'Highly Compliant' : 'Moderately Compliant'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 flex items-start gap-2">
                <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                <span>For personalized Vastu analysis of your specific plot, contact our Vastu consultant who can provide detailed guidance based on exact plot dimensions and surrounding structures.</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {directions.map((dir) => (
            <div key={dir.id} className="bg-white rounded-xl p-3 border border-slate-100 text-center">
              <p className="text-xs text-slate-500">{dir.label}</p>
              <p className={`text-lg font-bold ${dir.score >= 85 ? 'text-emerald-600' : dir.score >= 70 ? 'text-amber-600' : 'text-orange-600'}`}>
                {dir.score}/100
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
