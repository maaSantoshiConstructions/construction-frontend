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
  { id: 'emi', label: 'Home Loan EMI', Icon: LuChartPie },
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
    <div style={{ background: '#f7f7fb', minHeight: '100vh', paddingBottom: '90px' }}>

      {/* ===== HEADER ===== */}
      <div style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(91,79,224,.35), transparent 55%), linear-gradient(120deg,#0b0f2e 0%,#161b45 55%,#1c1450 100%)',
        padding: '64px 0 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(91,79,224,.1)' }} />
        <div className="wrap">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>FINANCIAL TOOLS</span>
          <h1 style={{ fontFamily: 'Poppins,Inter,sans-serif', fontSize: '42px', fontWeight: 800, color: '#fff', margin: '12px 0 14px' }}>
            Smart Calculators
          </h1>
          <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            Estimate land values, calculate your compound appreciation rates, construction budgets, and loan eligibilities instantly.
          </p>
        </div>
      </div>

      {/* ===== TABS NAV ===== */}
      <div className="wrap" style={{ position: 'relative', zIndex: 10, marginTop: '-28px' }}>
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid var(--line)',
          boxShadow: '0 15px 40px rgba(20,20,60,.1)',
          padding: '6px',
          display: 'flex',
          gap: '4px',
          marginBottom: '32px',
          overflowX: 'auto',
        }}>
          {tabs.map((tab) => {
            const TabIcon = tab.Icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: '.2s',
                  whiteSpace: 'nowrap',
                  background: isActive ? 'var(--indigo)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--gray)',
                  border: 'none',
                }}
              >
                <TabIcon size={18} style={{ color: isActive ? '#fff' : 'var(--indigo)' }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ===== ACTIVE CALCULATOR CONTENT ===== */}
        <div style={{ transition: 'all .3s' }}>
          {tabsContent[activeTab] || tabsContent['investment']}
        </div>
      </div>
    </div>
  );
}
