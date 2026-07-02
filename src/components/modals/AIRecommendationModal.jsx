import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaMagic, FaCheckCircle } from 'react-icons/fa';

export default function AIRecommendationModal({ onClose, onBookVisit }) {
  const [budget, setBudget] = useState('40-60');
  const [location, setLocation] = useState('patia');
  const [type, setType] = useState('plot');
  const [purpose, setPurpose] = useState('invest');
  const [result, setResult] = useState(null);

  const runRecommendation = () => {
    let recommendation = '';
    let plotId = 'A-42';

    if (budget === '25-40' && location === 'khandagiri') {
      recommendation = `Based on your ₹25-40 Lakh budget and preference for Khandagiri area, we recommend <strong>Plot C-19 at Santoshi Greens</strong> (1800 sq.ft, South-East facing). Excellent investment with 14% projected appreciation.`;
      plotId = 'C-19';
    } else if (type === 'villa') {
      recommendation = `For your investment goals, our AI recommends <strong>Villa B-07 at Santoshi Villas</strong> (3200 sq.ft). Projected ROI of 172% over 10 years with strong rental potential.`;
      plotId = 'B-07';
    } else {
      recommendation = `Perfect match found: <strong>Plot A-42, Santoshi Enclave Phase-1</strong> (2400 sq.ft, North facing). Fits your budget perfectly. High demand location with metro connectivity planned nearby.`;
    }

    setResult({ text: recommendation, plotId });
  };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()}
        className="modal bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <div>
            <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">FEATURE 01</span>
            <span className="ml-3 font-bold text-xl text-slate-800">AI Property Recommendation System</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all text-xl leading-none">&times;</button>
        </div>
        <div className="p-8">
          <p className="text-slate-500 leading-relaxed">Answer a few simple questions. Our AI will instantly recommend the best-matching plot or villa and capture your details for personalized follow-up.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold tracking-wider text-slate-500">YOUR BUDGET</label>
              <select id="ai-budget" value={budget} onChange={(e) => setBudget(e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all">
                <option value="25-40">₹25 – 40 Lakh</option>
                <option value="40-60">₹40 – 60 Lakh</option>
                <option value="60-90">₹60 – 90 Lakh</option>
                <option value="90+">₹90 Lakh+</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold tracking-wider text-slate-500">PREFERRED LOCATION</label>
              <select id="ai-location" value={location} onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all">
                <option value="patia">Patia / Chandrasekharpur</option>
                <option value="khandagiri">Khandagiri / Jagamara</option>
                <option value="nayapalli">Nayapalli / IRC Village</option>
                <option value="any">Any location in Bhubaneswar</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold tracking-wider text-slate-500">PROPERTY TYPE</label>
              <div className="flex gap-2 mt-1.5">
                {['plot', 'villa', 'apartment'].map((t) => (
                  <label key={t} className="flex-1 cursor-pointer">
                    <input type="radio" name="ai-type" value={t} checked={type === t} onChange={() => setType(t)} className="peer hidden" />
                    <span className="block text-center border border-slate-200 peer-checked:border-blue-400 peer-checked:bg-blue-50 rounded-xl py-2 text-sm font-medium text-slate-600 peer-checked:text-blue-700 transition-all">{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold tracking-wider text-slate-500">PURPOSE</label>
              <select id="ai-purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all">
                <option value="self">Self-use / Living</option>
                <option value="invest">Investment</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <button onClick={runRecommendation}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 transition-all text-white font-semibold rounded-xl flex items-center justify-center gap-x-2 shadow-lg shadow-blue-500/20">
              <FaMagic />
              <span>GET MY PERSONALIZED RECOMMENDATION</span>
            </button>
          </div>
          {result && (
            <div className="mt-6 p-5 border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white rounded-2xl">
              <div className="font-bold flex items-center gap-x-2 text-emerald-700"><FaCheckCircle /> <span>AI MATCH FOUND</span></div>
              <div className="mt-3 text-sm text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: result.text }} />
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button onClick={onBookVisit} className="py-2.5 text-sm bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-500/20">BOOK THIS PLOT</button>
                <button onClick={() => { toast.success('A sales executive will call you within 10 minutes.'); }} className="py-2.5 text-sm border border-emerald-200 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all">TALK TO SALES EXECUTIVE</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
