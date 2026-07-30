import React from 'react';
import { LuCircleHelp, LuChevronDown } from 'react-icons/lu';

export default function ReferralFaq({ faqs = [], openFaq = null, setOpenFaq }) {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <LuCircleHelp size={20} className="text-indigo-600" /> Frequently Asked Questions
      </h3>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100/80 font-semibold text-xs sm:text-sm text-slate-800 flex justify-between items-center transition-colors cursor-pointer"
            >
              <span>{faq.q}</span>
              <LuChevronDown
                size={16}
                className={`transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`}
              />
            </button>
            {openFaq === idx && (
              <div className="p-4 text-xs text-slate-600 leading-relaxed border-t border-slate-200 bg-white">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
