import React from 'react';
import { Link } from 'react-router-dom';
import { LuHouse, LuRuler } from 'react-icons/lu';

export default function ProjectShowcase() {
  const projects = [
    {
      id: 1,
      title: 'Green City',
      location: 'Bhubaneswar, Odisha',
      price: '₹9.99 Lakh*',
      sizes: '1200 - 2400 Sq.ft.',
      tag: 'Premium',
      tagClass: 'premium',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'Royal Enclave',
      location: 'Cuttack, Odisha',
      price: '₹14.50 Lakh*',
      sizes: '1500 - 3000 Sq.ft.',
      tag: 'Best Seller',
      tagClass: 'best',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80&auto=format&fit=crop',
    },
    {
      id: 3,
      title: 'Silver Spring',
      location: 'Puri, Odisha',
      price: '₹11.75 Lakh*',
      sizes: '1500 - 3000 Sq.ft.',
      tag: 'Luxury',
      tagClass: 'luxury',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80&auto=format&fit=crop',
    },
    {
      id: 4,
      title: 'Sunrise Meadows',
      location: 'Khordha, Odisha',
      price: '₹8.75 Lakh*',
      sizes: '1000 - 2000 Sq.ft.',
      tag: 'New Launch',
      tagClass: 'new',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80&auto=format&fit=crop',
    },
  ];

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
          {projects.map((p) => (
            <div key={p.id} className="pcard">
              <div className={`thumb t${p.id}`}>
                <img
                  src={p.image}
                  alt={`${p.title} plot visual`}
                  loading="lazy"
                  onError={(e) => e.target.remove()}
                />
                <span className={`tag ${p.tagClass}`}>{p.tag}</span>
              </div>
              <div className="body">
                <h4>{p.title}</h4>
                <div className="loc">{p.location}</div>
                <div className="price-row">
                  <span className="price">{p.price}</span>
                  <span className="onwards">Onwards</span>
                </div>
                <div className="meta">
                  <span className="flex items-center gap-1"><LuHouse size={14} className="text-slate-400" /> Residential Plot</span>
                  <span className="flex items-center gap-1"><LuRuler size={14} className="text-slate-400" /> {p.sizes}</span>
                </div>
                <Link to="/projects" className="vdbtn">View Details <span className="go">→</span></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
