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
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: 'modalPopIn 0.3s ease forwards' }}>
        <div className="px-7 py-5 border-b flex justify-between items-center">
          <div>
            <span className="text-xs px-3 py-1 bg-blue-600 text-white rounded-2xl font-bold">
              FEATURE {String(num).padStart(2, '0')}
            </span>
            <div className="font-bold text-xl mt-2 text-slate-800">{title}</div>
          </div>
          <button onClick={onClose} className="text-3xl text-slate-300 hover:text-slate-500 leading-none">&times;</button>
        </div>
        <div className="p-7 text-sm text-slate-600">
          <p>{desc}</p>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs">
            <strong className="text-blue-700">This feature is LIVE</strong> on the Jai Santoshi Maa website.
            All 25 features have been built by Briskode Technology with modern UI/UX and robust backend.
          </div>

          <div className="mt-5 flex gap-x-3">
            <button onClick={() => { onClose(); setTimeout(onShowAI, 300); }}
              className="flex-1 py-2.5 text-sm border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-2xl font-semibold transition flex items-center justify-center gap-2">
              <FaRobot /> Try AI Tools
            </button>
            <button onClick={onClose}
              className="flex-1 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
