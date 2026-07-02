import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaTimes, FaRobot, FaCalendarCheck, FaUser, FaSignOutAlt, FaChevronDown, FaStar, FaMapMarkedAlt, FaChartLine, FaCouch, FaCompass, FaWhatsapp, FaFire, FaComments } from 'react-icons/fa';

const featureLinks = [
  { path: '/ai-recommendation', label: 'AI Property Match', icon: FaRobot },
  { path: '/ai-chatbot', label: 'AI Sales Chatbot', icon: FaComments },
  { path: '/property-comparison', label: 'Property Comparison', icon: FaChartLine },
  { path: '/property-valuation', label: 'Property Valuation', icon: FaChartLine },
  { path: '/virtual-tour', label: 'Virtual Tour', icon: FaStar },
  { path: '/price-timer', label: 'Price Timer', icon: FaStar },
  { path: '/interior-visualizer', label: 'Interior Visualizer', icon: FaCouch },
  { path: '/plot-direction', label: 'Plot Direction', icon: FaCompass },
  { path: '/nearby-locations', label: 'Nearby Locations', icon: FaMapMarkedAlt },
  { path: '/reviews', label: 'Customer Reviews', icon: FaStar },
  { path: '/investment-heatmap', label: 'Investment Heatmap', icon: FaFire },
  { path: '/whatsapp-crm', label: 'WhatsApp CRM', icon: FaWhatsapp },
  { path: '/ai-followup', label: 'AI Follow-up', icon: FaRobot },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const { user, logout, getRedirectPath } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setFeaturesOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600';
  const isFeatureActive = featureLinks.some(f => location.pathname === f.path);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/plot-map', label: 'Plot Map' },
    { path: '/calculators', label: 'Calculators' },
    { path: '/blogs', label: 'Blogs' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'}`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-slate-900 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-white text-2xl font-bold tracking-tighter">JSM</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-xl tracking-tight text-slate-900">Jai Santoshi Maa</div>
              <div className="text-[9px] text-slate-500 -mt-0.5 font-medium tracking-widest">INFRASTRUCTURE PVT. LTD.</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className={`${isActive(link.path)} transition-colors`}>{link.label}</Link>
            ))}
            {/* Features Dropdown */}
            <div className="relative" onMouseEnter={() => setFeaturesOpen(true)} onMouseLeave={() => setFeaturesOpen(false)}>
              <button className={`flex items-center gap-1 transition-colors ${isFeatureActive ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'}`}>
                Smart Features <FaChevronDown className="text-[10px]" />
              </button>
              {featuresOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-white rounded-2xl shadow-xl border p-4 grid grid-cols-2 gap-1">
                  {featureLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${location.pathname === link.path ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      <link.icon className="text-blue-500 text-xs" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* AI Match Button - desktop */}
            <Link to="/ai-recommendation" className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white border border-slate-300 hover:bg-slate-50 rounded-full transition-all">
              <FaRobot className="text-blue-600" />
              <span>AI Match</span>
            </Link>

            {/* Book Visit - desktop */}
            <Link to="/book-visit" className="hidden lg:flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-lg shadow-blue-600/30">
              <FaCalendarCheck />
              <span>Book Site Visit</span>
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-100 transition">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <FaChevronDown className="text-xs text-slate-400" />
                </button>
                {userMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border py-2 text-sm">
                    <Link to={getRedirectPath(user.role)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50">
                      <FaUser className="text-blue-600" /> Dashboard
                    </Link>
                    <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 w-full text-left text-red-600">
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden lg:flex px-5 py-2 text-sm font-semibold border border-slate-300 rounded-full hover:bg-slate-50 transition">
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
              {open ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden border-t bg-white px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} onClick={() => setOpen(false)} className={`block py-2.5 px-3 rounded-xl ${isActive(link.path)}`}>{link.label}</Link>
          ))}
          {/* Mobile Features */}
          <div>
            <button
              onClick={() => setMobileFeaturesOpen(!mobileFeaturesOpen)}
              className="flex items-center justify-between w-full py-2.5 px-3 rounded-xl text-slate-600 hover:text-blue-600 font-medium"
            >
              Smart Features <FaChevronDown className={`text-xs transition-transform ${mobileFeaturesOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileFeaturesOpen && (
              <div className="pl-3 space-y-1 mt-1">
                {featureLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 py-2 px-3 rounded-xl text-sm ${location.pathname === link.path ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                  >
                    <link.icon className="text-blue-500 text-xs" />
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="pt-3 border-t space-y-2">
            <Link to="/ai-recommendation" onClick={() => setOpen(false)} className="block w-full text-center py-3 border rounded-full text-sm font-semibold">AI Property Match</Link>
            <Link to="/book-visit" onClick={() => setOpen(false)} className="block w-full text-center py-3 bg-blue-600 text-white rounded-full text-sm font-semibold">Book Site Visit</Link>
            {!user && <Link to="/login" onClick={() => setOpen(false)} className="block w-full text-center py-3 bg-slate-900 text-white rounded-full text-sm font-semibold">Sign In</Link>}
          </div>
        </div>
      )}
    </nav>
  );
}
