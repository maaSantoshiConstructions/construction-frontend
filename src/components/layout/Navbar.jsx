import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header>
        <div className="nav">
          {/* Brand */}
          <Link to="/" className="brand">
            <div className="brand-icon">JS</div>
            <div className="brand-text">
              <div className="l1">JAI SANTOSHI MAA</div>
              <div className="l2">INFRASTRUCTURE PVT. LTD.</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="links">
            <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
            <Link to="/projects" className={isActive('/projects') ? 'active' : ''}>Projects</Link>
            <button onClick={() => scrollTo('features')} style={{ background: 'none', border: 'none', color: '#d7d9ec', fontSize: '14px', padding: '9px 16px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'inherit', transition: '.2s' }}>
              20 Smart Features
            </button>
            <button onClick={() => scrollTo('calculators')} style={{ background: 'none', border: 'none', color: '#d7d9ec', fontSize: '14px', padding: '9px 16px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'inherit', transition: '.2s' }}>
              Calculators
            </button>
            <Link to="/customer/dashboard">Owner Portal</Link>
            <Link to="/about" className={isActive('/about') ? 'active' : ''}>About Us</Link>
            <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link>
          </nav>

          {/* CTA */}
          <Link to="/book-visit" className="cta-btn">Enquire Now →</Link>
        </div>
      </header>

      {/* Scroll to top button */}
      <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
    </>
  );
}
