import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import { FaRobot, FaCalendarCheck, FaBars } from 'react-icons/fa';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openModal } = useModal();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  const scrollTo = (id) => {
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#' + id;
    }
    setMobileOpen(false);
  };

  return (
    <nav id="navbar"
      className={`bg-white border-b border-slate-200 sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg bg-white/98 backdrop-blur-md' : ''}`}>
      <div className="max-w-screen-2xl mx-auto">
        <div className="px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-x-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-700 to-slate-900 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-white text-3xl font-bold tracking-tighter">JSM</span>
            </div>
            <div>
              <div className="font-bold text-2xl tracking-tighter text-slate-900">Jai Santoshi Maa</div>
              <div className="text-[10px] text-slate-500 -mt-1 font-medium tracking-[1.5px]">INFRASTRUCTURE PVT. LTD.</div>
            </div>
          </Link>

          {/* Desktop Menu - exactly like index.html */}
          <div className="hidden md:flex items-center gap-x-8 text-sm font-medium">
            <button onClick={() => scrollTo('projects')} className="hover:text-blue-600 transition-colors cursor-pointer">Our Projects</button>
            <button onClick={() => scrollTo('features')} className="hover:text-blue-600 transition-colors cursor-pointer">25 Smart Features</button>
            <button onClick={() => scrollTo('calculators-section')} className="hover:text-blue-600 transition-colors cursor-pointer">Calculators</button>
            <button onClick={() => openModal('dashboard')} className="hover:text-blue-600 transition-colors cursor-pointer">Owner Portal</button>
          </div>

          <div className="flex items-center gap-x-3">
            {/* AI Property Match - opens modal like index.html */}
            <button onClick={() => openModal('ai')}
              className="hidden md:flex items-center gap-x-2 px-5 py-2.5 text-sm font-semibold bg-white border border-slate-300 hover:bg-slate-50 rounded-3xl transition-all active:scale-[0.985] cursor-pointer">
              <FaRobot className="text-blue-600" />
              <span>AI Property Match</span>
            </button>

            {/* Book Site Visit - opens modal like index.html */}
            <button onClick={() => openModal('visit')}
              className="px-6 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-3xl transition-all flex items-center gap-x-2 shadow-lg shadow-blue-600/30 active:scale-[0.985] cursor-pointer">
              <FaCalendarCheck />
              <span>Book Site Visit</span>
            </button>

            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer">
              <FaBars className="text-xl" />
            </button>
          </div>
        </div>

        {/* Mobile Menu - exactly like index.html */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-white px-6 py-4">
            <div className="flex flex-col gap-y-1 text-sm font-medium">
              <button onClick={() => scrollTo('projects')} className="py-2.5 px-3 hover:bg-slate-100 rounded-2xl text-left cursor-pointer">Our Projects</button>
              <button onClick={() => scrollTo('features')} className="py-2.5 px-3 hover:bg-slate-100 rounded-2xl text-left cursor-pointer">25 Smart Features</button>
              <button onClick={() => scrollTo('calculators-section')} className="py-2.5 px-3 hover:bg-slate-100 rounded-2xl text-left cursor-pointer">Calculators</button>
              <button onClick={() => { openModal('dashboard'); setMobileOpen(false); }} className="py-2.5 px-3 hover:bg-slate-100 rounded-2xl text-left cursor-pointer">Owner Portal</button>
              <div className="pt-3 border-t flex flex-col gap-y-2">
                <button onClick={() => { openModal('ai'); setMobileOpen(false); }}
                  className="w-full py-3 text-center bg-white border border-slate-300 text-sm font-semibold rounded-3xl cursor-pointer">
                  AI Property Match
                </button>
                <button onClick={() => { openModal('visit'); setMobileOpen(false); }}
                  className="w-full py-3 text-center bg-blue-600 text-white text-sm font-semibold rounded-3xl cursor-pointer">
                  Book Site Visit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
