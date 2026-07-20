import React from 'react';
import { Link } from 'react-router-dom';

export default function ProjectMainInfo({
  project,
  images,
  selectedImage,
  setSelectedImage,
  statusColors,
  locationStr,
  formattedPrice,
  rera,
  handleShare,
}) {
  return (
    <div className="wrap">
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid var(--line)',
        boxShadow: '0 10px 30px rgba(20,20,60,.06)',
        padding: '32px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '36px',
        alignItems: 'start',
        marginBottom: '32px',
      }} className="project-detail-grid project-main-card">
        
        {/* Left: Photos */}
        <div>
          <div className="project-main-photo" style={{
            borderRadius: '12px',
            overflow: 'hidden',
            height: '380px',
            marginBottom: '12px',
            border: '1px solid var(--line)',
            background: '#f7f7fb',
          }}>
            <img src={images[selectedImage]} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    width: '74px', height: '56px', borderRadius: '6px', overflow: 'hidden',
                    border: selectedImage === i ? '2px solid var(--indigo)' : '2px solid transparent',
                    padding: '0', background: 'none', flexShrink: 0
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div>
          {project.status && (
            <span className="tag" style={{
              background: statusColors[project.status]?.bg || '#f0f0f6',
              color: statusColors[project.status]?.text || 'var(--text)',
              fontSize: '11.5px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '.5px',
              marginBottom: '12px',
              display: 'inline-block',
            }}>
              {project.status}
            </span>
          )}
          <h1 className="project-main-title">
            {project.name}
          </h1>
          <div style={{ fontSize: '14px', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
            📍 {locationStr}
          </div>

          <p style={{ fontSize: '14.5px', color: 'var(--gray)', lineHeight: 1.65, marginBottom: '24px' }}>
            {project.description || 'Premium residential plotting development featuring beautiful parks, clear titles, boundary walls, street lighting, and wide concrete roads.'}
          </p>

          <div style={{
            background: '#f7f7fb',
            borderRadius: '12px',
            padding: '20px 24px',
            border: '1px solid var(--line)',
            marginBottom: '24px',
          }}>
            <div style={{ fontSize: '12px', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: '4px' }}>Starting Price</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--indigo)' }}>{formattedPrice}</div>
          </div>

          {/* Quick Stats Grid */}
          <div className="project-stats-grid">
            <div style={{ border: '1px solid var(--line)', borderRadius: '10px', padding: '12px 16px' }}>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase' }}>RERA Status</span>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text)', marginTop: '2px', display: 'block' }}>{rera}</span>
            </div>
            <div style={{ border: '1px solid var(--line)', borderRadius: '10px', padding: '12px 16px' }}>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase' }}>Property Type</span>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text)', marginTop: '2px', display: 'block', textTransform: 'capitalize' }}>
                {project.type?.replace(/_/g, ' ') || 'Plotted Development'}
              </span>
            </div>
            {project.totalPlots && (
              <div style={{ border: '1px solid var(--line)', borderRadius: '10px', padding: '12px 16px' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase' }}>Total Plots</span>
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text)', marginTop: '2px', display: 'block' }}>{project.totalPlots} Units</span>
              </div>
            )}
            {project.totalArea && (
              <div style={{ border: '1px solid var(--line)', borderRadius: '10px', padding: '12px 16px' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase' }}>Total Area</span>
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text)', marginTop: '2px', display: 'block' }}>{project.totalArea}</span>
              </div>
            )}
            {project.possessionDate && (
              <div style={{ border: '1px solid var(--line)', borderRadius: '10px', padding: '12px 16px' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase' }}>Possession</span>
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text)', marginTop: '2px', display: 'block' }}>
                  {new Date(project.possessionDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="project-action-btns">
            <Link to={`/plot-map?project=${project.slug}`} className="btn-gold" style={{ fontSize: '13.5px', padding: '12px 24px', border: 'none' }}>
              🗺 View Live Plot Map
            </Link>
            <Link to="/book-visit" className="btn-outline" style={{ fontSize: '13.5px', padding: '12px 24px', color: 'var(--text)', borderColor: 'var(--line)', background: '#fff', textDecoration: 'none' }}>
              📅 Schedule Site Visit
            </Link>
            <button onClick={handleShare} style={{ width: '42px', height: '42px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }} title="Share project">
              🔗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
