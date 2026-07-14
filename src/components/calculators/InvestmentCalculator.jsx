import React, { useState } from 'react';

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

export default function InvestmentCalculator() {
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
