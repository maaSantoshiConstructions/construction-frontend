import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkedAlt, FaFire, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const regions = [
  {
    id: 'patia', name: 'Patia', growth: 18, priceRange: '₹2,400 - ₹3,200/sq.ft',
    highlights: ['Near Infosys & IT hub', 'NH-16 connectivity', 'Upcoming metro station', 'Premium residential area'],
    color: '#e67e22', heat: 'high',
  },
  {
    id: 'khandagiri', name: 'Khandagiri', growth: 14, priceRange: '₹1,800 - ₹2,600/sq.ft',
    highlights: ['Affordable rates', 'Near proposed ring road', 'Tourist area', 'Good rental demand'],
    color: '#f1c40f', heat: 'moderate',
  },
  {
    id: 'chandrasekharpur', name: 'Chandrasekharpur', growth: 16, priceRange: '₹3,000 - ₹4,500/sq.ft',
    highlights: ['Premium locality', 'KIIT & educational hub', 'Developed infrastructure', 'High appreciation'],
    color: '#e67e22', heat: 'high',
  },
  {
    id: 'nayapalli', name: 'Nayapalli', growth: 11, priceRange: '₹3,500 - ₹5,000/sq.ft',
    highlights: ['Established area', 'Government colonies', 'Limited availability', 'Stable returns'],
    color: '#3498db', heat: 'stable',
  },
  {
    id: 'puri-road', name: 'Puri Road', growth: 22, priceRange: '₹1,500 - ₹2,800/sq.ft',
    highlights: ['Highway front', 'Rapidly developing', 'New projects coming up', 'Best for investment'],
    color: '#e74c3c', heat: 'very-high',
  },
  {
    id: 'airport-road', name: 'Airport Road', growth: 13, priceRange: '₹2,800 - ₹4,200/sq.ft',
    highlights: ['International airport', 'Commercial hub', 'Hotel & business district', 'Premium pricing'],
    color: '#e67e22', heat: 'high',
  },
];

export default function InvestmentHeatmap() {
  const [selected, setSelected] = useState(regions[0]);

  return (
    <div style={{ background: '#f7f7fb', minHeight: '100vh', paddingBottom: '90px' }}>
      
      {/* Dynamic Keyframe Style for Heatmap Glowing Hotspots */}
      <style>{`
        @keyframes heatmap-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.6); }
          70% { transform: scale(1.2); box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
        }
      `}</style>

      {/* ===== PAGE HEADER ===== */}
      <div style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(91,79,224,.35), transparent 55%), linear-gradient(120deg,#0b0f2e 0%,#161b45 55%,#1c1450 100%)',
        padding: '64px 0 60px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(91,79,224,.1)' }} />
        <div className="wrap">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>INVESTMENT ANALYTICS</span>
          <h1 style={{ fontFamily: 'Poppins, Inter, sans-serif', fontSize: '40px', fontWeight: 800, color: '#fff', marginTop: '8px', marginBottom: '14px' }}>
            Odisha Investment Heatmap
          </h1>
          <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Identify high-growth vectors and appreciation triggers for real estate investments.
          </p>
        </div>
      </div>

      {/* ===== CONTENT WRAPPER ===== */}
      <div className="wrap" style={{ marginTop: '-28px', position: 'relative', zIndex: 10, maxWidth: '1000px' }}>
        
        {/* Growth Zones Main Map Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid var(--line)',
            boxShadow: '0 15px 40px rgba(20,20,60,.1)',
            padding: '32px',
            marginBottom: '32px',
          }}
        >
          {/* Header & Legend */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
              Bhubaneswar Growth Zones
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '11px', fontWeight: 700, color: 'var(--text)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e74c3c' }} /> Very High</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e67e22' }} /> High</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f1c40f' }} /> Moderate</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3498db' }} /> Stable</span>
            </div>
          </div>

          {/* Regions Grid buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '28px' }}>
            {regions.map((region) => {
              const isActive = selected.id === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => setSelected(region)}
                  style={{
                    padding: '16px 12px',
                    borderRadius: '12px',
                    border: `1.5px solid ${isActive ? 'var(--indigo)' : 'var(--line)'}`,
                    background: isActive ? '#f5f4fd' : '#fff',
                    textAlign: 'center',
                    cursor: 'pointer',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s',
                    boxShadow: isActive ? '0 4px 12px rgba(58, 47, 184, 0.06)' : 'none',
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: region.color,
                    borderRadius: '8px',
                    margin: '0 auto 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <FaFire style={{ color: '#fff', fontSize: '14px' }} />
                  </div>
                  <p style={{ fontWeight: 800, color: 'var(--text)', fontSize: '13.5px', margin: 0 }}>{region.name}</p>
                  <p style={{ fontSize: '12.5px', color: '#27ae60', fontWeight: 700, marginTop: '4px', margin: '4px 0 0' }}>{region.growth}% CAGR</p>
                </button>
              );
            })}
          </div>

          {/* Interactive Heatmap Map container */}
          <div style={{ position: 'relative', aspectRatio: '21/9', background: '#0b0f2e', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line)' }}>
            <img
              src="https://images.unsplash.com/photo-1577086664693-894d8405334a?w=1200&q=80"
              alt="Bhubaneswar Master Map"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(8,10,32,0.6) 0%, transparent 100%)' }} />
            
            {/* Heat Points */}
            {regions.map((region, i) => {
              const isActive = selected.id === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => setSelected(region)}
                  style={{
                    position: 'absolute',
                    left: `${15 + i * 14}%`,
                    top: `${30 + (i % 3) * 18}%`,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                    zIndex: isActive ? 20 : 10,
                  }}
                >
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: region.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid #fff`,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    transform: isActive ? 'scale(1.2)' : 'scale(1)',
                    transition: 'transform 0.2s',
                    animation: 'heatmap-pulse 2s infinite',
                  }}>
                    <FaFire style={{ color: '#fff', fontSize: '13px' }} />
                  </div>
                  <span style={{
                    display: 'block',
                    background: 'rgba(9,12,36,0.85)',
                    color: '#fff',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    marginTop: '4px',
                    fontWeight: 600,
                    opacity: isActive ? 1 : 0.6,
                  }}>
                    {region.name}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Detailed Insights Segment */}
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid var(--line)',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(20,20,60,0.02)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            
            {/* Left Specs Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: selected.color,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <FaFire style={{ color: '#fff', fontSize: '18px' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                    {selected.name} Zone
                  </h3>
                  <p style={{ fontSize: '13px', color: '#27ae60', fontWeight: 700, margin: 0 }}>
                    {selected.growth}% CAGR Growth Rate
                  </p>
                </div>
              </div>

              <p style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--gold-dark)', marginBottom: '20px' }}>
                Price Range: {selected.priceRange}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selected.highlights.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'var(--gray)', fontWeight: 500 }}>
                    <FaCheckCircle style={{ color: '#2ecc71', fontSize: '13px', flexShrink: 0 }} />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Growth Indicators Grid */}
            <div>
              <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Growth Indicators
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: '5-Year Appreciation', value: `${Math.round(selected.growth * 3.2)}%`, color: '#2ecc71' },
                  { label: 'Rental Yield', value: `${(3 + selected.growth * 0.12).toFixed(1)}%`, color: '#e67e22' },
                  { label: 'Infrastructure Score', value: `${Math.min(95, 60 + selected.growth * 2)}/100`, color: 'var(--indigo)' },
                  { label: 'Demand Index', value: `${Math.min(100, 50 + selected.growth * 2.5)}/100`, color: 'var(--indigo)' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--line)' }}>
                    <p style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: 600, margin: 0 }}>{item.label}</p>
                    <p style={{ fontSize: '20px', fontWeight: 800, color: item.color, margin: '6px 0 0' }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* BDA Disclaimer box */}
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: '#fef9e7',
                border: '1px solid #fcf3e6',
                borderRadius: '12px',
                fontSize: '11px',
                color: '#7f8c8d',
                lineHeight: 1.5,
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
              }}>
                <FaInfoCircle style={{ fontSize: '13px', color: '#f1c40f', flexShrink: 0, marginTop: '2px' }} />
                <span>
                  Compiled from BDA, Odisha RERA master records &amp; market reports. Past appreciation yields do not guarantee future returns.
                </span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

    </div>
  );
}
