import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaTimes, FaArrowRight, FaCheck } from 'react-icons/fa';

const allProperties = [
  { id: 1, name: 'Plot A-42', project: 'Santoshi Enclave Phase 1', location: 'Patia, Bhubaneswar', size: 2400, price: 5880000, facing: 'North', road: 40, status: 'available', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400' },
  { id: 2, name: 'Plot C-19', project: 'Santoshi Greens', location: 'Khandagiri, Bhubaneswar', size: 1800, price: 3510000, facing: 'South-East', road: 30, status: 'available', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56b08?w=400' },
  { id: 3, name: 'Villa B-07', project: 'Santoshi Villas', location: 'Chandrasekharpur, Bhubaneswar', size: 3200, price: 15520000, facing: 'East', road: 50, status: 'reserved', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400' },
  { id: 4, name: 'Plot B-12', project: 'Santoshi Enclave Phase 1', location: 'Patia, Bhubaneswar', size: 1500, price: 3675000, facing: 'West', road: 30, status: 'sold', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400' },
  { id: 5, name: 'Plot D-05', project: 'Santoshi Greens', location: 'Khandagiri, Bhubaneswar', size: 2100, price: 4095000, facing: 'North-East', road: 40, status: 'available', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56b08?w=400' },
  { id: 6, name: 'Villa A-03', project: 'Santoshi Villas', location: 'Chandrasekharpur, Bhubaneswar', size: 2800, price: 13580000, facing: 'North', road: 60, status: 'available', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400' },
];

const attributes = [
  { key: 'project', label: 'Project' },
  { key: 'location', label: 'Location' },
  { key: 'size', label: 'Size (sq.ft)', format: (v) => `${v} sq.ft` },
  { key: 'price', label: 'Price', format: (v) => `₹${(v / 100000).toFixed(1)} Lakh` },
  { key: 'facing', label: 'Facing' },
  { key: 'road', label: 'Road Width', format: (v) => `${v} ft` },
  { key: 'status', label: 'Status', format: (v) => v.charAt(0).toUpperCase() + v.slice(1) },
];

export default function PropertyComparison() {
  const [selected, setSelected] = useState([]);

  const addProperty = (prop) => {
    if (selected.length < 4 && !selected.find((s) => s.id === prop.id)) {
      setSelected([...selected, prop]);
    }
  };

  const removeProperty = (id) => {
    setSelected(selected.filter((s) => s.id !== id));
  };

  return (
    <div style={{ background: '#f7f7fb', minHeight: '100vh', paddingBottom: '90px' }}>
      
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
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>COMPARE TOOLS</span>
          <h1 style={{ fontFamily: 'Poppins, Inter, sans-serif', fontSize: '40px', fontWeight: 800, color: '#fff', marginTop: '8px', marginBottom: '14px' }}>
            Property Comparison
          </h1>
          <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Select and compare up to 4 plots or villas side-by-side to make the right choice.
          </p>
        </div>
      </div>

      {/* ===== MAIN CONTENT WRAPPER ===== */}
      <div className="wrap" style={{ marginTop: '-28px', position: 'relative', zIndex: 10 }}>
        
        {/* Selection Controller Card */}
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
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', marginBottom: '20px', fontFamily: 'Poppins, sans-serif' }}>
            Select Properties to Compare ({selected.length}/4)
          </h2>

          {selected.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fit, minmax(140px, 1fr))`,
              gap: '12px',
              marginBottom: '24px',
            }}>
              {selected.map((prop) => (
                <div
                  key={prop.id}
                  style={{
                    position: 'relative',
                    border: '1px solid var(--indigo)',
                    background: '#f1eefe',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <button
                    onClick={() => removeProperty(prop.id)}
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      width: '22px',
                      height: '22px',
                      background: '#e74c3c',
                      color: '#fff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <FaTimes />
                  </button>
                  <p style={{ fontWeight: 800, color: 'var(--text)', fontSize: '13.5px', margin: 0 }}>{prop.name}</p>
                  <p style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '2px', margin: '2px 0 0' }}>{prop.project}</p>
                </div>
              ))}
            </div>
          )}

          {selected.length < 4 && (
            <div>
              <p style={{ fontSize: '12.5px', color: 'var(--gray)', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Add properties to compare list:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {allProperties.filter((p) => !selected.find((s) => s.id === p.id)).map((prop) => (
                  <button
                    key={prop.id}
                    onClick={() => addProperty(prop)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: '1px solid var(--line)',
                      cursor: 'pointer',
                      background: '#fff',
                      color: 'var(--text)',
                      transition: 'all 0.2s',
                      outline: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = 'var(--indigo)';
                      e.target.style.color = 'var(--indigo)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'var(--line)';
                      e.target.style.color = 'var(--text)';
                    }}
                  >
                    <FaPlus style={{ fontSize: '9px', color: 'var(--gray)' }} /> {prop.name} — {prop.project}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Side-by-side Table Comparison Board */}
        {selected.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#fff',
              borderRadius: '16px',
              border: '1px solid var(--line)',
              boxShadow: '0 15px 40px rgba(20,20,60,.06)',
              overflow: 'hidden',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--line)' }}>
                    <th style={{ textAlign: 'left', padding: '16px 24px', fontWeight: 700, color: 'var(--gray)', width: '160px' }}>
                      Specification
                    </th>
                    {selected.map((prop) => (
                      <th key={prop.id} style={{ padding: '16px 24px', textAlign: 'center', fontWeight: 800, color: 'var(--text)', minWidth: '180px' }}>
                        {prop.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attributes.map((attr, idx) => (
                    <tr key={attr.key} style={{ borderBottom: '1px solid var(--line)', background: idx % 2 === 0 ? '#fff' : '#fcfcfd' }}>
                      <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--gray)' }}>{attr.label}</td>
                      {selected.map((prop) => {
                        const values = selected.map((s) => s[attr.key]);
                        const best = attr.key === 'price' ? Math.min(...values) : attr.key === 'size' ? Math.max(...values) : null;
                        const isBest = best !== null && prop[attr.key] === best;
                        return (
                          <td
                            key={prop.id}
                            style={{
                              padding: '16px 24px',
                              textAlign: 'center',
                              background: isBest ? '#e6f7ed' : 'transparent',
                              transition: 'background 0.2s',
                            }}
                          >
                            <span style={{
                              fontWeight: isBest ? 700 : 500,
                              color: isBest ? '#27ae60' : 'var(--text)',
                              display: 'block',
                            }}>
                              {attr.format ? attr.format(prop[attr.key]) : prop[attr.key]}
                            </span>
                            {isBest && attr.key === 'price' && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '9.5px', color: '#27ae60', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>
                                <FaCheck style={{ fontSize: '8px' }} /> Best Value
                              </span>
                            )}
                            {isBest && attr.key === 'size' && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '9.5px', color: '#27ae60', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>
                                <FaCheck style={{ fontSize: '8px' }} /> Largest Size
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '16px', background: '#f8fafc', borderTop: '1px solid var(--line)', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: 'var(--gray)', margin: 0, fontWeight: 500 }}>
                💡 Tip: Look for the green highlighted options representing optimal budget and layout sizing specifications.
              </p>
            </div>
          </motion.div>
        )}

        {/* Dynamic Fallback views if less than 2 properties selected */}
        {selected.length < 2 && selected.length > 0 && (
          <div style={{ textAlign: 'center', padding: '60px 40px', background: '#fff', borderRadius: '16px', border: '1px solid var(--line)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fef9e7', display: 'flex', alignItems: 'center', justifyContents: 'center', margin: '0 auto 16px', justifyContent: 'center' }}>
              <FaArrowRight style={{ text: '#f1c40f', color: '#f1c40f', fontSize: '18px' }} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text)', margin: '0 0 4px' }}>Select Another Property</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--gray)', margin: 0 }}>Add at least one more plot or villa above to view comparison specifications.</p>
          </div>
        )}

        {selected.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: '16px', border: '1px solid var(--line)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f0effc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <FaPlus style={{ color: 'var(--indigo)', fontSize: '20px' }} />
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text)', margin: '0 0 6px', fontFamily: 'Poppins, sans-serif' }}>
              No Properties Selected
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--gray)', margin: 0 }}>
              Add up to 4 plots or villas from the listing above to run a side-by-side spec comparison.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
