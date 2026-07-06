import { useState } from 'react';

const tabs = [
  { id: 'investment', label: 'Investment Return', ic: '📊' },
  { id: 'loan',         label: 'Loan Eligibility',  ic: '🏦' },
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

/* ===== 1. INVESTMENT RETURN CALCULATOR ===== */
function InvestmentCalculator() {
  const [amount, setAmount] = useState(5000000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);

  const futureValue = amount * Math.pow(1 + rate / 100, years);
  const roi = ((futureValue - amount) / amount) * 100;
  const rentalYield = 3.5;

  const formatCurrency = (val) => '₹ ' + Math.round(val).toLocaleString('en-IN');

  return (
    <div style={{
      background: '#fff', borderRadius: '16px', border: '1px solid var(--line)',
      boxShadow: '0 10px 30px rgba(20,20,60,.04)', padding: '36px',
    }}>
      <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '28px' }}>
        📈 Real Estate Appreciation &amp; Investment returns
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '36px' }} className="calc-grid-el">
        
        {/* Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div style={labelRow}>
              <span style={labelStyle}>Investment Amount</span>
              <span style={valStyle}>{formatCurrency(amount)}</span>
            </div>
            <input type="range" min={100000} max={50000000} step={100000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={sliderStyle} />
            <div style={rangeLimits}><span>₹1 Lakh</span><span>₹5 Crore</span></div>
          </div>
          <div>
            <div style={labelRow}>
              <span style={labelStyle}>Expected Appreciation (p.a.)</span>
              <span style={valStyle}>{rate}%</span>
            </div>
            <input type="range" min={1} max={30} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} style={sliderStyle} />
            <div style={rangeLimits}><span>1%</span><span>30%</span></div>
          </div>
          <div>
            <div style={labelRow}>
              <span style={labelStyle}>Holding Tenure</span>
              <span style={valStyle}>{years} Years</span>
            </div>
            <input type="range" min={1} max={25} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} style={sliderStyle} />
            <div style={rangeLimits}><span>1 Year</span><span>25 Years</span></div>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(120deg,#3a2fb8,#5b4fe0 60%,#7a3fd6)', borderRadius: '12px', padding: '22px', color: '#fff' }}>
            <p style={{ fontSize: '12.5px', color: '#d8d4ff', textTransform: 'uppercase', fontWeight: 600 }}>Estimated Future Value</p>
            <p style={{ fontSize: '30px', fontWeight: 800, marginTop: '4px' }}>{formatCurrency(futureValue)}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={resCard}>
              <span style={resCardLbl}>Wealth Gain</span>
              <span style={{ ...resCardVal, color: '#2f9e5c' }}>{formatCurrency(futureValue - amount)}</span>
            </div>
            <div style={resCard}>
              <span style={resCardLbl}>ROI (Percentage)</span>
              <span style={{ ...resCardVal, color: 'var(--indigo)' }}>{roi.toFixed(1)}%</span>
            </div>
          </div>
          <div style={resCard}>
            <span style={resCardLbl}>Estimated Rental Yield</span>
            <span style={{ ...resCardVal, color: 'var(--indigo)' }}>{rentalYield}% p.a.</span>
          </div>
        </div>

      </div>
      <style>{calcMedia}</style>
    </div>
  );
}

/* ===== 2. LOAN ELIGIBILITY CALCULATOR ===== */
function LoanCalculator() {
  const [income, setIncome] = useState(80000);
  const [existingEMI, setExistingEMI] = useState(0);
  const [age, setAge] = useState(30);
  const [tenure, setTenure] = useState(20);
  const [rate, setRate] = useState(8.5);

  const monthlyAvailable = income * 0.5 - existingEMI;
  const maxLoanAmount = monthlyAvailable * ((1 - Math.pow(1 + rate / 12 / 100, -tenure * 12)) / (rate / 12 / 100));
  const emi = monthlyAvailable;

  const formatCurrency = (val) => '₹ ' + Math.round(val).toLocaleString('en-IN');

  return (
    <div style={{
      background: '#fff', borderRadius: '16px', border: '1px solid var(--line)',
      boxShadow: '0 10px 30px rgba(20,20,60,.04)', padding: '36px',
    }}>
      <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '28px' }}>
        🏦 Plot &amp; Housing Loan Eligibility
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '36px' }} className="calc-grid-el">
        
        {/* Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={labelRow}>
              <span style={labelStyle}>Monthly Income</span>
              <span style={valStyle}>{formatCurrency(income)}</span>
            </div>
            <input type="range" min={20000} max={500000} step={5000} value={income} onChange={(e) => setIncome(Number(e.target.value))} style={sliderStyle} />
            <div style={rangeLimits}><span>₹20k</span><span>₹5L</span></div>
          </div>
          <div>
            <div style={labelRow}>
              <span style={labelStyle}>Existing Monthly EMIs</span>
              <span style={valStyle}>{formatCurrency(existingEMI)}</span>
            </div>
            <input type="range" min={0} max={100000} step={1000} value={existingEMI} onChange={(e) => setExistingEMI(Number(e.target.value))} style={sliderStyle} />
            <div style={rangeLimits}><span>₹0</span><span>₹1L</span></div>
          </div>
          <div>
            <div style={labelRow}>
              <span style={labelStyle}>Age of Applicant</span>
              <span style={valStyle}>{age} Years</span>
            </div>
            <input type="range" min={21} max={60} step={1} value={age} onChange={(e) => setAge(Number(e.target.value))} style={sliderStyle} />
            <div style={rangeLimits}><span>21 yrs</span><span>60 yrs</span></div>
          </div>
          <div>
            <div style={labelRow}>
              <span style={labelStyle}>Loan Tenure</span>
              <span style={valStyle}>{tenure} Years</span>
            </div>
            <input type="range" min={5} max={30} step={1} value={tenure} onChange={(e) => setTenure(Number(e.target.value))} style={sliderStyle} />
            <div style={rangeLimits}><span>5 yrs</span><span>30 yrs</span></div>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(120deg,#3a2fb8,#5b4fe0 60%,#7a3fd6)', borderRadius: '12px', padding: '22px', color: '#fff' }}>
            <p style={{ fontSize: '12.5px', color: '#d8d4ff', textTransform: 'uppercase', fontWeight: 600 }}>Maximum Loan Amount Eligible</p>
            <p style={{ fontSize: '30px', fontWeight: 800, marginTop: '4px' }}>{maxLoanAmount > 0 ? formatCurrency(maxLoanAmount) : '₹ 0'}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={resCard}>
              <span style={resCardLbl}>Estimated Monthly EMI</span>
              <span style={{ ...resCardVal, color: '#2f9e5c' }}>{formatCurrency(emi > 0 ? emi : 0)}</span>
            </div>
            <div style={resCard}>
              <span style={resCardLbl}>Expected Interest Rate</span>
              <span style={{ ...resCardVal, color: 'var(--indigo)' }}>{rate}% p.a.</span>
            </div>
          </div>
          <div style={resCard}>
            <span style={resCardLbl}>Monthly Cash Surplus</span>
            <span style={{ ...resCardVal, color: 'var(--indigo)' }}>{formatCurrency(monthlyAvailable > 0 ? monthlyAvailable : 0)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ===== 3. CONSTRUCTION COST CALCULATOR ===== */
function ConstructionCalculator() {
  const [plotSize, setPlotSize] = useState(1200);
  const [floors, setFloors] = useState(2);
  const [quality, setQuality] = useState('standard');

  const qualityRates = { basic: 1500, standard: 2200, premium: 3200 };
  const rate = qualityRates[quality];
  const builtUpArea = plotSize * 0.6 * floors;
  const constructionCost = builtUpArea * rate;
  const materialCost = constructionCost * 0.55;
  const laborCost = constructionCost * 0.25;
  const overheadCost = constructionCost * 0.1;
  const contingencyCost = constructionCost * 0.1;

  const formatCurrency = (val) => '₹ ' + Math.round(val).toLocaleString('en-IN');

  return (
    <div style={{
      background: '#fff', borderRadius: '16px', border: '1px solid var(--line)',
      boxShadow: '0 10px 30px rgba(20,20,60,.04)', padding: '36px',
    }}>
      <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '28px' }}>
        🏗 Built Construction Estimator
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '36px' }} className="calc-grid-el">
        
        {/* Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={labelRow}>
              <span style={labelStyle}>Plot Area Size</span>
              <span style={valStyle}>{plotSize} Sq.ft</span>
            </div>
            <input type="range" min={500} max={5000} step={50} value={plotSize} onChange={(e) => setPlotSize(Number(e.target.value))} style={sliderStyle} />
            <div style={rangeLimits}><span>500 Sq.ft</span><span>5000 Sq.ft</span></div>
          </div>
          <div>
            <div style={labelRow}>
              <span style={labelStyle}>Total Floors</span>
              <span style={valStyle}>{floors} Floors</span>
            </div>
            <input type="range" min={1} max={5} step={1} value={floors} onChange={(e) => setFloors(Number(e.target.value))} style={sliderStyle} />
            <div style={rangeLimits}><span>1 Floor</span><span>5 Floors</span></div>
          </div>
          <div>
            <span style={{ ...labelStyle, display: 'block', marginBottom: '8px' }}>Material Quality Selection</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              {Object.entries(qualityRates).map(([key, val]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setQuality(key)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid',
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', transition: '.2s',
                    borderColor: quality === key ? 'var(--indigo)' : 'var(--line)',
                    background: quality === key ? 'var(--indigo)' : '#fff',
                    color: quality === key ? '#fff' : 'var(--text)',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'capitalize' }}>{key}</div>
                  <div style={{ fontSize: '10.5px', marginTop: '2px', opacity: 0.85 }}>₹{val}/Sq.ft</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(120deg,#3a2fb8,#5b4fe0 60%,#7a3fd6)', borderRadius: '12px', padding: '22px', color: '#fff' }}>
            <p style={{ fontSize: '12.5px', color: '#d8d4ff', textTransform: 'uppercase', fontWeight: 600 }}>Total Construction Cost</p>
            <p style={{ fontSize: '30px', fontWeight: 800, marginTop: '4px' }}>{formatCurrency(constructionCost)}</p>
            <p style={{ fontSize: '11px', color: '#b7bade', marginTop: '6px' }}>Estimated Built-up area: {builtUpArea.toFixed(0)} Sq.ft (at 60% coverage)</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Material Cost (55%)', value: materialCost, col: '#3a2fb8' },
              { label: 'Labor Cost (25%)',    value: laborCost,    col: '#2f9e5c' },
              { label: 'Overheads (10%)',     value: overheadCost, col: '#d99f36' },
              { label: 'Contingency (10%)',   value: contingencyCost, col: '#7d7aa3' },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', background: '#f7f7fb', fontSize: '13px' }}>
                <span style={{ color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: item.col }} />
                  {item.label}
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text)' }}>{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ===== Styled components / CSS variables mapping helpers ===== */
const labelRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' };
const labelStyle = { fontSize: '13px', fontWeight: 600, color: 'var(--text)' };
const valStyle = { fontSize: '14.5px', fontWeight: 700, color: 'var(--indigo)' };
const rangeLimits = { display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#9ea1c4', marginTop: '4px' };

const sliderStyle = {
  width: '100%',
  height: '5px',
  borderRadius: '3px',
  background: '#e6e6f0',
  outline: 'none',
  accentColor: 'var(--indigo)',
  cursor: 'pointer',
};

const resCard = {
  background: '#f7f7fb',
  border: '1px solid var(--line)',
  borderRadius: '10px',
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
};
const resCardLbl = { fontSize: '11px', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.3px' };
const resCardVal = { fontSize: '16px', fontWeight: 800, marginTop: '2px' };

const calcMedia = `
  @media(max-width: 991px) {
    .calc-grid-el { grid-template-columns: 1fr !important; gap: 32px !important; }
  }
`;
