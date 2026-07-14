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

export default function LoanCalculator() {
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
      <style>{calcMedia}</style>
    </div>
  );
}
