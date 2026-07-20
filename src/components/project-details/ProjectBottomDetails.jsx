import React from 'react';

export default function ProjectBottomDetails({
  project,
  finalAmenities,
  finalHighlights,
  getImageUrl,
}) {
  return (
    <div className="wrap">
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '32px' }} className="project-detail-grid">
        {/* Amenities */}
        <div className="project-section-card" style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 30px rgba(20,20,60,.03)' }}>
          <h2 style={{ fontFamily: 'Poppins,Inter,sans-serif', fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '20px' }}>
            Project Amenities
          </h2>
          <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {finalAmenities.map((amenity, i) => (
              <div key={i} className="trust-item" style={{ padding: '14px 18px', borderRadius: '10px', border: '1px solid var(--line)', background: '#fff', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#efeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--indigo)', fontSize: '16px', flexShrink: 0 }}>
                  ✦
                </div>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)' }}>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Location Highlights & Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Highlights */}
          <div className="project-section-card" style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '28px', boxShadow: '0 10px 30px rgba(20,20,60,.03)' }}>
            <h2 style={{ fontFamily: 'Poppins,Inter,sans-serif', fontSize: '18px', fontWeight: 800, color: 'var(--text)', marginBottom: '16px' }}>
              Location Highlights
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {finalHighlights.map((item, i) => (
                <div key={i} style={{ fontSize: '13px', color: 'var(--gray)', display: 'flex', gap: '8px', alignItems: 'start' }}>
                  <span style={{ color: '#2f9e5c', fontWeight: 'bold' }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium CTA box */}
          <div style={{
            background: 'linear-gradient(120deg,#3a2fb8,#5b4fe0 60%,#7a3fd6)',
            borderRadius: '16px',
            padding: '28px',
            color: '#fff',
          }}>
            <h3 style={{ fontFamily: 'Poppins,Inter,sans-serif', fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>
              Interested in this project?
            </h3>
            <p style={{ fontSize: '13px', color: '#d8d4ff', marginBottom: '20px', lineHeight: 1.6 }}>
              Our dedicated relationship managers will guide you through site visits, layout maps, and plot bookings.
            </p>
            <a href="tel:+917000012345" className="btn-gold" style={{ border: 'none', width: '100%', justifyContent: 'center', padding: '12px', textDecoration: 'none' }}>
              📞 Call +91 70000 12345
            </a>
          </div>

        </div>
      </div>

      {/* Layout Plan Map Section */}
      {project.layoutImage && (
        <div className="project-section-card" style={{
          background: '#fff',
          border: '1px solid var(--line)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 10px 30px rgba(20,20,60,.03)',
          marginTop: '32px',
        }}>
          <h2 style={{ fontFamily: 'Poppins,Inter,sans-serif', fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '12px' }}>
            Master Layout Plan
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '20px' }}>
            Official layout map configuration and boundary divisions for {project.name}.
          </p>
          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid var(--line)',
            background: '#f7f7fb',
            maxHeight: '500px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
          }}>
            <img src={getImageUrl(project.layoutImage)} alt="Master Layout Plan" style={{ maxWidth: '100%', maxHeight: '468px', objectFit: 'contain' }} />
          </div>
        </div>
      )}
    </div>
  );
}
