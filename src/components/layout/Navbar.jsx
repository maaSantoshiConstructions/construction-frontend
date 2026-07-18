import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

import NavbarLogo from './navbar/NavbarLogo';
import MobileDrawer from './navbar/MobileDrawer';
import ScrollToTop from './navbar/ScrollToTop';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, getRedirectPath } = useAuth();

  const isActive = (path) => location.pathname === path;
  const dashboardPath = user ? getRedirectPath(user.role) : '/login';

  return (
    <>
      {/* Self-contained responsive overrides */}
      <style>{`
        @media (max-width: 1100px) {
          .hamburger-btn {
            display: flex !important;
          }
          .cta-btn-desktop {
            display: none !important;
          }
        }
      `}</style>

      <header>
        <div className="nav" style={{ position: 'relative', zIndex: 1015 }}>
          {/* Brand */}
          <NavbarLogo onClick={() => setMobileOpen(false)} />

          {/* Desktop Nav */}
          <nav className="links">
            <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
            <Link to="/projects" className={isActive('/projects') ? 'active' : ''}>Projects</Link>
            <Link to="/smart-features" className={isActive('/smart-features') ? 'active' : ''}>20 Smart Features</Link>
            <Link to="/calculators" className={isActive('/calculators') ? 'active' : ''}>Calculators</Link>
            <Link to={dashboardPath}>Owner Portal</Link>
            <Link to="/about" className={isActive('/about') ? 'active' : ''}>About Us</Link>
            <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link>
          </nav>

          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Desktop CTA */}
            <Link to="/book-visit" className="cta-btn cta-btn-desktop">Enquire Now →</Link>

            {/* Hamburger for Mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="hamburger-btn"
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '22px',
                cursor: 'pointer',
                display: 'none',
                outline: 'none',
                padding: '6px',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1020,
              }}
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileDrawer
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isActive={isActive}
        dashboardPath={dashboardPath}
      />

      {/* Scroll to top button */}
      <ScrollToTop />
    </>
  );
}
