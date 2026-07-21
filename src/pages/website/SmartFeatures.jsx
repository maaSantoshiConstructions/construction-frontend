import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const features = [
  { ic: '🤖', title: 'AI Property Recommendation', desc: 'Answer a few simple questions and let our AI match you with the perfect plot choice.', path: '/ai-recommendation' },
  { ic: '📊', title: 'Investment Calculator', desc: 'Predict future land appreciation rates and evaluate your compound investment growth.', path: '/calculators' },
  { ic: '🗺', title: 'Live Plot Map', desc: 'View plot availability, dimensions, and reservations live in real-time.', path: '/plot-map' },
  { ic: '👓', title: 'Virtual Site Visit', desc: 'Tour developments from home with immersive 3D walkthroughs.', path: '/virtual-tour' },
  { ic: '👷', title: 'Construction Tracker', desc: 'Get live progress updates, photos, and engineering updates directly on your dashboard.', path: '/construction-tracker' },
  { ic: '💬', title: 'AI Sales Assistant', desc: 'Instant 24/7 answers to your pricing, zoning, and project questions.', path: '/ai-chatbot' },
  { ic: '📅', title: 'Smart Booking', desc: 'Reserve plots instantly with a secure online token payment gateway.', path: '/book-visit' },
  { ic: '🎁', title: 'Referral Program', desc: 'Invite friends to invest and earn attractive cash rewards on successful referrals.', path: '/customer/referrals' },
  { ic: '🧭', title: 'Channel Partner Portal', desc: 'Specialized portal for registered brokers to track clients and payouts.', path: '/partner/dashboard' },
  { ic: '📲', title: 'Online Document Upload', desc: 'Securely submit KYC and sign digital agreements in minutes.', path: '/customer/documents' },
  { ic: '⚖', title: 'Property Comparison', desc: 'Compare sizes, locations, road access, and pricing of different plots side-by-side.', path: '/property-comparison' },
  { ic: '🏷', title: 'Loan Eligibility Estimator', desc: 'Calculate home/plot loan EMIs and check eligibility across major banks.', path: '/calculators' },
  { ic: '🧮', title: 'Construction Cost Calculator', desc: 'Estimate building costs based on raw materials, layout, and area size.', path: '/calculators' },
  { ic: '📈', title: 'Lead Scoring Integration', desc: 'Smart sales tracking to prioritize active property buyers.', path: '/ai-followup' },
  { ic: '✅', title: 'Legal Title Verification', desc: 'Check encumbrance certificate, RERA credentials, and title deeds instantly.', path: '/customer/documents' },
  { ic: '💬', title: 'WhatsApp CRM', desc: 'Get booking alerts, payment receipt notifications, and project updates on WhatsApp.', path: '/whatsapp-crm' },
  { ic: '🤖', title: 'AI Follow-up Automation', desc: 'Automatic scheduling of visits and prompt query resolutions.', path: '/ai-followup' },
  { ic: '⭐', title: 'Customer Reviews & Ratings', desc: 'Read verified testimonials and reviews from hundreds of plot owners.', path: '/reviews' },
  { ic: '🧑‍💼', title: 'Owner Dashboard', desc: 'Access your payment receipts, RERA certificates, and documents in one central portal.', path: '/customer/dashboard' },
  { ic: '🗺', title: 'Investment Heatmap', desc: 'View prime growth corridors and upcoming infrastructure hotspots.', path: '/investment-heatmap' },
];

export default function SmartFeatures() {
  const { user, getRedirectPath } = useAuth();
  const dashboardPath = user ? getRedirectPath(user.role) : '/login';

  const visibleFeatures = features.filter((f) => {
    if (user?.role === 'customer' && f.path === '/ai-followup') return false;
    return true;
  });

  return (
    <div style={{ background: '#f7f7fb', minHeight: '100vh', paddingBottom: '90px' }}>

      {/* ===== HEADER ===== */}
      <div style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(91,79,224,.35), transparent 55%), linear-gradient(120deg,#0b0f2e 0%,#161b45 55%,#1c1450 100%)',
        padding: '64px 0 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(91,79,224,.1)' }} />
        <div className="wrap">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>POWERED BY INNOVATION</span>
          <h1 style={{ fontFamily: 'Poppins,Inter,sans-serif', fontSize: '42px', fontWeight: 800, color: '#fff', margin: '12px 0 14px' }}>
            {visibleFeatures.length} Smart Features
          </h1>
          <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '540px', margin: '0 auto', lineHeight: 1.6 }}>
            Experience the future of real estate investing. Explore our intelligent, AI-powered toolkit designed to make plot buying seamless.
          </p>
        </div>
      </div>

      {/* ===== FEATURES GRID ===== */}
      <div className="wrap" style={{ marginTop: '48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '22px' }}>
          {visibleFeatures.map((f, i) => (
            <Link
              key={i}
              to={f.title === 'Owner Dashboard' ? dashboardPath : f.path}

              className="ccard"
              style={{
                flexDirection: 'column',
                gap: '0',
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: '14px',
                padding: '24px',
                transition: '.25s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(20,20,60,.08)';
                e.currentTarget.style.borderColor = 'var(--indigo)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.borderColor = 'var(--line)';
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#efeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                marginBottom: '16px',
              }}>
                {f.ic}
              </div>
              <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--gray)', lineHeight: 1.6, flexGrow: 1 }}>
                {f.desc}
              </p>
              <div style={{
                marginTop: '16px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: 'var(--indigo)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                Try Feature <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
