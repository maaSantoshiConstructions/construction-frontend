import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaUserShield } from 'react-icons/fa';

const tabs = [
  { id: 0, label: 'My Properties' },
  { id: 1, label: 'Payments & Documents' },
  { id: 2, label: 'Construction Updates' },
  { id: 3, label: 'Referrals & Rewards' },
];

export default function OwnerDashboardModal({ onClose }) {
  const [activeTab, setActiveTab] = useState(0);

  const referFriend = () => {
    const name = prompt("Enter your friend's name:");
    if (name) {
      toast.success(`Referral link for ${name} has been generated and sent via WhatsApp.\n\nYou will earn ₹10,000 + Gold Coin upon successful booking.`);
    }
  };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()}
        className="modal bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
        style={{ maxHeight: '92vh' }}>
        <div className="px-8 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-orange-900 text-white">
          <div className="flex items-center gap-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <FaUserShield className="text-lg" />
            </div>
            <div>
              <div className="font-bold">Owner & Investor Dashboard</div>
              <div className="text-[10px] text-white/60">Welcome back, Mr. Santosh Patnaik</div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all text-xl leading-none">&times;</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-8">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`dashboard-tab px-5 py-3 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors ${activeTab === tab.id ? 'active text-orange-600' : ''}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(92vh - 130px)' }}>
          {/* Tab 0: My Properties */}
          {activeTab === 0 && (
            <div className="space-y-4">
              {[
                { name: 'Plot A-42, Santoshi Enclave', size: '2400 sq.ft', status: 'Active', progress: 'Construction Complete', color: 'emerald' },
                { name: 'Villa B-07, Santoshi Villas', size: '3200 sq.ft', status: 'Active', progress: '65% Complete', color: 'blue' },
              ].map((prop, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-xl">
                  <div>
                    <div className="font-semibold text-slate-800">{prop.name}</div>
                    <div className="text-sm text-slate-400">{prop.size}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold px-3 py-1 rounded-full ${prop.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{prop.progress}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 1: Payments & Documents */}
          {activeTab === 1 && (
            <div className="space-y-4">
              {[
                { label: 'Payment Schedule', desc: 'Total: ₹58.8 Lakh • Paid: ₹35.28 Lakh (60%)', cta: 'View Schedule' },
                { label: 'Sale Deed', desc: 'Registered • Ready for download', cta: 'Download' },
                { label: 'Mutation Certificate', desc: 'Pending • Expected in 30 days', cta: 'Track Status' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-xl">
                  <div>
                    <div className="font-semibold text-slate-800">{item.label}</div>
                    <div className="text-sm text-slate-400">{item.desc}</div>
                  </div>
                  <button className="text-xs font-semibold px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg shadow-orange-500/20">{item.cta}</button>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Construction Updates */}
          {activeTab === 2 && (
            <div className="space-y-4">
              {[
                { date: '28 Jun 2026', text: 'Roofing completed for A-block. Waterproofing in progress.' },
                { date: '15 Jun 2026', text: 'Electrical wiring completed for Phase 1 plots.' },
                { date: '01 Jun 2026', text: 'Road paving completed for main avenue.' },
              ].map((update, i) => (
                <div key={i} className="flex gap-4 p-5 bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-xl">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-slate-400 font-medium">{update.date}</div>
                    <div className="text-sm text-slate-600 mt-0.5">{update.text}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Referrals */}
          {activeTab === 3 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
                <span className="text-white text-2xl font-bold">₹</span>
              </div>
              <div className="font-bold text-xl text-slate-800">Earn ₹10,000 + Gold Coin per Referral</div>
              <div className="text-sm text-slate-400 mt-1">Refer a friend who buys a plot. No limit on referrals.</div>
              <button onClick={referFriend}
                className="mt-5 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-amber-500/20">
                Refer a Friend Now
              </button>
              <div className="mt-6 grid grid-cols-2 gap-3 text-left">
                {[
                  { name: 'Mr. Rajesh Das', status: 'Site Visit Done' },
                  { name: 'Mrs. Sunita Patra', status: 'Booking Done — ₹10,000 Earned!' },
                  { name: 'Mr. Alok Mishra', status: 'Interested' },
                ].map((ref, i) => (
                  <div key={i} className="p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-xl">
                    <div className="font-medium text-sm text-slate-700">{ref.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{ref.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
