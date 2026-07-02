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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-slate-200/50' : 'bg-transparent'}`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-x-3">
            <div className={`bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 transition-all duration-500 ${scrolled ? 'w-8 h-8' : 'w-10 h-10'}`}>
              <span className={`text-white font-bold tracking-tighter font-heading transition-all duration-500 ${scrolled ? 'text-lg' : 'text-2xl'}`}>JSM</span>
            </div>
            <div className="hidden sm:block">
              <div className={`font-bold tracking-tighter transition-all duration-500 ${scrolled ? 'text-base text-slate-900' : 'text-lg text-white'}`}>Jai Santoshi Maa</div>
              <div className={`text-[9px] -mt-0.5 font-medium tracking-[1.5px] transition-all duration-500 ${scrolled ? 'text-slate-400' : 'text-white/60'}`}>INFRASTRUCTURE PVT. LTD.</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className={`hidden md:flex items-center gap-x-1 text-sm font-medium transition-all duration-500 ${scrolled ? 'text-slate-600' : 'text-white/80'}`}>
            {[
              ['Our Projects', () => scrollTo('projects')],
              ['25 Smart Features', () => scrollTo('features')],
              ['Calculators', () => scrollTo('calculators-section')],
              ['Owner Portal', () => openModal('dashboard')],
            ].map(([label, onClick], i) => (
              <button key={i} onClick={onClick}
                className={`px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer ${scrolled ? 'hover:bg-slate-100/80 hover:text-slate-900' : 'hover:bg-white/10 hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-x-3">
            <button onClick={() => openModal('ai')}
              className={`hidden md:flex items-center gap-x-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${scrolled ? 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 hover:border-orange-200 hover:from-orange-100 hover:to-amber-100 text-slate-700' : 'bg-white/10 border border-white/20 hover:bg-white/20 text-white'}`}>
              <FaRobot className={scrolled ? 'text-orange-500' : 'text-white/80'} />
              <span>AI Property Match</span>
            </button>

            <button onClick={() => openModal('visit')}
              className={`text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-x-2 cursor-pointer active:scale-[0.98] ${scrolled ? 'px-5 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg shadow-orange-500/20' : 'px-5 py-2 bg-white/20 border border-white/30 hover:bg-white/30 text-white'}`}>
              <FaCalendarCheck />
              <span>Book Site Visit</span>
            </button>

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${scrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}>
              <FaBars className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={`md:hidden border-t px-4 sm:px-6 py-4 ${scrolled ? 'bg-white border-slate-100' : 'bg-slate-900/95 backdrop-blur-xl border-white/10'}`}>
          <div className="flex flex-col gap-y-1 text-sm font-medium">
            {[
              ['Our Projects', () => scrollTo('projects')],
              ['25 Smart Features', () => scrollTo('features')],
              ['Calculators', () => scrollTo('calculators-section')],
              ['Owner Portal', () => { openModal('dashboard'); setMobileOpen(false); }],
            ].map(([label, onClick], i) => (
              <button key={i} onClick={onClick}
                className={`py-2.5 px-3 rounded-xl text-left cursor-pointer transition-colors ${scrolled ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                {label}
              </button>
            ))}
            <div className={`pt-3 flex flex-col gap-y-2 ${scrolled ? 'border-t border-slate-100' : 'border-t border-white/10'}`}>
              <button onClick={() => { openModal('ai'); setMobileOpen(false); }}
                className={`w-full py-3 text-center text-sm font-semibold rounded-xl cursor-pointer ${scrolled ? 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 text-slate-700' : 'bg-white/10 border border-white/20 text-white'}`}>
                <FaRobot className="inline mr-2 text-orange-500" /> AI Property Match
              </button>
              <button onClick={() => { openModal('visit'); setMobileOpen(false); }}
                className={`w-full py-3 text-center text-sm font-semibold rounded-xl cursor-pointer ${scrolled ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg shadow-orange-500/20' : 'bg-white/20 border border-white/30 text-white'}`}>
                <FaCalendarCheck className="inline mr-2" /> Book Site Visit
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
