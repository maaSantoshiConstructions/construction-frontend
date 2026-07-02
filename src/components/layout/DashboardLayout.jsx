import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaBars, FaTimes, FaTachometerAlt, FaProjectDiagram, FaThLarge, FaBookOpen,
  FaUsers, FaUserTie, FaMoneyBillWave, FaFileAlt, FaCalendarCheck, FaHardHat,
  FaHandshake, FaStar, FaBlog, FaImages, FaQuestionCircle, FaCog, FaUserCog,
  FaSignOutAlt, FaBell, FaChevronDown, FaHome, FaComments, FaUserPlus,
  FaClipboardList, FaChartLine, FaBullhorn, FaTicketAlt, FaUser,
  FaArrowLeft, FaHandHoldingUsd
} from 'react-icons/fa';

const roleSidebarLinks = {
  super_admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
    { label: 'Projects', path: '/admin/projects', icon: FaProjectDiagram },
    { label: 'Plots', path: '/admin/plots', icon: FaThLarge },
    { label: 'Bookings', path: '/admin/bookings', icon: FaBookOpen },
    { label: 'Customers', path: '/admin/customers', icon: FaUsers },
    { label: 'Leads', path: '/admin/leads', icon: FaUserPlus },
    { label: 'Payments', path: '/admin/payments', icon: FaMoneyBillWave },
    { label: 'Documents', path: '/admin/documents', icon: FaFileAlt },
    { label: 'Site Visits', path: '/admin/site-visits', icon: FaCalendarCheck },
    { label: 'Construction Updates', path: '/admin/construction-updates', icon: FaHardHat },
    { label: 'Channel Partners', path: '/admin/channel-partners', icon: FaHandshake },
    { label: 'Reviews', path: '/admin/reviews', icon: FaStar },
    { label: 'Blogs', path: '/admin/blogs', icon: FaBlog },
    { label: 'Gallery', path: '/admin/gallery', icon: FaImages },
    { label: 'FAQs', path: '/admin/faqs', icon: FaQuestionCircle },
    { label: 'Settings', path: '/admin/settings', icon: FaCog },
    { label: 'Users', path: '/admin/users', icon: FaUserCog },
  ],
  company_admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
    { label: 'Projects', path: '/admin/projects', icon: FaProjectDiagram },
    { label: 'Plots', path: '/admin/plots', icon: FaThLarge },
    { label: 'Bookings', path: '/admin/bookings', icon: FaBookOpen },
    { label: 'Customers', path: '/admin/customers', icon: FaUsers },
    { label: 'Leads', path: '/admin/leads', icon: FaUserPlus },
    { label: 'Payments', path: '/admin/payments', icon: FaMoneyBillWave },
    { label: 'Documents', path: '/admin/documents', icon: FaFileAlt },
    { label: 'Site Visits', path: '/admin/site-visits', icon: FaCalendarCheck },
    { label: 'Construction Updates', path: '/admin/construction-updates', icon: FaHardHat },
    { label: 'Channel Partners', path: '/admin/channel-partners', icon: FaHandshake },
    { label: 'Reviews', path: '/admin/reviews', icon: FaStar },
    { label: 'Blogs', path: '/admin/blogs', icon: FaBlog },
    { label: 'Gallery', path: '/admin/gallery', icon: FaImages },
    { label: 'FAQs', path: '/admin/faqs', icon: FaQuestionCircle },
    { label: 'Settings', path: '/admin/settings', icon: FaCog },
  ],
  sales_executive: [
    { label: 'Dashboard', path: '/sales/dashboard', icon: FaTachometerAlt },
    { label: 'My Leads', path: '/sales/leads', icon: FaUserPlus },
    { label: 'Site Visits', path: '/sales/site-visits', icon: FaCalendarCheck },
    { label: 'Customers', path: '/sales/customers', icon: FaUsers },
  ],
  channel_partner: [
    { label: 'Dashboard', path: '/partner/dashboard', icon: FaTachometerAlt },
    { label: 'My Commissions', path: '/partner/commissions', icon: FaMoneyBillWave },
    { label: 'My Referrals', path: '/partner/referrals', icon: FaUserPlus },
    { label: 'Marketing Materials', path: '/partner/marketing', icon: FaBullhorn },
  ],
  customer: [
    { label: 'Dashboard', path: '/customer/dashboard', icon: FaTachometerAlt },
    { label: 'My Bookings', path: '/customer/bookings', icon: FaBookOpen },
    { label: 'My Payments', path: '/customer/payments', icon: FaMoneyBillWave },
    { label: 'My Documents', path: '/customer/documents', icon: FaFileAlt },
    { label: 'Construction Updates', path: '/customer/construction-updates', icon: FaHardHat },
    { label: 'My Referrals', path: '/customer/referrals', icon: FaUserPlus },
    { label: 'Support Tickets', path: '/customer/tickets', icon: FaTicketAlt },
    { label: 'Profile', path: '/customer/profile', icon: FaUser },
  ],
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = roleSidebarLinks[user?.role] || roleSidebarLinks.customer;

  const isActive = (path) => {
    if (path === `/admin/dashboard` || path === `/sales/dashboard` || path === `/partner/dashboard` || path === `/customer/dashboard`) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 shadow-sm transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-slate-900 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">JSM</span>
            </div>
            <span className="font-semibold text-sm text-slate-800">Dashboard</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-slate-100 rounded-lg">
            <FaTimes />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive(link.path)
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <link.icon className="text-base shrink-0" />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
              <FaBars />
            </button>
            <Link to="/" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors">
              <FaHome />
              <span>Back to Site</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
              <FaBell className="text-slate-500 text-lg" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-full transition-colors">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-800 leading-tight">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-slate-500 capitalize leading-tight">{user?.role?.replace('_', ' ') || ''}</p>
                </div>
                <FaChevronDown className="text-xs text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border py-2 text-sm z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-medium text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <Link to="/customer/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50">
                    <FaUser className="text-blue-600" /> Profile
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 w-full text-left text-red-600">
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
