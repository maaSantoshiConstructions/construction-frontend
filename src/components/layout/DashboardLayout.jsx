import { useState } from 'react';
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
  LuTicket, 
  LuHeart, 
  LuLogOut, 
  LuUser, 
  LuMenu, 
  LuArrowLeft, 
  LuChevronDown, 
  LuX 
} from 'react-icons/lu';

const roleSidebarLinks = {
  super_admin: [
    { label: 'Dashboard',            path: '/admin/dashboard',             ic: LuLayoutDashboard },
    { label: 'Projects',             path: '/admin/projects',              ic: LuBuilding },
    { label: 'Plots',                path: '/admin/plots',                 ic: LuMap },
    { label: 'Bookings',             path: '/admin/bookings',              ic: LuCalendar },
    { label: 'Customers',            path: '/admin/customers',             ic: LuUsers },
    { label: 'Leads',                path: '/admin/leads',                 ic: LuTrendingUp },
    { label: 'AI Follow-up',         path: '/ai-followup',                ic: LuBot },
    { label: 'Payments',             path: '/admin/payments',              ic: LuCreditCard },
    { label: 'Documents',            path: '/admin/documents',             ic: LuFileText },
    { label: 'Site Visits',          path: '/admin/site-visits',           ic: LuMapPin },
    { label: 'Construction Updates', path: '/admin/construction-updates',  ic: LuHardHat },
    { label: 'Users',                path: '/admin/users',                 ic: LuUsers },
  ],
  company_admin: [
    { label: 'Dashboard',            path: '/admin/dashboard',             ic: LuLayoutDashboard },
    { label: 'Projects',             path: '/admin/projects',              ic: LuBuilding },
    { label: 'Plots',                path: '/admin/plots',                 ic: LuMap },
    { label: 'Bookings',             path: '/admin/bookings',              ic: LuCalendar },
    { label: 'Customers',            path: '/admin/customers',             ic: LuUsers },
    { label: 'Leads',                path: '/admin/leads',                 ic: LuTrendingUp },
    { label: 'AI Follow-up',         path: '/ai-followup',                ic: LuBot },
    { label: 'Payments',             path: '/admin/payments',              ic: LuCreditCard },
    { label: 'Documents',            path: '/admin/documents',             ic: LuFileText },
    { label: 'Site Visits',          path: '/admin/site-visits',           ic: LuMapPin },
    { label: 'Construction Updates', path: '/admin/construction-updates',  ic: LuHardHat },
  ],
  sales_executive: [
    { label: 'Dashboard',   path: '/sales/dashboard',    ic: LuLayoutDashboard },
    { label: 'My Leads',    path: '/sales/leads',        ic: LuTrendingUp },
    { label: 'AI Follow-up',path: '/ai-followup',        ic: LuBot },
    { label: 'Site Visits', path: '/sales/site-visits',  ic: LuMapPin },
    { label: 'Customers',   path: '/sales/customers',    ic: LuUsers },
  ],
  channel_partner: [
    { label: 'Dashboard',            path: '/partner/dashboard',    ic: LuLayoutDashboard },
    { label: 'AI Follow-up',         path: '/ai-followup',          ic: LuBot },
    { label: 'My Commissions',       path: '/partner/commissions',  ic: LuCreditCard },
    { label: 'My Referrals',         path: '/partner/referrals',    ic: LuGift },
    { label: 'Marketing Materials',  path: '/partner/materials',    ic: LuMegaphone },
  ],
  customer: [
    { label: 'Dashboard',            path: '/customer/dashboard',              ic: LuLayoutDashboard },
    { label: 'My Bookings',          path: '/customer/bookings',               ic: LuCalendar },
    { label: 'My Site Visits',       path: '/customer/site-visits',            ic: LuMapPin },
    { label: 'My Payments',          path: '/customer/payments',               ic: LuCreditCard },
    { label: 'My Documents',         path: '/customer/documents',              ic: LuFileText },
    { label: 'Construction Updates', path: '/customer/construction-updates',   ic: LuHardHat },
    { label: 'My Referrals',         path: '/customer/referrals',              ic: LuGift },
    { label: 'Support Tickets',      path: '/customer/support-tickets',        ic: LuTicket },
    { label: 'Profile',              path: '/customer/profile',                ic: LuUser },
    { label: 'Wishlist',             path: '/customer/wishlist',               ic: LuHeart },
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

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: '#f7f7fb', display: 'flex' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,.45)' }}
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, zIndex: 50,
        height: '100%', width: '240px',
        background: 'var(--navy)',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform .3s ease',
        display: 'flex', flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,.06)',
        flexShrink: 0,
      }} className="sidebar-el">
        {/* Logo */}
        <div style={{ padding: '18px 20px 16px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'linear-gradient(135deg,#e8b355,#d99f36)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins,sans-serif', fontWeight: 800, color: '#0b0f2e', fontSize: '14px' }}>JS</div>
            <div>
              <div style={{ color: '#e8b355', fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '.3px' }}>JAI SANTOSHI MAA</div>
              <div style={{ color: '#c7cae0', fontSize: '8.5px', letterSpacing: '1.5px' }}>INFRASTRUCTURE</div>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="sidebar-close-btn"
            style={{ background: 'none', border: 'none', color: '#9ea1c4', cursor: 'pointer', fontSize: '16px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LuX style={{ fontSize: '18px' }} />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
          {links.map(link => {
            const IconComponent = link.ic;
            return (
              <Link key={link.path} to={link.path} onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 12px', borderRadius: '10px', marginBottom: '2px',
                  fontSize: '13px', fontWeight: isActive(link.path) ? 600 : 400,
                  background: isActive(link.path) ? 'rgba(91,79,224,.35)' : 'transparent',
                  color: isActive(link.path) ? '#fff' : '#b7bade',
                  transition: '.15s',
                  textDecoration: 'none',
                  borderLeft: isActive(link.path) ? '3px solid #e8b355' : '3px solid transparent',
                }}>
                {IconComponent && <IconComponent style={{ fontSize: '16px', flexShrink: 0 }} />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 12px', borderRadius: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ea1c4', fontSize: '13px', fontFamily: 'Inter,sans-serif', transition: '.15s' }}>
            <LuLogOut style={{ fontSize: '16px', flexShrink: 0 }} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%', overflow: 'hidden' }} className="main-content-el">

        {/* Top header */}
        <header className="dashboard-top-header" style={{
          height: '60px', background: '#fff',
          borderBottom: '1px solid #e6e6f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', position: 'sticky', top: 0, zIndex: 30,
          boxShadow: '0 2px 10px rgba(20,20,60,.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button onClick={() => setSidebarOpen(true)}
              className="menu-toggle-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6b6f8a', display: 'flex', alignItems: 'center' }}>
              <LuMenu style={{ fontSize: '20px' }} />
            </button>
            <Link to="/" style={{ fontSize: '13px', color: '#6b6f8a', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontWeight: 500 }}>
              <LuArrowLeft style={{ fontSize: '15px' }} /> Back to Site
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* User menu */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#3a2fb8,#5b4fe0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px', fontFamily: 'Poppins,sans-serif' }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div style={{ textAlign: 'left', display: 'none' }} className="user-name-el">
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#171a35', lineHeight: 1.2 }}>{user?.name || 'User'}</div>
                  <div style={{ fontSize: '10px', color: '#6b6f8a', textTransform: 'capitalize' }}>{user?.role?.replace(/_/g,' ') || ''}</div>
                </div>
                <LuChevronDown style={{ color: '#6b6f8a', fontSize: '14px' }} />
              </button>

              {userMenuOpen && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: '200px', background: '#fff', borderRadius: '12px', border: '1px solid #e6e6f0', boxShadow: '0 15px 40px rgba(20,20,60,.12)', zIndex: 50, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #e6e6f0' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#171a35' }}>{user?.name}</div>
                    <div style={{ fontSize: '11px', color: '#6b6f8a' }}>{user?.email}</div>
                  </div>
                  <Link to="/customer/profile" onClick={() => setUserMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', fontSize: '13px', color: '#171a35', textDecoration: 'none', transition: '.15s' }}>
                    <LuUser style={{ fontSize: '16px', color: '#6b6f8a' }} />
                    <span>Profile</span>
                  </Link>
                  <button onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '11px 16px', fontSize: '13px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif', textAlign: 'left', transition: '.15s' }}>
                    <LuLogOut style={{ fontSize: '16px', color: '#dc2626' }} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="dashboard-main-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        @media(min-width:1024px){
          .sidebar-el { transform: translateX(0) !important; position: static !important; }
          .sidebar-close-btn { display: none !important; }
          .user-name-el { display: block !important; }
          .menu-toggle-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}
