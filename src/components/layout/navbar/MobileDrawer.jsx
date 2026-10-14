import React from 'react';
import { Link } from 'react-router-dom';
import { LuX } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import constructionLogo from '../../../assets/construction logo.png';

export default function MobileDrawer({
  mobileOpen = false,
  setMobileOpen,
  isActive,
  dashboardPath,
}) {
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/smart-features', label: 'Smart Features' },
    { path: '/calculators', label: 'Calculators' },
    { path: dashboardPath, label: 'Owner Portal' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-[2000]"
          />

          {/* Slide-out Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#0d1f0d] border-l border-white/10 z-[2005] shadow-2xl p-6 pt-20 flex flex-col box-border"
          >
            {/* Close Button Inside Drawer */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-6 bg-transparent border-0 text-white text-2xl cursor-pointer outline-none hover:text-amber-400 transition-colors"
              aria-label="Close Navigation Drawer"
            >
              <LuX />
            </button>

            {/* Logo at top of drawer */}
            <div className="flex justify-center mb-6">
              <img
                src={constructionLogo}
                alt="JSMIL Logo"
                className="h-[90px] w-auto object-contain"
              />
            </div>

            {/* Navigation Links inside Drawer */}
            <div className="flex flex-col gap-2 flex-1">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    style={{ color: '#ffffff' }}
                    className={`px-4 py-3 rounded-xl text-[15px] font-bold transition-all no-underline !text-white flex items-center justify-between ${
                      active
                        ? 'bg-green-700 !text-white shadow-md shadow-green-700/30'
                        : 'hover:bg-white/10 hover:!text-amber-300'
                    }`}
                  >
                    <span className="!text-white" style={{ color: '#ffffff' }}>
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* CTA at Bottom of Drawer */}
            <Link
              to="/book-visit"
              onClick={() => setMobileOpen(false)}
              className="text-center block py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 transition-all shadow-md no-underline border-0 mt-4"
            >
              Enquire Now →
            </Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
