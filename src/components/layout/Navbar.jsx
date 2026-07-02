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
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-screen-2xl transition-all duration-500 ${scrolled ? 'top-2' : 'top-4'}`}>
      <div className={`rounded-2xl transition-all duration-500 ${scrolled ? 'glass shadow-lg shadow-black/5' : 'bg-white/70 backdrop-blur-md border border-white/20 shadow-sm'}`}>
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white text-2xl font-bold tracking-tighter font-heading">JSM</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg tracking-tighter text-slate-900">Jai Santoshi Maa</div>
              <div className="text-[9px] text-slate-400 -mt-0.5 font-medium tracking-[1.5px]">INFRASTRUCTURE PVT. LTD.</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-x-1 text-sm font-medium">
            {[
              ['Our Projects', () => scrollTo('projects')],
              ['25 Smart Features', () => scrollTo('features')],
              ['Calculators', () => scrollTo('calculators-section')],
              ['Owner Portal', () => openModal('dashboard')],
            ].map(([label, onClick], i) => (
              <button key={i} onClick={onClick}
                className="px-4 py-2 rounded-xl hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 transition-all duration-200 cursor-pointer">
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-x-3">
            <button onClick={() => openModal('ai')}
              className="hidden md:flex items-center gap-x-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 hover:border-blue-200 hover:from-blue-100 hover:to-purple-100 rounded-xl transition-all duration-200 cursor-pointer text-slate-700">
              <FaRobot className="text-blue-500" />
              <span>AI Property Match</span>
            </button>

            <button onClick={() => openModal('visit')}
              className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 flex items-center gap-x-2 shadow-lg shadow-blue-500/20 cursor-pointer active:scale-[0.98]">
              <FaCalendarCheck />
              <span>Book Site Visit</span>
            </button>

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all cursor-pointer">
              <FaBars className="text-lg" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 px-6 py-4">
            <div className="flex flex-col gap-y-1 text-sm font-medium">
              <button onClick={() => scrollTo('projects')} className="py-2.5 px-3 hover:bg-slate-100 rounded-xl text-left cursor-pointer text-slate-600 hover:text-slate-900 transition-colors">Our Projects</button>
              <button onClick={() => scrollTo('features')} className="py-2.5 px-3 hover:bg-slate-100 rounded-xl text-left cursor-pointer text-slate-600 hover:text-slate-900 transition-colors">25 Smart Features</button>
              <button onClick={() => scrollTo('calculators-section')} className="py-2.5 px-3 hover:bg-slate-100 rounded-xl text-left cursor-pointer text-slate-600 hover:text-slate-900 transition-colors">Calculators</button>
              <button onClick={() => { openModal('dashboard'); setMobileOpen(false); }} className="py-2.5 px-3 hover:bg-slate-100 rounded-xl text-left cursor-pointer text-slate-600 hover:text-slate-900 transition-colors">Owner Portal</button>
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-y-2">
                <button onClick={() => { openModal('ai'); setMobileOpen(false); }}
                  className="w-full py-3 text-center bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 text-sm font-semibold rounded-xl cursor-pointer text-slate-700">
                  <FaRobot className="inline mr-2 text-blue-500" /> AI Property Match
                </button>
                <button onClick={() => { openModal('visit'); setMobileOpen(false); }}
                  className="w-full py-3 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl cursor-pointer shadow-lg shadow-blue-500/20">
                  <FaCalendarCheck className="inline mr-2" /> Book Site Visit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
