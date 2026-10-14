import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LuMenu, LuX } from 'react-icons/lu';

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
      <header className="bg-[#051408]/95 backdrop-blur-md sticky top-0 z-[1100] border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between relative z-[1015]">
          {/* Brand */}
          <NavbarLogo onClick={() => setMobileOpen(false)} />

          {/* Desktop Nav */}
          <nav className="hidden min-[1101px]:flex items-center gap-1">
            {[
              { path: '/', label: 'Home' },
              { path: '/projects', label: 'Projects' },
              { path: '/smart-features', label: 'Smart Features' },
              { path: '/calculators', label: 'Calculators' },
              { path: dashboardPath, label: 'Owner Portal' },
              { path: '/about', label: 'About Us' },
              { path: '/contact', label: 'Contact' },
            ].map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all no-underline ${
                    active
                      ? '!bg-emerald-500/20 !text-amber-300 border border-emerald-400/30 font-bold shadow-xs'
                      : '!text-slate-200 hover:!text-white hover:!bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Row */}
          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <Link to="/book-visit" className="cta-btn !hidden min-[1101px]:!flex items-center gap-2">
              Enquire Now →
            </Link>

            {/* Hamburger for Mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="min-[1101px]:hidden bg-transparent border-0 text-white text-2xl cursor-pointer outline-none p-1.5 flex items-center justify-center relative z-[1020]"
              aria-label="Toggle Mobile Navigation Menu"
            >
              {mobileOpen ? <LuX /> : <LuMenu />}
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
