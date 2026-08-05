import { useSearchParams } from 'react-router-dom';
import { LuTrendingUp, LuBadgePercent, LuChartPie, LuCalculator } from 'react-icons/lu';

// Import modular subcomponents
import InvestmentCalculator from '../../components/calculators/InvestmentCalculator';
import LoanCalculator from '../../components/calculators/LoanCalculator';
import EMICalculator from '../../components/calculators/EMICalculator';
import ConstructionCalculator from '../../components/calculators/ConstructionCalculator';

const tabs = [
  { id: 'investment', label: 'Investment Return', Icon: LuTrendingUp },
  { id: 'loan-eligibility', label: 'Loan Eligibility', Icon: LuBadgePercent },
  // { id: 'emi', label: 'Home Loan EMI', Icon: LuChartPie },
  { id: 'construction', label: 'Construction Cost', Icon: LuCalculator },
];

const validTabIds = ['investment', 'loan-eligibility', 'loan', 'emi', 'construction'];

export default function Calculators() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTabParam = searchParams.get('tab');

  // Normalize active tab (default to 'investment', support 'loan' alias for 'loan-eligibility')
  let activeTab = 'investment';
  if (rawTabParam && validTabIds.includes(rawTabParam)) {
    activeTab = rawTabParam === 'loan' ? 'loan-eligibility' : rawTabParam;
  }

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const tabsContent = {
    investment: <InvestmentCalculator />,
    'loan-eligibility': <LoanCalculator />,
    loan: <LoanCalculator />,
    emi: <EMICalculator />,
    construction: <ConstructionCalculator />,
  };

  return (
    <div className="bg-[#f7f7fb] min-h-screen pb-24">
      {/* ===== HEADER ===== */}
      <div className="relative overflow-hidden text-center py-14 sm:py-16 px-4 bg-gradient-to-r from-[#0b0f2e] via-[#161b45] to-[#1c1450]">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/10 pointer-events-none" />
        <div className="wrap max-w-4xl mx-auto">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-amber-400 text-xs font-bold tracking-wider uppercase mb-3">
            FINANCIAL TOOLS
          </span>
          <h1 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl md:text-5xl font-extrabold text-white my-3">
            Smart Calculators
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Estimate land values, calculate your compound appreciation rates, construction budgets, and loan eligibilities instantly.
          </p>
        </div>
      </div>

      {/* ===== TABS NAV ===== */}
      <div className="wrap max-w-5xl mx-auto px-4 sm:px-6 -mt-7 relative z-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 flex gap-1 mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const TabIcon = tab.Icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-all whitespace-nowrap border-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-transparent text-slate-600 hover:bg-slate-50'
                }`}
              >
                <TabIcon className={`text-base shrink-0 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ===== ACTIVE CALCULATOR CONTENT ===== */}
        <div className="transition-all duration-300">
          {tabsContent[activeTab] || tabsContent['investment']}
        </div>
      </div>
    </div>
  );
}
