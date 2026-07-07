import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

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
          <Link to="/" className="brand" onClick={() => setMobileOpen(false)}>
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
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: '#090c24',
                zIndex: 1000,
                backdropFilter: 'blur(4px)',
              }}
            />

            {/* Slide-out Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '280px',
                background: '#0b0f2e',
                borderLeft: '1px solid rgba(255,255,255,0.06)',
                zIndex: 1005,
                boxShadow: '-10px 0 30px rgba(0,0,0,0.3)',
                padding: '80px 24px 32px',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
              }}
            >
              {/* Close Button Inside Drawer */}
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '24px',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '20px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <FaTimes />
              </button>

              {/* Navigation Links inside Drawer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    color: isActive('/') ? '#fff' : '#d7d9ec',
                    background: isActive('/') ? 'var(--indigo-light)' : 'transparent',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                    transition: 'all 0.2s',
                  }}
                >
                  Home
                </Link>
                <Link
                  to="/projects"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    color: isActive('/projects') ? '#fff' : '#d7d9ec',
                    background: isActive('/projects') ? 'var(--indigo-light)' : 'transparent',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                    transition: 'all 0.2s',
                  }}
                >
                  Projects
                </Link>
                <Link
                  to="/smart-features"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    color: isActive('/smart-features') ? '#fff' : '#d7d9ec',
                    background: isActive('/smart-features') ? 'var(--indigo-light)' : 'transparent',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                    transition: 'all 0.2s',
                  }}
                >
                  20 Smart Features
                </Link>
                <Link
                  to="/calculators"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    color: isActive('/calculators') ? '#fff' : '#d7d9ec',
                    background: isActive('/calculators') ? 'var(--indigo-light)' : 'transparent',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                    transition: 'all 0.2s',
                  }}
                >
                  Calculators
                </Link>
                <Link
                  to={dashboardPath}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    color: isActive(dashboardPath) ? '#fff' : '#d7d9ec',
                    background: isActive(dashboardPath) ? 'var(--indigo-light)' : 'transparent',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                    transition: 'all 0.2s',
                  }}
                >
                  Owner Portal
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    color: isActive('/about') ? '#fff' : '#d7d9ec',
                    background: isActive('/about') ? 'var(--indigo-light)' : 'transparent',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                    transition: 'all 0.2s',
                  }}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    color: isActive('/contact') ? '#fff' : '#d7d9ec',
                    background: isActive('/contact') ? 'var(--indigo-light)' : 'transparent',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                    transition: 'all 0.2s',
                  }}
                >
                  Contact
                </Link>
              </div>

              {/* CTA at Bottom of Drawer */}
              <Link
                to="/book-visit"
                onClick={() => setMobileOpen(false)}
                className="cta-btn"
                style={{
                  textAlign: 'center',
                  display: 'block',
                  padding: '14px',
                  borderRadius: '30px',
                  fontWeight: 700,
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Enquire Now →
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Scroll to top button */}
      <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
    </>
  );
}
