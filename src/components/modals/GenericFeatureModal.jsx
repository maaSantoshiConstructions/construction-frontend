import { FaRobot } from 'react-icons/fa';

const titles = {
  4: "360° Virtual Site Visit",
  5: "Smart Construction Progress Tracker",
  8: "Customer Referral Program",
  9: "Channel Partner Portal",
  11: "Property Comparison Tool",
  14: "Smart Lead Scoring Dashboard",
  15: "Dynamic Price Increase Timer",
  16: "AI Interior Visualizer",
  17: "Plot Direction Analyzer",
  18: "Nearby Location Explorer",
  19: "Legal Document Verification",
  20: "WhatsApp CRM Integration",
  21: "AI Follow-up Automation",
  22: "Live Customer Reviews",
  23: "Interactive Odisha Investment Heatmap",
};

const descs = {
  4: "Enable remote visitors to experience the site without physical presence using drone videos, virtual walkthroughs and Street View integration. Reduces travel friction for outstation buyers.",
  5: "Every customer gets a secure personal login to track their property's construction journey transparently with weekly images, drone updates and engineer reports.",
  8: "Turn happy buyers into brand advocates. Earn ₹10,000 + Gold Coin + Discount/Cashback for successful referrals. Track status live in real time.",
  9: "Empower agents and channel partners with a dedicated self-service portal. Huge revenue generator with motivated partner network.",
  11: "Help buyers make confident decisions by comparing up to 4 properties side-by-side on key metrics including price, road width, distance from airport and appreciation potential.",
  14: "AI-powered admin panel that automatically prioritizes leads. Sales team focuses on high-value prospects with automatic Hot/Warm/Cold ranking.",
  15: "Create genuine urgency with transparent time-bound price changes. Countdown timer visible on project pages.",
  16: "Upload any room image and let AI generate multiple interior styles: Modern, Luxury, Scandinavian, Traditional, Minimalist.",
  17: "Address the culturally important Vastu factor with instant professional analysis. Vastu score, sunlight & wind direction analysis.",
  18: "Interactive map showing real-world convenience: schools, hospitals, railway, airport, temples and shopping malls with driving/walking times.",
  19: "Build buyer confidence by making all legal documents easily accessible and verifiable online including Sale Deed, Mutation, ROR and NOCs.",
  20: "Never lose a lead. Every inquiry is instantly routed through WhatsApp + CRM + Email + Dashboard with real-time notifications.",
  21: "Intelligent automated nurturing that keeps prospects warm. Auto sends WhatsApp messages, brochures, construction updates and personalized sequences.",
  22: "Authentic social proof with video testimonials, Google Reviews and before/after construction comparisons.",
  23: "Position Jai Santoshi Maa as the market expert with visual heatmap of high-growth areas, upcoming highways, metro proposals and Smart City projects.",
};

export default function GenericFeatureModal({ num, onClose, onShowAI }) {
  const title = titles[num] || 'Advanced Feature';
  const desc = descs[num] || 'This powerful feature is fully implemented on the live platform and available for all visitors and customers.';

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()}
        className="modal bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="px-7 py-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <div>
            <span className="text-xs px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold">
              FEATURE {String(num).padStart(2, '0')}
            </span>
            <div className="font-bold text-xl mt-2 text-slate-800">{title}</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all text-xl leading-none">&times;</button>
        </div>
        <div className="p-7">
          <p className="text-slate-500 leading-relaxed">{desc}</p>
          <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl">
            <div className="flex items-start gap-x-3">
              <FaRobot className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm text-slate-700">Try Our AI Recommendation System</div>
                <div className="text-xs text-slate-500 mt-1 leading-relaxed">This feature is available on the live platform. Use our AI-powered property recommendation to instantly find the best match for your needs.</div>
              </div>
            </div>
            <button onClick={onShowAI}
              className="mt-4 w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-500/20">
              Try AI Property Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
