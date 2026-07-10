import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const roleSidebarLinks = {
  super_admin: [
    { label: 'Dashboard',            path: '/admin/dashboard',             ic: '▦' },
    { label: 'Projects',             path: '/admin/projects',              ic: '🏗' },
    { label: 'Plots',                path: '/admin/plots',                 ic: '▤' },
    { label: 'Bookings',             path: '/admin/bookings',              ic: '📅' },
    { label: 'Customers',            path: '/admin/customers',             ic: '☺' },
    { label: 'Leads',                path: '/admin/leads',                 ic: '📈' },
    { label: 'Payments',             path: '/admin/payments',              ic: '💳' },
    { label: 'Documents',            path: '/admin/documents',             ic: '📄' },
    { label: 'Site Visits',          path: '/admin/site-visits',           ic: '📍' },
    { label: 'Construction Updates', path: '/admin/construction-updates',  ic: '👷' },
    { label: 'Channel Partners',     path: '/admin/channel-partners',      ic: '🤝' },
    { label: 'Reviews',              path: '/admin/reviews',               ic: '⭐' },
    { label: 'Blogs',                path: '/admin/blogs',                 ic: '✏' },
    { label: 'Gallery',              path: '/admin/gallery',               ic: '🖼' },
    { label: 'FAQs',                 path: '/admin/faqs',                  ic: '❓' },
    { label: 'Settings',             path: '/admin/settings',              ic: '⚙' },
    { label: 'Users',                path: '/admin/users',                 ic: '👤' },
  ],
  company_admin: [
    { label: 'Dashboard',            path: '/admin/dashboard',             ic: '▦' },
    { label: 'Projects',             path: '/admin/projects',              ic: '🏗' },
    { label: 'Plots',                path: '/admin/plots',                 ic: '▤' },
    { label: 'Bookings',             path: '/admin/bookings',              ic: '📅' },
    { label: 'Customers',            path: '/admin/customers',             ic: '☺' },
    { label: 'Leads',                path: '/admin/leads',                 ic: '📈' },
    { label: 'Payments',             path: '/admin/payments',              ic: '💳' },
    { label: 'Documents',            path: '/admin/documents',             ic: '📄' },
    { label: 'Site Visits',          path: '/admin/site-visits',           ic: '📍' },
    { label: 'Construction Updates', path: '/admin/construction-updates',  ic: '👷' },
    { label: 'Channel Partners',     path: '/admin/channel-partners',      ic: '🤝' },
    { label: 'Reviews',              path: '/admin/reviews',               ic: '⭐' },
    { label: 'Blogs',                path: '/admin/blogs',                 ic: '✏' },
    { label: 'Gallery',              path: '/admin/gallery',               ic: '🖼' },
    { label: 'FAQs',                 path: '/admin/faqs',                  ic: '❓' },
    { label: 'Settings',             path: '/admin/settings',              ic: '⚙' },
  ],
  sales_executive: [
    { label: 'Dashboard',   path: '/sales/dashboard',    ic: '▦' },
    { label: 'My Leads',    path: '/sales/leads',        ic: '📈' },
    { label: 'Site Visits', path: '/sales/site-visits',  ic: '📍' },
    { label: 'Customers',   path: '/sales/customers',    ic: '☺' },
  ],
  channel_partner: [
    { label: 'Dashboard',            path: '/partner/dashboard',    ic: '▦' },
    { label: 'My Commissions',       path: '/partner/commissions',  ic: '💳' },
    { label: 'My Referrals',         path: '/partner/referrals',    ic: '🎁' },
    { label: 'Marketing Materials',  path: '/partner/materials',    ic: '📣' },
  ],
  customer: [
    { label: 'Dashboard',            path: '/customer/dashboard',              ic: '▦' },
    { label: 'My Bookings',          path: '/customer/bookings',               ic: '📅' },
    { label: 'My Site Visits',       path: '/customer/site-visits',            ic: '📍' },
    { label: 'My Payments',          path: '/customer/payments',               ic: '💳' },
    { label: 'My Documents',         path: '/customer/documents',              ic: '📄' },
    { label: 'Construction Updates', path: '/customer/construction-updates',   ic: '👷' },
    { label: 'My Referrals',         path: '/customer/referrals',              ic: '🎁' },
    { label: 'Support Tickets',      path: '/customer/support-tickets',        ic: '🎫' },
    { label: 'Profile',              path: '/customer/profile',                ic: '👤' },
    { label: 'Wishlist',             path: '/customer/wishlist',               ic: '❤' },
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
            style={{ background: 'none', border: 'none', color: '#9ea1c4', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>✕</button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
          {links.map(link => (
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
              <span style={{ fontSize: '15px', flexShrink: 0 }}>{link.ic}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout at bottom */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 12px', borderRadius: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ea1c4', fontSize: '13px', fontFamily: 'Inter,sans-serif', transition: '.15s' }}>
            🚪 <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%', overflow: 'hidden' }} className="main-content-el">

        {/* Top header */}
        <header style={{
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
              ☰
            </button>
            <Link to="/" style={{ fontSize: '12px', color: '#6b6f8a', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ← Back to Site
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Bell */}
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6b6f8a' }}>
              🔔
              <span style={{ position: 'absolute', top: '1px', right: '1px', width: '8px', height: '8px', borderRadius: '50%', background: '#e55', border: '1.5px solid #fff' }} />
            </button>

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
                <span style={{ color: '#6b6f8a', fontSize: '10px' }}>▾</span>
              </button>

              {userMenuOpen && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: '200px', background: '#fff', borderRadius: '12px', border: '1px solid #e6e6f0', boxShadow: '0 15px 40px rgba(20,20,60,.12)', zIndex: 50, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #e6e6f0' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#171a35' }}>{user?.name}</div>
                    <div style={{ fontSize: '11px', color: '#6b6f8a' }}>{user?.email}</div>
                  </div>
                  <Link to="/customer/profile" onClick={() => setUserMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '13px', color: '#171a35', textDecoration: 'none' }}>
                    👤 Profile
                  </Link>
                  <button onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 16px', fontSize: '13px', color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif', textAlign: 'left' }}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px 28px', overflowY: 'auto' }}>
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
