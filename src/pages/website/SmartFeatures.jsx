import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LuBot,
  LuMessageSquare,
  LuTrendingUp,
  LuMap,
  LuEye,
  LuHardHat,
  LuCalendarCheck,
  LuGift,
  LuFileUp,
  LuScale,
  LuBadgePercent,
  LuStar,
  LuUser,
  LuFlame,
  LuArrowRight,
} from 'react-icons/lu';

const features = [
  { ic: LuBot, title: 'AI Property Recommendation', desc: 'Answer a few simple questions and let our AI match you with the perfect plot choice.', path: '/ai-recommendation' },
  { ic: LuTrendingUp, title: 'Investment Calculator', desc: 'Predict future land appreciation rates and evaluate your compound investment growth.', path: '/calculators' },
  { ic: LuMap, title: 'Live Plot Map', desc: 'View plot availability, dimensions, and reservations live in real-time.', path: '/plot-map' },
  { ic: LuEye, title: 'Virtual Site Visit', desc: 'Tour developments from home with immersive 3D walkthroughs.', path: '/virtual-tour' },
  { ic: LuHardHat, title: 'Construction Tracker', desc: 'Get live progress updates, photos, and engineering updates directly on your dashboard.', path: '/construction-tracker' },
  { ic: LuMessageSquare, title: 'AI Sales Assistant', desc: 'Instant 24/7 answers to your pricing, zoning, and project questions.', path: '/ai-chatbot' },
  { ic: LuCalendarCheck, title: 'Smart Booking', desc: 'Reserve plots instantly with a secure online token payment gateway.', path: '/book-visit' },
  { ic: LuGift, title: 'Referral Program', desc: 'Invite friends to invest and earn attractive cash rewards on successful referrals.', path: '/referral-program' },
  // { ic: LuCompass, title: 'Channel Partner Portal', desc: 'Specialized portal for registered brokers to track clients and payouts.', path: '/partner/dashboard' },
  { ic: LuFileUp, title: 'Online Document Upload', desc: 'Securely submit KYC and sign digital agreements in minutes.', path: '/admin/documents' },
  { ic: LuScale, title: 'Property Comparison', desc: 'Compare sizes, locations, road access, and pricing of different plots side-by-side.', path: '/property-comparison' },
  { ic: LuBadgePercent, title: 'Loan Eligibility Estimator', desc: 'Calculate home/plot loan EMIs and check eligibility across major banks.', path: '/calculators' },
  // { ic: LuCalculator, title: 'Construction Cost Calculator', desc: 'Estimate building costs based on raw materials, layout, and area size.', path: '/calculators' },
  // { ic: LuChartColumn, title: 'Lead Scoring Integration', desc: 'Smart sales tracking to prioritize active property buyers.', path: '/ai-followup' },
  // { ic: LuSquareCheck, title: 'Legal Title Verification', desc: 'Check encumbrance certificate, RERA credentials, and title deeds instantly.', path: '/customer/documents' },
  // { ic: LuMessageCircle, title: 'WhatsApp CRM', desc: 'Get booking alerts, payment receipt notifications, and project updates on WhatsApp.', path: '/whatsapp-crm' },
  // { ic: LuBot, title: 'AI Follow-up Automation', desc: 'Automatic scheduling of visits and prompt query resolutions.', path: '/ai-followup' },
  { ic: LuStar, title: 'Customer Reviews & Ratings', desc: 'Read verified testimonials and reviews from hundreds of plot owners.', path: '/reviews' },
  { ic: LuUser, title: 'Owner Dashboard', desc: 'Access your payment receipts, RERA certificates, and documents in one central portal.', path: '/customer/dashboard' },
  { ic: LuFlame, title: 'Investment Heatmap', desc: 'View prime growth corridors and upcoming infrastructure hotspots.', path: '/investment-heatmap' },
];

export default function SmartFeatures() {
  const { user, getRedirectPath } = useAuth();
  const dashboardPath = user ? getRedirectPath(user.role) : '/login';

  const visibleFeatures = features.filter((f) => {
    if (user?.role === 'customer' && f.path === '/ai-followup') return false;
    return true;
  });

  return (
    <div className="bg-[#f7f7fb] min-h-screen pb-24">
      {/* ===== HEADER ===== */}
      <div className="relative overflow-hidden text-center py-14 sm:py-16 px-4 bg-gradient-to-r from-[#0b0f2e] via-[#161b45] to-[#1c1450]">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/10 pointer-events-none" />
        <div className="wrap max-w-4xl mx-auto">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-amber-400 text-xs font-bold tracking-wider uppercase mb-3">
            POWERED BY INNOVATION
          </span>
          <h1 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl md:text-5xl font-extrabold text-white my-3">
            Smart Features
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Experience the future of real estate investing. Explore our intelligent, AI-powered toolkit designed to make plot buying seamless.
          </p>
        </div>
      </div>

      {/* ===== FEATURES GRID ===== */}
      <div className="wrap max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {visibleFeatures.map((f, i) => {
            const Icon = f.ic;
            return (
              <Link
                key={i}
                to={f.title === 'Owner Dashboard' ? dashboardPath : f.path}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-xs hover:-translate-y-1 hover:shadow-lg hover:border-indigo-600 transition-all duration-200 no-underline group"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 text-xl shrink-0">
                  <Icon />
                </div>
                <h3 className="font-['Poppins',sans-serif] text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed flex-grow">
                  {f.desc}
                </p>
                <div className="mt-4 text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  <span>Try Feature</span>
                  <LuArrowRight className="text-sm" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
