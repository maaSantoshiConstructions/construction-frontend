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

const calcMedia = `
  @media(max-width: 991px) {
    .calc-grid-el { grid-template-columns: 1fr !important; gap: 32px !important; }
  }
`;

export default function ConstructionCalculator() {
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
              { label: 'Labor Cost (25%)', value: laborCost, col: '#2f9e5c' },
              { label: 'Overheads (10%)', value: overheadCost, col: '#d99f36' },
              { label: 'Contingency (10%)', value: contingencyCost, col: '#7d7aa3' },
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
      <style>{calcMedia}</style>
    </div>
  );
}
