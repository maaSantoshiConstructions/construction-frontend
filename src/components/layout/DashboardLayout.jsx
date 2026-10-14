import { useState } from 'react';
import constructionLogo from '../../assets/construction logo.png';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LuLayoutDashboard,
  LuBuilding,
  LuMap,
  LuCalendar,
  LuUsers,
  LuTrendingUp,
  LuBot,
  LuCreditCard,
  LuFileText,
  LuMapPin,
  LuHardHat,
  LuGift,
  LuMegaphone,
  LuLogOut,
  LuUser,
  LuMenu,
  LuArrowLeft,
  LuChevronDown,
  LuX,
} from 'react-icons/lu';

const roleSidebarLinks = {
  super_admin: [
    { label: 'Dashboard', path: '/admin/dashboard', ic: LuLayoutDashboard },
    { label: 'Projects', path: '/admin/projects', ic: LuBuilding },
    { label: 'Plots', path: '/admin/plots', ic: LuMap },
    { label: 'Bookings', path: '/admin/bookings', ic: LuCalendar },
    { label: 'Customers', path: '/admin/customers', ic: LuUsers },
    { label: 'Leads', path: '/admin/leads', ic: LuTrendingUp },
    { label: 'Referrals', path: '/admin/referrals', ic: LuGift },
    // { label: 'AI Follow-up',         path: '/ai-followup',                ic: LuBot },
    { label: 'Payments', path: '/admin/payments', ic: LuCreditCard },
    { label: 'Documents', path: '/admin/documents', ic: LuFileText },
    { label: 'Site Visits', path: '/admin/site-visits', ic: LuMapPin },
    { label: 'Construction Updates', path: '/admin/construction-updates', ic: LuHardHat },
    { label: 'Users', path: '/admin/users', ic: LuUsers },
  ],
  company_admin: [
    { label: 'Dashboard', path: '/admin/dashboard', ic: LuLayoutDashboard },
    { label: 'Projects', path: '/admin/projects', ic: LuBuilding },
    { label: 'Plots', path: '/admin/plots', ic: LuMap },
    { label: 'Bookings', path: '/admin/bookings', ic: LuCalendar },
    { label: 'Customers', path: '/admin/customers', ic: LuUsers },
    { label: 'Leads', path: '/admin/leads', ic: LuTrendingUp },
    { label: 'Referrals', path: '/admin/referrals', ic: LuGift },
    // { label: 'AI Follow-up',         path: '/ai-followup',                ic: LuBot },
    { label: 'Payments', path: '/admin/payments', ic: LuCreditCard },
    { label: 'Documents', path: '/admin/documents', ic: LuFileText },
    { label: 'Site Visits', path: '/admin/site-visits', ic: LuMapPin },
    { label: 'Construction Updates', path: '/admin/construction-updates', ic: LuHardHat },
  ],
  sales_executive: [
    { label: 'Dashboard', path: '/sales/dashboard', ic: LuLayoutDashboard },
    { label: 'My Leads', path: '/sales/leads', ic: LuTrendingUp },
    // { label: 'AI Follow-up',path: '/ai-followup',        ic: LuBot },
    { label: 'Site Visits', path: '/sales/site-visits', ic: LuMapPin },
    { label: 'Customers', path: '/sales/customers', ic: LuUsers },
  ],
  channel_partner: [
    { label: 'Dashboard', path: '/partner/dashboard', ic: LuLayoutDashboard },
    { label: 'AI Follow-up', path: '/ai-followup', ic: LuBot },
    { label: 'My Commissions', path: '/partner/commissions', ic: LuCreditCard },
    { label: 'My Referrals', path: '/partner/referrals', ic: LuGift },
    { label: 'Marketing Materials', path: '/partner/materials', ic: LuMegaphone },
  ],
  customer: [
    { label: 'Dashboard', path: '/customer/dashboard', ic: LuLayoutDashboard },
    { label: 'My Bookings', path: '/customer/bookings', ic: LuCalendar },
    { label: 'My Site Visits', path: '/customer/site-visits', ic: LuMapPin },
    { label: 'My Payments', path: '/customer/payments', ic: LuCreditCard },
    // { label: 'My Documents',         path: '/customer/documents',              ic: LuFileText },
    { label: 'Construction Updates', path: '/customer/construction-updates', ic: LuHardHat },
    // { label: 'My Referrals',         path: '/customer/referrals',              ic: LuGift },
    { label: 'Profile', path: '/customer/profile', ic: LuUser },
    // { label: 'Wishlist',             path: '/customer/wishlist',               ic: LuHeart },
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
    if (path.endsWith('/dashboard')) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f7f7fb] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 !z-[1200] bg-slate-950/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`fixed top-0 left-0 !z-[1210] h-full w-60 bg-[#0d1f0d] border-r border-white/10 flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-100'
        }`}
      >
        {/* Logo */}
        <div className="p-4 sm:px-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center no-underline">
            <img
              src={constructionLogo}
              alt="JSMIL"
              className="h-12 w-auto object-contain brightness-105"
            />
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden bg-transparent border-0 text-slate-400 hover:text-white cursor-pointer p-1 flex items-center justify-center"
          >
            <LuX className="text-lg" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {links.map((link) => {
            const IconComponent = link.ic;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all no-underline border-l-4 !text-white ${
                  active
                    ? '!bg-green-800/60 border-amber-400 font-bold shadow-xs'
                    : 'bg-transparent hover:!bg-white/10 border-transparent'
                }`}
              >
                {IconComponent && <IconComponent className="text-base shrink-0 !text-white" />}
                <span className="!text-white">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="p-3 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl bg-transparent hover:!bg-white/10 border-0 cursor-pointer !text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            <LuLogOut className="text-base shrink-0 !text-white" />
            <span className="!text-white">Logout</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top header */}
        <header className="h-15 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden bg-transparent border-0 cursor-pointer !text-slate-600 hover:!text-slate-900 p-1 flex items-center"
            >
              <LuMenu className="text-xl" />
            </button>
            <Link
              to="/"
              className="text-xs sm:text-sm !text-slate-600 hover:!text-slate-900 flex items-center gap-1.5 no-underline font-semibold"
            >
              <LuArrowLeft className="text-base" /> Back to Site
            </Link>
          </div>

          <div className="flex items-center gap-3.5">
            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-transparent border-0 cursor-pointer p-1"
              >
                <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-xs font-['Poppins',sans-serif]">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold !text-slate-900 leading-tight">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-[10px] !text-slate-500 capitalize font-medium">
                    {user?.role?.replace(/_/g, ' ') || ''}
                  </div>
                </div>
                <LuChevronDown className="!text-slate-500 text-xs" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden">
                  <div className="p-3.5 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{user?.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                  </div>
                  <Link
                    to="/customer/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 no-underline transition-colors"
                  >
                    <LuUser className="text-base text-slate-400" />
                    <span>Profile</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 bg-transparent border-0 cursor-pointer text-left transition-colors font-medium"
                  >
                    <LuLogOut className="text-base text-rose-600" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f5f9f3]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
