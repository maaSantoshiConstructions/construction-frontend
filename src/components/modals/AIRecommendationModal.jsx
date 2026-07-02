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
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: 'modalPopIn 0.3s ease forwards' }}>
        <div className="px-8 py-5 border-b flex justify-between items-center bg-slate-50">
          <div>
            <span className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-2xl">FEATURE 01</span>
            <span className="ml-3 font-bold text-xl text-slate-800">AI Property Recommendation System</span>
          </div>
          <button onClick={onClose} className="text-2xl leading-none text-slate-400 hover:text-slate-600">&times;</button>
        </div>
        <div className="p-8">
          <p className="text-slate-600">Answer a few simple questions. Our AI will instantly recommend the best-matching plot or villa and capture your details for personalized follow-up.</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold tracking-wider text-slate-500">YOUR BUDGET</label>
              <select value={budget} onChange={(e) => setBudget(e.target.value)}
                className="mt-1 w-full border rounded-2xl px-4 py-3 text-sm">
                <option value="25-40">₹25 – 40 Lakh</option>
                <option value="40-60">₹40 – 60 Lakh</option>
                <option value="60-90">₹60 – 90 Lakh</option>
                <option value="90+">₹90 Lakh+</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold tracking-wider text-slate-500">PREFERRED LOCATION</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full border rounded-2xl px-4 py-3 text-sm">
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
                    <input type="radio" name="ai-type" value={t} checked={type === t}
                      onChange={() => setType(t)} className="peer hidden" />
                    <span className="block text-center border peer-checked:border-blue-600 peer-checked:bg-blue-50 rounded-2xl py-2 text-sm font-medium capitalize">
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold tracking-wider text-slate-500">PURPOSE</label>
              <select value={purpose} onChange={(e) => setPurpose(e.target.value)}
                className="mt-1 w-full border rounded-2xl px-4 py-3 text-sm">
                <option value="self">Self-use / Living</option>
                <option value="invest">Investment</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button onClick={runRecommendation}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition text-white font-semibold rounded-3xl flex items-center justify-center gap-x-2">
              <FaMagic />
              <span>GET MY PERSONALIZED RECOMMENDATION</span>
            </button>
          </div>

          {result && (
            <div className="mt-6 p-5 border border-emerald-200 bg-emerald-50 rounded-3xl">
              <div className="font-bold flex items-center gap-x-2 text-emerald-700">
                <FaCheckCircle /> <span>AI MATCH FOUND</span>
              </div>
              <div className="mt-3 text-sm" dangerouslySetInnerHTML={{ __html: result.text }} />
              <div className="mt-2 text-xs text-emerald-700">Lead captured. Our relationship manager will contact you within 15 minutes.</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button onClick={() => { onClose(); setTimeout(onBookVisit, 600); }}
                  className="py-2.5 text-sm bg-emerald-600 text-white rounded-2xl font-semibold">
                  BOOK THIS PLOT
                </button>
                <button onClick={() => { onClose(); toast.success('Our sales team has been notified. You will receive a WhatsApp message shortly from +91 98765 43210.'); }}
                  className="py-2.5 text-sm border border-emerald-600 text-emerald-700 rounded-2xl font-semibold">
                  TALK TO SALES EXECUTIVE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
