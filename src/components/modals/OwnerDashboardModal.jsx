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
      className="fixed inset-0 bg-black/70 z-[110] flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden"
        style={{ maxHeight: '92vh', animation: 'modalPopIn 0.3s ease forwards' }}>
        <div className="px-8 py-4 border-b flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-x-3">
            <FaUserShield className="text-xl" />
            <div>
              <div className="font-bold">Owner & Investor Dashboard</div>
              <div className="text-xs opacity-75">Welcome back, <span className="font-semibold">Debasis Patra</span></div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white text-3xl leading-none">&times;</button>
        </div>

        <div className="p-6">
          <div className="flex border-b mb-6 text-sm overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 whitespace-nowrap transition-all ${activeTab === tab.id
                  ? 'border-b-3 border-blue-600 text-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-700'}`}
                style={activeTab === tab.id ? { borderBottom: '3px solid #2563EB' } : {}}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="border rounded-2xl p-5">
                <div className="flex justify-between">
                  <div>
                    <div className="text-emerald-600 text-xs font-bold">BOOKED • PHASE 1</div>
                    <div className="font-bold text-xl text-slate-800">Plot A-42, Santoshi Enclave</div>
                    <div className="text-sm text-slate-500">2400 sq.ft • North Facing • ₹58.8 Lakh</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="px-3 py-0.5 bg-emerald-100 text-emerald-700 rounded">Possession: Dec 2027</div>
                  </div>
                </div>
                <div className="mt-4 text-xs flex gap-x-2">
                  <button onClick={() => toast.success('Agreement downloaded (demo)')}
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs rounded-2xl transition">
                    DOWNLOAD AGREEMENT
                  </button>
                  <button className="flex-1 py-2 border text-xs rounded-2xl hover:bg-slate-50 transition">
                    VIEW ON MAP
                  </button>
                </div>
              </div>
              <div className="border rounded-2xl p-5">
                <div className="flex justify-between">
                  <div>
                    <div className="text-emerald-600 text-xs font-bold">BOOKED • PHASE 2</div>
                    <div className="font-bold text-xl text-slate-800">Villa B-07, Santoshi Villas</div>
                    <div className="text-sm text-slate-500">3200 sq.ft • East Facing • ₹1.55 Cr</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="px-3 py-0.5 bg-amber-100 text-amber-700 rounded">Under Construction</div>
                  </div>
                </div>
                <div className="mt-4 text-xs flex gap-x-2">
                  <button className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs rounded-2xl transition">
                    VIEW PROGRESS
                  </button>
                  <button className="flex-1 py-2 border text-xs rounded-2xl hover:bg-slate-50 transition">
                    PAYMENT SCHEDULE
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div>
              <div className="text-sm text-slate-600">Payment History & Legal Documents</div>
              <table className="mt-3 w-full text-sm">
                <tbody>
                  <tr className="border-b"><td className="py-2 text-slate-600">Token Amount</td><td className="text-right font-mono">₹5,00,000</td><td className="text-right text-emerald-600">PAID</td></tr>
                  <tr className="border-b"><td className="py-2 text-slate-600">1st Installment (30%)</td><td className="text-right font-mono">₹17.64 Lakh</td><td className="text-right text-emerald-600">PAID</td></tr>
                  <tr className="border-b"><td className="py-2 text-slate-600">2nd Installment (Due 15 Aug)</td><td className="text-right font-mono">₹17.64 Lakh</td><td className="text-right text-amber-600">PENDING</td></tr>
                </tbody>
              </table>
              <button onClick={() => toast.success('Invoices downloaded (demo)')}
                className="mt-4 text-xs px-5 py-2 bg-white border rounded-2xl hover:bg-slate-50 transition">
                DOWNLOAD ALL INVOICES & LEGAL DOCS
              </button>
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <div className="text-sm text-slate-600 mb-3">Latest Construction Updates — Plot A-42</div>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3"><div className="font-mono text-xs w-20 text-slate-400">15 Jun 2026</div> <div className="text-slate-600">Foundation & plinth beam completed. Drone footage uploaded.</div></div>
                <div className="flex gap-3"><div className="font-mono text-xs w-20 text-slate-400">02 Jun 2026</div> <div className="text-slate-600">Site clearing & layout finalization done. Engineer report available.</div></div>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div>
              <div className="font-semibold text-slate-800">Your Referral Dashboard</div>
              <div className="mt-2 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-500">TOTAL EARNED</div>
                  <div className="text-3xl font-bold text-emerald-700">₹1,20,000 <span className="text-base font-normal">+ 2 Gold Coins</span></div>
                </div>
                <button onClick={referFriend}
                  className="px-6 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition">
                  REFER A FRIEND
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
