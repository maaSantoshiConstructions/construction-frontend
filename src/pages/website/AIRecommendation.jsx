import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { createRecommendation } from '../../api/aiRecommendations';
import { FaArrowRight, FaRupeeSign, FaMapMarkerAlt, FaHome, FaStar, FaBuilding, FaCheckCircle, FaPhone } from 'react-icons/fa';

const steps = [
  { id: 1, title: 'Budget', description: 'What is your budget range?' },
  { id: 2, title: 'Location', description: 'Preferred location or city' },
  { id: 3, title: 'Property Type', description: 'Type of property you need' },
  { id: 4, title: 'Purpose', description: 'Purpose of purchase' },
];

const recommendations = [
  {
    id: 1,
    name: 'Green Valley Estate',
    location: 'Sector 45, Gurugram',
    price: 3500000,
    size: 1200,
    score: 95,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
    reason: 'Excellent match for your budget and location preference',
  },
  {
    id: 2,
    name: 'Lakeview Residency',
    location: 'Whitefield, Bangalore',
    price: 5200000,
    size: 1500,
    score: 88,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
    reason: 'Premium location with high growth potential',
  },
  {
    id: 3,
    name: 'Golden Palm Enclave',
    location: 'Gachibowli, Hyderabad',
    price: 2800000,
    size: 1000,
    score: 82,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
    reason: 'Affordable option in a developing area',
  },
  {
    id: 4,
    name: 'Royal Palm Gardens',
    location: 'Sector 62, Noida',
    price: 4500000,
    size: 1350,
    score: 78,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600',
    reason: 'Well-connected location with good amenities',
  },
  {
    id: 5,
    name: 'Serene Meadows',
    location: 'Hinjewadi, Pune',
    price: 3800000,
    size: 1100,
    score: 72,
    image: 'https://images.unsplash.com/photo-1600566753086-00f18f6b7d0a?w=600',
    reason: 'Upcoming IT hub with great appreciation potential',
  },
];

export default function AIRecommendation() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    budget: '',
    location: '',
    propertyType: '',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (!formData[getFieldForStep(step)]) {
      toast.error('Please fill in the required field');
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const getFieldForStep = (s) => {
    const map = { 1: 'budget', 2: 'location', 3: 'propertyType', 4: 'purpose' };
    return map[s];
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await createRecommendation(formData);
      const apiResults = data?.data;
      if (apiResults && apiResults.length > 0) {
        setResults(apiResults.map((r, i) => ({
          id: i + 1,
          name: r.name || r.projectName || 'Recommended Plot',
          location: r.location || 'Bhubaneswar, Odisha',
          price: r.price || 3500000,
          size: r.size || 1200,
          score: r.score || 85,
          image: `https://images.unsplash.com/photo-${1600585154526 + i * 1000}-990dced4db0d?w=600`,
          reason: r.reason || 'Great match based on your preferences',
        })));
      } else {
        setResults(recommendations);
      }
    } catch {
      setResults(recommendations);
    } finally {
      setLoading(false);
    }
  };

  const budgetRanges = [
    { label: 'Under ₹20 Lakhs', value: '0-2000000' },
    { label: '₹20 - ₹40 Lakhs', value: '2000000-4000000' },
    { label: '₹40 - ₹60 Lakhs', value: '4000000-6000000' },
    { label: '₹60 - ₹1 Crore', value: '6000000-10000000' },
    { label: 'Above ₹1 Crore', value: '10000000+' },
  ];

  const locations = ['Gurugram', 'Bangalore', 'Hyderabad', 'Noida', 'Pune', 'Mumbai', 'Chennai', 'Kolkata'];
  const propertyTypes = ['Residential Plot', 'Commercial Plot', 'Villa', 'Farm Land'];
  const purposes = ['Investment', 'Self Use', 'Both'];

  const formatCurrency = (val) => '₹ ' + val.toLocaleString('en-IN');

  if (results) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold text-white mb-2">Your AI Recommendations</h1>
              <p className="text-blue-100">Top matching plots based on your preferences</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="text-slate-400">Your preferences:</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">{budgetRanges.find((b) => b.value === formData.budget)?.label}</span>
              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full font-medium">{formData.location}</span>
              <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full font-medium">{formData.propertyType}</span>
              <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full font-medium">{formData.purpose}</span>
            </div>
          </motion.div>

          <div className="space-y-4">
            {results.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0">
                    <img src={rec.image} alt={rec.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-5 sm:p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{rec.name}</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><FaMapMarkerAlt /> {rec.location}</p>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 rounded-lg">
                        <FaStar className="text-yellow-500 text-xs" />
                        <span className="font-bold text-green-600 text-sm">{rec.score}%</span>
                        <span className="text-xs text-green-500">Match</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">{rec.reason}</p>
                    <div className="flex items-center gap-4 text-sm mb-4">
                      <span className="text-blue-600 font-bold">{formatCurrency(rec.price)}</span>
                      <span className="text-slate-400">|</span>
                      <span className="text-slate-600">{rec.size} sq ft</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link to={`/projects/green-valley-estate`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1">
                        Book This Plot <FaArrowRight className="text-xs" />
                      </Link>
                      <a href="tel:+919876543210" className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium rounded-lg transition-colors flex items-center gap-1">
                        <FaPhone /> Contact Sales
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => { setResults(null); setStep(1); setFormData({ budget: '', location: '', propertyType: '', purpose: '' }); }}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FaStar className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">AI Recommendation</h1>
            <p className="text-blue-100">Answer a few questions and let our AI find the perfect plot for you</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {step > s.id ? <FaCheckCircle /> : s.id}
                </div>
                {s.id < 4 && <div className={`w-8 sm:w-16 h-1 mx-1 rounded transition-colors ${step > s.id ? 'bg-blue-600' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">What is your budget?</h2>
                  <p className="text-sm text-slate-500 mb-6">Select your budget range for the plot</p>
                  <div className="space-y-3">
                    {budgetRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => updateField('budget', range.value)}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${formData.budget === range.value ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-300'}`}
                      >
                        <span className="font-medium text-slate-800">{range.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">Preferred Location</h2>
                  <p className="text-sm text-slate-500 mb-6">Where are you looking to buy?</p>
                  <div className="grid grid-cols-2 gap-3">
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => updateField('location', loc)}
                        className={`p-4 rounded-xl border text-center transition-all ${formData.location === loc ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-300'}`}
                      >
                        <FaMapMarkerAlt className={`mx-auto mb-1 ${formData.location === loc ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="font-medium text-slate-800 text-sm">{loc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">Property Type</h2>
                  <p className="text-sm text-slate-500 mb-6">What type of property are you looking for?</p>
                  <div className="grid grid-cols-2 gap-3">
                    {propertyTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => updateField('propertyType', type)}
                        className={`p-4 rounded-xl border text-center transition-all ${formData.propertyType === type ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-300'}`}
                      >
                        <FaHome className={`mx-auto mb-1 ${formData.propertyType === type ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="font-medium text-slate-800 text-sm">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">Purpose of Purchase</h2>
                  <p className="text-sm text-slate-500 mb-6">What is your primary goal?</p>
                  <div className="space-y-3">
                    {purposes.map((purpose) => (
                      <button
                        key={purpose}
                        onClick={() => updateField('purpose', purpose)}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${formData.purpose === purpose ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-300'}`}
                      >
                        <span className="font-medium text-slate-800">{purpose}</span>
                        <p className="text-xs text-slate-500 mt-1">
                          {purpose === 'Investment' && 'Looking for long-term value appreciation'}
                          {purpose === 'Self Use' && 'Planning to build your dream home'}
                          {purpose === 'Both' && 'Want to use and also benefit from appreciation'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</>
              ) : step === 4 ? (
                <>Get Recommendations <FaArrowRight /></>
              ) : (
                <>Next <FaArrowRight /></>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
