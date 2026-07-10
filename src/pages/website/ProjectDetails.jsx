import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject } from '../../api/projects';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const statusColors = {
  upcoming: { bg: '#fff2e6', text: '#d99f36' },
  ongoing: { bg: '#efeafe', text: '#5b4fe0' },
  completed: { bg: '#eefcf3', text: '#2f9e5c' },
};

export default function ProjectDetails() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getProject(slug);
      setProject(data?.data || data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [slug]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProject} />;
  if (!project) return <ErrorMessage message="Project not found" />;

  const getImageUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
      return img;
    }
    const backendUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:5002'
      : 'https://construction-backend-96b8.onrender.com';
    return `${backendUrl}/${img.replace(/^\//, '')}`;
  };

  const images = project.images?.length > 0 
    ? project.images.map(img => getImageUrl(img)) 
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200'];
  const rera = project.reraNumber || 'Applied / Pending';

  // Format price
  const formattedPrice = project.pricePerSqft
    ? `₹${project.pricePerSqft} / Sq.ft`
    : 'Contact for Price';

  // Location string helper
  const locationStr = typeof project.location === 'object'
    ? `${project.location.address || ''}, ${project.location.city || ''}, ${project.location.state || ''}`.replace(/(^,\s*)|(,\s*$)/g, '')
    : project.location || 'Bhubaneswar, Odisha';

  const finalAmenities = project.amenities?.length > 0
    ? project.amenities
    : ['Landscaped Gardens', '24/7 Security', 'Electricity Connection', 'Water Supply', 'Concrete Roads', 'Street Lights'];

  const finalHighlights = project.highlights?.length > 0
    ? project.highlights
    : [
        'Direct access to National Highway',
        '15 minutes from nearest Railway Station',
        'Close proximity to top schools & engineering colleges',
        '5 km from upcoming IT parks & shopping centers',
        'Quiet residential area with high growth prospects',
      ];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Project link copied to clipboard!');
  };

  return (
    <div style={{ background: '#f7f7fb', minHeight: '100vh', paddingBottom: '90px' }}>
      
      {/* ===== BREADCRUMB ===== */}
      <div className="wrap" style={{ paddingTop: '24px', paddingBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: 'var(--gray)', display: 'flex', gap: '8px' }}>
          <Link to="/" style={{ color: 'var(--indigo)', fontWeight: 600 }}>Home</Link> /
          <Link to="/projects" style={{ color: 'var(--indigo)', fontWeight: 600 }}>Projects</Link> /
          <span style={{ color: 'var(--text)' }}>{project.name}</span>
        </div>
      </div>

      {/* ===== MAIN COMPONENT ===== */}
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
        }} className="project-detail-grid">
          
          {/* Left: Photos */}
          <div>
            <div style={{
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
            <h1 style={{ fontFamily: 'Poppins,Inter,sans-serif', fontSize: '32px', fontWeight: 800, color: 'var(--text)', margin: '4px 0 8px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '28px' }}>
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
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to={`/plot-map?project=${project.slug}`} className="btn-gold" style={{ fontSize: '13.5px', padding: '12px 24px', border: 'none' }}>
                🗺 View Live Plot Map
              </Link>
              <Link to="/book-visit" className="btn-outline" style={{ fontSize: '13.5px', padding: '12px 24px', color: 'var(--text)', borderColor: 'var(--line)', background: '#fff' }}>
                📅 Schedule Site Visit
              </Link>
              <button onClick={handleShare} style={{ width: '42px', height: '42px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }} title="Share project">
                🔗
              </button>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM DETAILS GRID ===== */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '32px' }} className="project-detail-grid">
          {/* Amenities */}
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 30px rgba(20,20,60,.03)' }}>
            <h2 style={{ fontFamily: 'Poppins,Inter,sans-serif', fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '20px' }}>
              Project Amenities
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '28px', boxShadow: '0 10px 30px rgba(20,20,60,.03)' }}>
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
              <a href="tel:+917000012345" className="btn-gold" style={{ border: 'none', width: '100%', justifyContent: 'center', padding: '12px' }}>
                📞 Call +91 70000 12345
              </a>
            </div>

          </div>
        </div>

        {/* Layout Plan Map Section */}
        {project.layoutImage && (
          <div style={{
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

      <style>{`
        @media(max-width:991px){
          .project-detail-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </div>
  );
}
