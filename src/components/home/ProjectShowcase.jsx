import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuHouse, LuRuler } from 'react-icons/lu';
import { getProjects } from '../../api/projects';

export default function ProjectShowcase() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data: res } = await getProjects({ featured: true, limit: 4 });
        let items = res?.data || [];
        // Fallback to latest projects if no featured ones are marked yet
        if (items.length === 0) {
          const { data: fallbackRes } = await getProjects({ limit: 4 });
          items = fallbackRes?.data || [];
        }
        setProjects(items);
      } catch (err) {
        console.error('Failed to fetch showcase projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const getStatusTag = (status) => {
    switch (status) {
      case 'upcoming':
        return { text: 'New Launch', className: 'new' };
      case 'ongoing':
        return { text: 'Ongoing', className: 'premium' };
      case 'completed':
        return { text: 'Ready to Move', className: 'luxury' };
      default:
        return { text: 'Featured', className: 'best' };
    }
  };

  if (loading) {
    return (
      <section className="section" id="projects">
        <div className="wrap">
          <span className="eyebrow">PREMIUM PROJECTS</span>
          <div className="sec-head">
            <div>
              <h2>Our Featured Projects</h2>
              <p>Discover premium properties with world-class amenities and smart investment opportunities.</p>
            </div>
            <Link to="/projects" className="btn-line">View All Projects →</Link>
          </div>
          <div className="projects-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="pcard animate-pulse bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="thumb bg-slate-200 h-[240px]" />
                <div className="body p-5 space-y-4">
                  <div className="h-6 w-3/4 bg-slate-200 rounded" />
                  <div className="h-4 w-1/2 bg-slate-200 rounded" />
                  <div className="h-5 w-1/3 bg-slate-200 rounded" />
                  <div className="h-8 w-full bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="projects">
      <div className="wrap">
        <span className="eyebrow">PREMIUM PROJECTS</span>
        <div className="sec-head">
          <div>
            <h2>Our Featured Projects</h2>
            <p>Discover premium properties with world-class amenities and smart investment opportunities.</p>
          </div>
          <Link to="/projects" className="btn-line">View All Projects →</Link>
        </div>

        <div className="projects-grid">
          {projects.map((p) => {
            const tagInfo = getStatusTag(p.status);
            const imageSrc = p.images?.[0]
              ? (p.images[0].startsWith('http') ? p.images[0] : `/${p.images[0]}`)
              : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80&auto=format&fit=crop';

            return (
              <div key={p._id} className="pcard">
                <div className="thumb">
                  <img
                    src={imageSrc}
                    alt={`${p.name} project visual`}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span className={`tag ${tagInfo.className}`}>{tagInfo.text}</span>
                </div>
                <div className="body">
                  <h4>{p.name}</h4>
                  <div className="loc">
                    {[p.location?.city, p.location?.state].filter(Boolean).join(', ') || p.location?.address || 'Odisha, India'}
                  </div>
                  <div className="price-row">
                    <span className="price">
                      {p.pricePerSqft ? `₹${p.pricePerSqft}/Sq.ft` : 'Contact for Price'}
                    </span>
                    {p.pricePerSqft && <span className="onwards">Onwards</span>}
                  </div>
                  <div className="meta">
                    <span className="flex items-center gap-1">
                      <LuHouse size={14} className="text-slate-400" />
                      <span className="capitalize">{p.type?.replace(/_/g, ' ') || 'Property'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <LuRuler size={14} className="text-slate-400" />
                      {p.totalArea ? `${p.totalArea.toLocaleString()} Sq.ft.` : 'Various Sizes'}
                    </span>
                  </div>
                  <Link to={`/projects/${p.slug}`} className="vdbtn">
                    View Details <span className="go">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
