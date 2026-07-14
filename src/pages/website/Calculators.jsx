import { useState } from 'react';

// Import modular subcomponents
import InvestmentCalculator from '../../components/calculators/InvestmentCalculator';
import LoanCalculator from '../../components/calculators/LoanCalculator';
import ConstructionCalculator from '../../components/calculators/ConstructionCalculator';

const tabs = [
  { id: 'investment', label: 'Investment Return', ic: '📊' },
  { id: 'loan', label: 'Loan Eligibility', ic: '🏦' },
  { id: 'construction', label: 'Construction Cost', ic: '🏗' },
];

export default function Calculators() {
  const [activeTab, setActiveTab] = useState('investment');

  const tabsContent = {
    investment: <InvestmentCalculator />,
    loan: <LoanCalculator />,
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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
                background: activeTab === tab.id ? 'var(--indigo)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--gray)',
                border: 'none',
              }}
            >
              <span>{tab.ic}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* ===== ACTIVE CALCULATOR CONTENT ===== */}
        <div style={{ transition: 'all .3s' }}>
          {tabsContent[activeTab]}
        </div>
      </div>
    </div>
  );
}
