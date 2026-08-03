import { FaFolder, FaFileContract, FaClock, FaHeadset } from 'react-icons/fa';

export default function CustomerProfileTabs({ activeTab, setActiveTab, custName }) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: 'Documents' },
    { id: 'agreements', label: 'Agreements' },
    { id: 'emi', label: 'EMI Schedule' },
    { id: 'support', label: 'Support Tickets' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
        <h3 className="font-bold text-slate-800 text-base">Additional Profile Modules</h3>
        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-amber-100 text-amber-800'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <p className="text-xs text-slate-500 leading-relaxed">
          All property purchases and payment ledger records for {custName} are displayed above. Use the tabs to preview upcoming extensions.
        </p>
      )}

      {activeTab === 'documents' && (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
          <FaFolder className="text-3xl text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">Document Repository Coming Soon</h4>
          <p className="text-xs text-slate-400">KYC documents, ID proofs, and plot certificates for {custName} will be stored here.</p>
        </div>
      )}

      {activeTab === 'agreements' && (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
          <FaFileContract className="text-3xl text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">Agreements & Legal Contracts</h4>
          <p className="text-xs text-slate-400">Signed sales agreements and notary documents will be archived here.</p>
        </div>
      )}

      {activeTab === 'emi' && (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
          <FaClock className="text-3xl text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">EMI & Installment Schedule</h4>
          <p className="text-xs text-slate-400">Customized payment schedule and installment reminders.</p>
        </div>
      )}

      {activeTab === 'support' && (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
          <FaHeadset className="text-3xl text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">Customer Support & Tickets</h4>
          <p className="text-xs text-slate-400">Communication history and service tickets for {custName}.</p>
        </div>
      )}
    </div>
  );
}
