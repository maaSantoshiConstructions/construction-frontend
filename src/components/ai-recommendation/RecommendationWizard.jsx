import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuCheck, LuArrowLeft, LuArrowRight, LuShieldCheck,
  LuMapPin, LuHouse, LuBuilding, LuBuilding2,
  LuLandmark, LuCrown, LuStore, LuTrendingUp,
  LuUserCheck, LuSparkles, LuTrees
} from 'react-icons/lu';

const steps = [
  { id: 1, title: 'Budget', description: 'What is your budget range?' },
  { id: 2, title: 'Location', description: 'Preferred location or city' },
  { id: 3, title: 'Property Type', description: 'Type of property you need' },
  { id: 4, title: 'Purpose', description: 'Purpose of purchase' },
];

const budgetRanges = [
  { label: 'Under ₹10 Lakhs', value: '0-1000000', icon: LuHouse, desc: 'Affordable plots to get started' },
  { label: '₹10 – ₹25 Lakhs', value: '1000000-2500000', icon: LuBuilding, desc: 'Value residential plots' },
  { label: '₹25 – ₹40 Lakhs', value: '2500000-4000000', icon: LuBuilding2, desc: 'Mid-range premium options' },
  { label: '₹40 – ₹60 Lakhs', value: '4000000-6000000', icon: LuLandmark, desc: 'Premium investment plots' },
  { label: 'Above ₹60 Lakhs', value: '6000000+', icon: LuCrown, desc: 'Luxury & investment-grade land' },
];

const locations = [
  { name: 'Bhubaneswar', desc: 'Capital city — top appreciation', icon: LuMapPin },
  { name: 'Cuttack', desc: 'Historic city — growing fast', icon: LuMapPin },
  { name: 'Puri', desc: 'Coastal town — tourism hub', icon: LuMapPin },
  { name: 'Khordha', desc: 'Emerging corridor — great value', icon: LuMapPin },
];

const propertyTypes = [
  { name: 'Plotted Development', desc: 'Residential plots & land', icon: LuTrees },
  { name: 'Villas', desc: 'Premium villa projects', icon: LuHouse },
  { name: 'Apartments', desc: 'Flat & apartment units', icon: LuBuilding2 },
  { name: 'Commercial', desc: 'Shops, offices & more', icon: LuStore },
];

const purposes = [
  { name: 'Investment', desc: 'High future value appreciation', icon: LuTrendingUp },
  { name: 'Self Use', desc: 'Build your own home or office', icon: LuUserCheck },
  { name: 'Both', desc: 'Utility + investment growth', icon: LuSparkles },
];

export default function RecommendationWizard({
  step,
  formData,
  updateField,
  getFieldForStep,
  handleBack,
  handleNext,
  loading,
}) {
  return (
    <div className="bg-[#f7f7fb] min-h-screen pb-[90px]">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-center py-14 sm:py-16 px-4 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-white/10 text-amber-400 border border-white/10">
            AI PROPERTY FINDER
          </span>
          <h1 className="font-['Poppins',sans-serif] text-2xl sm:text-4xl font-extrabold text-white my-3">
            Find Your Perfect Plot
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Answer 4 quick questions and our intelligent engine will match you with the best available plots.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 -mt-7 relative z-10">
        <div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5 sm:p-9">
            {/* Stepper */}
            <div className="flex items-center mb-7">
              {steps.map((s) => (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold transition-all ${
                      step > s.id
                        ? 'bg-emerald-500 text-white'
                        : step === s.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {step > s.id ? <LuCheck size={14} /> : s.id}
                  </div>
                  <span className={`hidden sm:inline text-xs font-semibold ml-2.5 whitespace-nowrap ${step >= s.id ? 'text-slate-800' : 'text-slate-400'}`}>
                    {s.title}
                  </span>
                  {s.id < 4 && (
                    <div className={`flex-1 h-0.5 sm:h-0.75 mx-1.5 sm:mx-3 rounded-full transition-all ${step > s.id ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-4">
              Step {step} of 4
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {step === 1 && (
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">What's your budget?</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mb-6">Select the range that works best for you.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {budgetRanges.map((r) => {
                        const Icon = r.icon;
                        const isSelected = formData.budget === r.value;
                        return (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => updateField('budget', r.value)}
                            className={`w-full p-4 rounded-xl border-2 text-center cursor-pointer transition-all outline-none flex flex-col items-center justify-center ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:-translate-y-0.5'
                            }`}
                          >
                            <Icon size={24} className={`mb-2 transition-colors ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                            <span className={`text-sm font-semibold transition-colors ${isSelected ? 'text-indigo-700 font-bold' : 'text-slate-800'}`}>
                              {r.label}
                            </span>
                            <span className="text-[11.5px] text-slate-500 font-normal mt-0.5">{r.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">Preferred Location</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mb-6">Where are you looking to buy or invest?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {locations.map((loc) => {
                        const Icon = loc.icon;
                        const isSelected = formData.location === loc.name;
                        return (
                          <button
                            key={loc.name}
                            type="button"
                            onClick={() => updateField('location', loc.name)}
                            className={`w-full p-4 rounded-xl border-2 text-center cursor-pointer transition-all outline-none flex flex-col items-center justify-center ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:-translate-y-0.5'
                            }`}
                          >
                            <Icon size={22} className={`mb-2 transition-colors ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                            <span className={`text-sm font-semibold transition-colors ${isSelected ? 'text-indigo-700 font-bold' : 'text-slate-800'}`}>
                              {loc.name}
                            </span>
                            <span className="text-[11.5px] text-slate-500 font-normal mt-0.5">{loc.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">Property Type</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mb-6">What kind of property are you looking for?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {propertyTypes.map((t) => {
                        const Icon = t.icon;
                        const isSelected = formData.propertyType === t.name;
                        return (
                          <button
                            key={t.name}
                            type="button"
                            onClick={() => updateField('propertyType', t.name)}
                            className={`w-full p-4 rounded-xl border-2 text-center cursor-pointer transition-all outline-none flex flex-col items-center justify-center ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:-translate-y-0.5'
                            }`}
                          >
                            <Icon size={22} className={`mb-2 transition-colors ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                            <span className={`text-sm font-semibold transition-colors ${isSelected ? 'text-indigo-700 font-bold' : 'text-slate-800'}`}>
                              {t.name}
                            </span>
                            <span className="text-[11.5px] text-slate-500 font-normal mt-0.5">{t.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">Purpose of Purchase</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mb-6">What's your primary goal?</p>
                    <div className="flex flex-col gap-2.5">
                      {purposes.map((p) => {
                        const Icon = p.icon;
                        const isSelected = formData.purpose === p.name;
                        return (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => updateField('purpose', p.name)}
                            className={`w-full p-4 rounded-xl border-2 flex items-center gap-3.5 cursor-pointer transition-all outline-none text-left ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:-translate-y-0.5'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-base transition-colors ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              <Icon size={18} />
                            </div>
                            <div>
                              <span className={`text-sm font-semibold block transition-colors ${isSelected ? 'text-indigo-700 font-bold' : 'text-slate-800'}`}>
                                {p.name}
                              </span>
                              <span className="text-xs text-slate-500 font-normal">{p.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center justify-between mt-8">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className={`px-4 sm:px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs sm:text-sm font-semibold flex items-center gap-1.5 outline-none transition-all ${
                  step === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:border-slate-300 hover:text-slate-900 cursor-pointer'
                }`}
              >
                <LuArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className={`px-5 sm:px-7 py-2.5 rounded-xl border-none bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all shadow-xs ${
                  !formData[getFieldForStep(step)] ? 'opacity-60' : ''
                }`}
              >
                {step === 4 ? (
                  <>Get Recommendations <LuArrowRight size={16} /></>
                ) : (
                  <>Continue <LuArrowRight size={16} /></>
                )}
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1.5">
            <LuShieldCheck size={14} className="text-emerald-500" /> Your preferences are secure and never shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
