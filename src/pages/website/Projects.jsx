import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getProjects } from '../../api/projects';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

const statusFilters = ['all', 'upcoming', 'ongoing', 'completed'];
const typeFilters = ['all', 'plotted_development', 'villas', 'apartments'];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.type = typeFilter;
      const { data } = await getProjects(params);
      setProjects(data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter, typeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

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

  const statusColors = {
    upcoming: { bg: '#fff2e6', text: '#d99f36' },
    ongoing: { bg: '#efeafe', text: '#5b4fe0' },
    completed: { bg: '#eefcf3', text: '#2f9e5c' },
  };

  return (
    <div style={{ background: 'var(--white)', minHeight: '100vh' }}>

      {/* ===== HEADER ===== */}
      <div style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(91,79,224,.35), transparent 55%), linear-gradient(120deg,#0b0f2e 0%,#161b45 55%,#1c1450 100%)',
        padding: '64px 0 60px',
        textAlign: 'center',
      }}>
        <div className="wrap">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>PREMIUM PROPERTIES</span>
          <h1 style={{ fontFamily: 'Poppins,Inter,sans-serif', fontSize: '42px', fontWeight: 800, color: '#fff', margin: '12px 0 14px' }}>
            Our Projects
          </h1>
          <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            Discover premium residential plots, luxury villas, and apartments across prime locations in Odisha.
          </p>
        </div>
      </div>

      {/* ===== SEARCH & FILTER BAR ===== */}
      <div className="wrap" style={{ marginTop: '-36px', paddingBottom: '90px' }}>
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid var(--line)',
          boxShadow: '0 15px 40px rgba(20,20,60,.1)',
          padding: '24px',
          marginBottom: '40px',
        }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '12px' }} className="search-row-el">
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="🔍 Search projects by name, city, location..."
                  style={{
                    width: '100%', padding: '12px 16px', border: '1px solid var(--line)',
                    borderRadius: '10px', fontSize: '14px', color: 'var(--text)',
                    outline: 'none', background: '#fff', fontFamily: 'Inter,sans-serif', boxSizing: 'border-box'
                  }}
                />
              </div>
              <button type="submit" className="btn-gold" style={{ border: 'none', padding: '12px 28px', fontSize: '14px' }}>
                Search
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '28px', borderTop: '1px solid var(--line)', paddingTop: '20px' }}>
              {/* Status Filter */}
              <div>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--gray)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: '8px' }}>Project Status</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {statusFilters.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatusFilter(s)}
                      style={{
                        padding: '6px 14px', borderRadius: '20px', border: 'none', fontSize: '12.5px', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit', transition: '.15s',
                        background: statusFilter === s ? 'var(--indigo)' : '#f0f0f6',
                        color: statusFilter === s ? '#fff' : 'var(--text)',
                      }}
                    >
                      {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--gray)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: '8px' }}>Property Type</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {typeFilters.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTypeFilter(t)}
                      style={{
                        padding: '6px 14px', borderRadius: '20px', border: 'none', fontSize: '12.5px', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit', transition: '.15s',
                        background: typeFilter === t ? 'var(--indigo)' : '#f0f0f6',
                        color: typeFilter === t ? '#fff' : 'var(--text)',
                      }}
                    >
                      {t === 'all' ? 'All' : t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* ===== PROJECTS GRID ===== */}
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchProjects} />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects found"
            description={search ? 'Try checking your search query or filters.' : 'We are launching new properties soon.'}
          />
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project._id} className="pcard" style={{ background: '#fff' }}>
                <div className="thumb">
                  <img
                    src={getImageUrl(project.image || (project.images && project.images[0])) || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600'}
                    alt={project.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.parentElement.style.background = 'linear-gradient(135deg,#3a3f6b,#7d7aa3)';
                      e.target.remove();
                    }}
                  />
                  {project.status && (
                    <span className="tag" style={{
                      background: statusColors[project.status]?.bg || '#f0f0f6',
                      color: statusColors[project.status]?.text || 'var(--text)',
                      textTransform: 'uppercase',
                      letterSpacing: '.5px',
                    }}>
                      {project.status}
                    </span>
                  )}
                </div>
                <div className="body">
                  <h4>{project.name}</h4>
                  <div className="loc">{project.location?.city ? `${project.location.address || ''}, ${project.location.city}` : project.location || '-'}</div>
                  <p style={{ fontSize: '13px', color: 'var(--gray)', minHeight: '38px', lineHeight: 1.5, margin: '8px 0 16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description || 'Premium real estate development with smart features, green parks, security, and electricity connectivity.'}
                  </p>
                  <div className="price-row" style={{ marginTop: '0', paddingTop: '12px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="from">Starting From</div>
                      <div className="price" style={{ fontSize: '18px', color: 'var(--indigo)' }}>
                        {project.pricePerSqft ? `₹${project.pricePerSqft}/Sq.ft` : 'Contact for Price'}
                      </div>
                    </div>
                    <RouterLink to={`/projects/${project.slug}`} className="vdbtn" style={{ margin: '0', textDecoration: 'none' }}>
                      View Project <span className="go">→</span>
                    </RouterLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
