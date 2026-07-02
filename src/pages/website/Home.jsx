import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../../api/projects';
import { useModal } from '../../context/ModalContext';
import AIRecommendationModal from '../../components/modals/AIRecommendationModal';
import PlotMapModal from '../../components/modals/PlotMapModal';
import ChatbotModal from '../../components/modals/ChatbotModal';
import SiteVisitModal from '../../components/modals/SiteVisitModal';
import OwnerDashboardModal from '../../components/modals/OwnerDashboardModal';
import GenericFeatureModal from '../../components/modals/GenericFeatureModal';
import {
  FaArrowRight, FaRobot, FaCalendarCheck, FaShieldAlt, FaMapMarkedAlt, FaHeadset,
  FaCheckDouble, FaPlay, FaChevronDown, FaCheckCircle, FaMap, FaCaretRight,
  FaStar, FaChartLine, FaHome, FaBuilding, FaHardHat, FaHandHoldingUsd,
  FaUserShield, FaComments, FaVrCardboard, FaCalculator, FaHandshake,
  FaCouch, FaCompass, FaHospital, FaFileAlt, FaWhatsapp, FaBell,
  FaVideo, FaFire, FaCrosshairs, FaUserFriends, FaRocket, FaMagic
} from 'react-icons/fa';

const featureList = [
  { num: 1, title: 'AI Property Recommendation System', desc: 'Personalized recommendations based on budget, location preference, plot type & investment goals.', icon: FaStar, cta: 'TRY LIVE DEMO' },
  { num: 2, title: 'Investment Return Calculator', desc: 'Calculate future value, rental income, ROI & EMI over 5, 10 & 15 years with appreciation projections.', icon: FaChartLine, cta: 'OPEN CALCULATOR' },
  { num: 3, title: 'Live Plot Availability Map', desc: 'Real-time interactive township map. Green = Available, Yellow = Reserved, Red = Sold. Instant booking.', icon: FaMap, cta: 'VIEW LIVE MAP' },
  { num: 4, title: '360° Virtual Site Visit', desc: 'Drone videos, virtual walkthroughs & Street View. Experience the site 24×7 from any device.', icon: FaVrCardboard, cta: 'START VIRTUAL TOUR' },
  { num: 5, title: 'Smart Construction Progress Tracker', desc: 'Secure personal login to track weekly images, drone updates, engineer reports & payment schedule.', icon: FaHardHat, cta: 'TRACK PROGRESS' },
  { num: 6, title: 'AI Sales Assistant (24×7)', desc: 'Multilingual intelligent chatbot answering plot prices, loan eligibility, RERA status & books visits.', icon: FaComments, cta: 'CHAT WITH AI NOW' },
  { num: 7, title: 'Smart Site Visit Booking', desc: 'Frictionless booking with auto-assigned executive, instant WhatsApp confirmation & reminders.', icon: FaCalendarCheck, cta: 'BOOK NOW' },
  { num: 8, title: 'Customer Referral Program', desc: 'Earn ₹10,000 + Gold Coin + Cashback. Track referrals live with personal dashboard.', icon: FaUserFriends, cta: 'REFER NOW' },
  { num: 9, title: 'Channel Partner Portal', desc: 'Self-service portal for agents. Download brochures, view commissions, generate leads & track payments.', icon: FaHandshake, cta: 'PARTNER LOGIN' },
  { num: 10, title: 'Online Plot Booking', desc: 'Book instantly with ₹5,000–₹25,000 token. Upload Aadhaar, PAN & get instant receipt & agreement.', icon: FaCrosshairs, cta: 'BOOK A PLOT' },
  { num: 11, title: 'Property Comparison Tool', desc: 'Compare up to 4 properties side-by-side on price, road width, appreciation & loan eligibility.', icon: FaChartLine, cta: 'COMPARE' },
  { num: 12, title: 'AI Loan Eligibility Checker', desc: 'Instantly calculate max eligible loan, EMI & partner banks based on income & obligations.', icon: FaCalculator, cta: 'CHECK ELIGIBILITY' },
  { num: 13, title: 'Construction Cost Calculator', desc: 'Detailed cost breakdown for self-build customers based on land size, floors & material quality.', icon: FaBuilding, cta: 'CALCULATE' },
  { num: 14, title: 'Smart Lead Scoring Dashboard', desc: 'AI automatically ranks leads as Hot / Warm / Cold for sales team efficiency.', icon: FaFire, cta: 'VIEW LEADS' },
  { num: 15, title: 'Dynamic Price Increase Timer', desc: 'Transparent countdown timers showing upcoming price increases to create genuine urgency.', icon: FaBell, cta: 'VIEW TIMER' },
  { num: 16, title: 'AI Interior Visualizer', desc: 'Upload any room photo & instantly visualize modern, luxury, Scandinavian or traditional interiors.', icon: FaCouch, cta: 'VISUALIZE' },
  { num: 17, title: 'Plot Direction Analyzer', desc: 'Vastu analysis with score, sunlight, wind direction & East/North facing benefits.', icon: FaCompass, cta: 'ANALYZE' },
  { num: 18, title: 'Nearby Location Explorer', desc: 'Interactive map showing schools, hospitals, malls, temples & commute times in minutes.', icon: FaHospital, cta: 'EXPLORE' },
  { num: 19, title: 'Legal Document Verification', desc: 'Secure online viewer for Sale Deed, Mutation, ROR, Layout Approval & all NOCs.', icon: FaFileAlt, cta: 'VIEW DOCUMENTS' },
  { num: 20, title: 'WhatsApp CRM Integration', desc: 'Every inquiry instantly routed to sales executive + CRM + WhatsApp with zero lead leakage.', icon: FaWhatsapp, cta: 'LEARN MORE' },
  { num: 21, title: 'AI Follow-up Automation', desc: 'Intelligent nurturing sequences via WhatsApp, email & SMS based on lead behavior.', icon: FaRobot, cta: 'AUTOMATE' },
  { num: 22, title: 'Live Customer Reviews', desc: 'Video testimonials, Google reviews & authentic before/after construction stories.', icon: FaVideo, cta: 'WATCH REVIEWS' },
  { num: 23, title: 'Interactive Odisha Investment Heatmap', desc: 'Visual heatmap of high-growth areas, highways, metro proposals & Smart City projects.', icon: FaFire, cta: 'VIEW HEATMAP' },
  { num: 24, title: 'AI Property Valuation Tool', desc: 'Get instant credible property value estimates. Excellent lead generation for buyers & landowners.', icon: FaChartLine, cta: 'GET VALUATION' },
  { num: 25, title: 'Owner & Investor Dashboard', desc: 'Complete self-service portal to view properties, payments, documents, updates & earn referral rewards.', icon: FaUserShield, cta: 'ACCESS DASHBOARD' },
];

const projectsData = [
  { id: 1, name: 'Santoshi Enclave - Phase 1', location: 'Patia, Bhubaneswar', price: '₹2,450/sq.ft', status: '68% Sold', statusColor: 'emerald', img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80', tags: ['1200–4000 sqft plots', 'North & East facing'], plots: 142 },
  { id: 2, name: 'Santoshi Villas', location: 'Chandrasekharpur, Bhubaneswar', price: '₹4,850/sq.ft', status: 'Phase 2 Launching', statusColor: 'amber', img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', tags: ['3 & 4 BHK Villas', 'Gated Community'], plots: 37 },
  { id: 3, name: 'Santoshi Greens', location: 'Khandagiri, Bhubaneswar', price: '₹1,950/sq.ft', status: 'New Launch', statusColor: 'emerald', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56b08?w=800&q=80', tags: ['Affordable Plots', 'Near NH-16'], plots: 89 },
];

export default function Home() {
  const { showModal, openModal, closeModal } = useModal();
  const [projects, setProjects] = useState([]);

  // Investment Calculator state
  const [invAmount, setInvAmount] = useState(4500000);
  const [invRate, setInvRate] = useState(11);
  const [invYears, setInvYears] = useState(10);
  // Loan Calculator
  const [loanIncome, setLoanIncome] = useState(85000);
  const [loanEmi, setLoanEmi] = useState(12000);
  const [loanAge, setLoanAge] = useState(34);
  const [loanTenure, setLoanTenure] = useState(25);
  // Construction Calculator
  const [constSize, setConstSize] = useState(2400);
  const [constFloors, setConstFloors] = useState(2);
  const [constQuality, setConstQuality] = useState('premium');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await getProjects({ limit: 3 });
        setProjects(data?.data || []);
      } catch {
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  // Keyboard escape for all modals (matches index.html behavior)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeModal]);

  const showFeature = (num) => {
    // Matches index.html showFeatureModal logic exactly:
    // Features 1,3,6,7,25 have dedicated modals; all others show generic modal
    const dedicated = { 1: 'ai', 3: 'plot-map', 6: 'chatbot', 7: 'visit', 25: 'dashboard' };
    openModal(dedicated[num] || num);
  };

  const formatINR = (val) => '₹' + Number(val).toLocaleString('en-IN');
  const formatCr = (val) => '₹' + (val / 10000000).toFixed(2) + ' Cr';
  const formatLakh = (val) => '₹' + (val / 100000).toFixed(1) + ' Lakh';

  const invFutureValue = Math.round(invAmount * Math.pow(1 + invRate / 100, invYears));
  const invTotalROI = Math.round(((invFutureValue - invAmount) / invAmount) * 100);
  const invRentalYield = (4.2 + (invRate - 8) * 0.15).toFixed(1);

  const loanMaxEMI = (loanIncome * 0.55) - loanEmi;
  const loanMonthlyRate = 8.7 / 12 / 100;
  const loanMonths = loanTenure * 12;
  const loanMaxAmount = loanMaxEMI > 0
    ? Math.max(0, Math.round((loanMaxEMI * (1 - Math.pow(1 + loanMonthlyRate, -loanMonths)) / loanMonthlyRate) / 100000) * 100000)
    : 0;
  const loanEMIResult = loanMaxAmount > 0
    ? Math.round(loanMaxAmount * loanMonthlyRate * Math.pow(1 + loanMonthlyRate, loanMonths) / (Math.pow(1 + loanMonthlyRate, loanMonths) - 1))
    : 0;

  const constBaseRate = constQuality === 'standard' ? 1850 : constQuality === 'premium' ? 2450 : 3250;
  const constTotalCost = Math.round(constSize * constFloors * constBaseRate * 0.92);
  const constStructure = Math.round(constTotalCost * 0.56);
  const constFinish = Math.round(constTotalCost * 0.32);
  const constOther = constTotalCost - constStructure - constFinish;

  return (
    <div>
      {/* HERO SECTION */}
      <header className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(15,23,42,0.75), rgba(15,23,42,0.65)), url(https://images.unsplash.com/photo-1600585154340-be6161a56b08?w=2000&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
        <div className="max-w-screen-2xl mx-auto px-8 pt-12 pb-16 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-x-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-emerald-700">RERA APPROVED • BHUBANESWAR, ODISHA</span>
            </div>
            <h1 className="text-5xl md:text-7xl leading-[1.05] font-bold tracking-tighter text-white">
              Your Dream Plot.<br />
              <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">Intelligent Buying.</span>
            </h1>
            <p className="mt-6 max-w-lg text-xl text-white/90">
              Experience India's most advanced real estate platform. 24×7 AI-powered sales, virtual tours, live plot maps & transparent construction tracking.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => openModal('ai')}
                className="group flex items-center justify-center gap-x-3 bg-white hover:bg-amber-50 text-slate-900 font-semibold px-8 h-14 rounded-full text-base shadow-xl transition-all active:scale-[0.985]">
                <span>Find My Perfect Plot with AI</span>
                <FaArrowRight className="group-hover:translate-x-0.5 transition" />
              </button>
              <Link to="/virtual-tour"
                className="flex items-center justify-center gap-x-3 border-2 border-white/70 hover:bg-white/10 text-white font-semibold px-7 h-14 rounded-full text-base transition-all">
                <FaPlay className="mr-1" />
                <span>Watch 1:42 Video Tour</span>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-x-6 text-sm">
              <div className="flex -space-x-2">
                {[28, 47, 12].map((n, i) => (
                  <img key={i} src={`https://i.pravatar.cc/28?img=${n}`} className="w-7 h-7 rounded-full ring-2 ring-white/70 object-cover" alt="" />
                ))}
              </div>
              <div className="text-white/90">
                <span className="font-semibold">2,847+</span> families already found their home
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="flex flex-col items-center text-white/60 text-xs tracking-widest">
            <span>SCROLL TO EXPLORE</span>
            <FaChevronDown className="mt-1 animate-bounce" />
          </div>
        </div>
      </header>

      {/* TRUST BAR */}
      <div className="bg-white border-b">
        <div className="max-w-screen-2xl mx-auto px-8 py-5">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center gap-x-8 text-slate-600">
              <div className="flex items-center gap-x-2"><FaShieldAlt className="text-emerald-600" /> <span className="font-medium">RERA Registered</span></div>
              <div className="flex items-center gap-x-2"><FaHeadset className="text-emerald-600" /> <span className="font-medium">24×7 AI Support</span></div>
              <div className="flex items-center gap-x-2"><FaMapMarkedAlt className="text-emerald-600" /> <span className="font-medium">Live Plot Tracking</span></div>
            </div>
            <div className="text-xs px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full font-bold flex items-center gap-x-1.5">
              <FaCheckDouble />
              <span>100% Transparent Construction Updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY */}
      <section className="max-w-screen-2xl mx-auto px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="uppercase tracking-[3px] text-blue-600 text-xs font-bold mb-3">EXECUTIVE SUMMARY</div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-800">The website is not just a brochure.<br />It is a <span className="text-blue-600">24×7 Sales & Lead Generation Platform.</span></h2>
          <div className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto">
            For Jai Santoshi Maa Infrastructure Pvt. Ltd., Briskode Technology has built a complete suite of modern, AI-powered features designed specifically for the Indian real estate market. From intelligent property matching to automated follow-ups and transparent construction tracking — every feature is built to build trust, create urgency, and drive conversions.
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="max-w-screen-2xl mx-auto px-8 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-blue-600 text-xs tracking-[2px] font-bold">OUR FLAGSHIP PROJECT</div>
            <h3 className="text-4xl font-bold tracking-tight text-slate-800">Santoshi Enclave</h3>
            <p className="text-slate-600">Premium plotted development • Patia, Bhubaneswar • RERA: OR/06/2025/001234</p>
          </div>
          <Link to="/projects" className="hidden md:flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
            View All Projects <FaArrowRight className="ml-2" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(projects.length > 0 ? projects.slice(0, 3) : projectsData).map((p, i) => {
            const name = p.name || p.title;
            const location = p.location;
            const price = p.price;
            const img = p.image || p.images?.[0] || `https://images.unsplash.com/photo-${1600585154526 + i * 1000}-990dced4db0d?w=800&q=80`;
            const status = p.status || 'Available';
            const plotsAvail = p.availablePlots || p.plots || 'Limited';
            const isStatusColor = p.statusColor;

            return (
              <div key={i}
                className="real-estate-card bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
                <div className="relative h-56 overflow-hidden">
                  <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={name} />
                  <div className="absolute top-4 right-4 bg-white text-xs font-bold px-3.5 py-1 rounded-full shadow flex items-center gap-x-1">
                    <div className={`w-2 h-2 rounded-full ${isStatusColor === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <span className="font-bold text-slate-700">{status}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-xl text-slate-800">{name}</div>
                      <div className="text-sm text-slate-500">{location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Starting from</div>
                      <div className="font-bold text-xl text-slate-900">{price}</div>
                    </div>
                  </div>
                  <div className="my-4 flex gap-x-4 text-xs">
                    <span className="bg-slate-100 px-3 py-1 rounded-2xl">{p.tags?.[0] || 'Prime plots'}</span>
                    <span className="bg-slate-100 px-3 py-1 rounded-2xl">{p.tags?.[1] || 'Premium location'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-semibold">{plotsAvail}</span>
                      <span className="text-slate-500"> plots available</span>
                    </div>
                    <button onClick={() => openModal('plot-map')}
                      className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-x-1 text-xs">
                      VIEW LIVE MAP <FaMap className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 25 FEATURES SECTION */}
      <section id="features" className="bg-white py-16 border-t border-b">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-xs font-extrabold tracking-widest rounded-full mb-3">POWERED BY BRISKODE TECHNOLOGY</div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-800">25 Powerful Features</h2>
            <p className="mt-3 text-lg text-slate-600 max-w-md mx-auto">Every tool designed to convert visitors into buyers, build trust and deliver a world-class digital experience.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {featureList.map((feat) => (
              <div key={feat.num} onClick={() => showFeature(feat.num)}
                className="feature-card cursor-pointer bg-white border border-slate-200 hover:border-blue-200 p-5 rounded-3xl group">
                <div className="flex items-start gap-x-4">
                  <div className="w-8 h-8 flex-shrink-0 rounded-2xl flex items-center justify-center text-sm font-extrabold text-white"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #1E40AF)', boxShadow: '0 10px 10px -3px rgb(37 99 235 / 0.3)' }}>
                    {String(feat.num).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base leading-tight group-hover:text-blue-700 transition-colors">{feat.title}</div>
                    <div className="text-xs text-slate-500 mt-1.5 line-clamp-2">{feat.desc}</div>
                    <div className="mt-3 text-[10px] text-emerald-600 font-medium flex items-center">
                      <FaRocket className="mr-1.5" /> {feat.cta}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Jump to calculators link (matches index.html exactly) */}
          <div className="text-center mt-8">
            <button onClick={() => document.getElementById('calculators-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center text-sm px-5 py-2.5 font-semibold border border-slate-300 hover:bg-slate-100 transition rounded-full">
              <span>Jump to Interactive Calculators</span> <FaChevronDown className="ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CALCULATORS SECTION */}
      <section id="calculators-section" className="max-w-screen-2xl mx-auto px-8 py-16">
        <div className="text-center mb-10">
          <div className="text-blue-600 tracking-widest text-xs font-extrabold">POWERFUL TOOLS</div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-800">Try Our Interactive Tools</h2>
          <p className="text-slate-600 mt-2">Real calculators used by thousands of smart buyers in Odisha</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Investment Return Calculator */}
          <div className="bg-white border border-slate-200 rounded-3xl p-7">
            <div className="flex items-center gap-x-3 mb-5">
              <FaChartLine className="text-3xl text-blue-600" />
              <div>
                <div className="font-bold text-slate-800">Investment Return Calculator</div>
                <div className="text-xs text-slate-500">Feature #2 • Live Demo</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600">Investment Amount (₹)</label>
                <input type="range" min={1500000} max={15000000} step={50000} value={invAmount}
                  onChange={(e) => setInvAmount(Number(e.target.value))} className="w-full accent-blue-600" />
                <div className="flex justify-between text-xs"><span>15L</span><span className="font-mono font-semibold">{formatINR(invAmount)}</span><span>1.5Cr</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600">Appreciation Rate (%/yr)</label>
                  <input type="range" min={6} max={18} step={0.5} value={invRate}
                    onChange={(e) => setInvRate(Number(e.target.value))} className="w-full accent-blue-600" />
                  <div className="text-center"><span className="font-mono font-semibold">{invRate}</span>%</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Investment Period</label>
                  <select value={invYears} onChange={(e) => setInvYears(Number(e.target.value))}
                    className="w-full border rounded-2xl px-3 py-2 text-sm">
                    <option value={5}>5 Years</option>
                    <option value={10}>10 Years</option>
                    <option value={15}>15 Years</option>
                  </select>
                </div>
              </div>
              <div className="pt-3 border-t">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div><div className="text-[10px] text-slate-500">Future Value</div><div className="font-bold text-xl tabular-nums">{formatCr(invFutureValue)}</div></div>
                  <div><div className="text-[10px] text-slate-500">Total ROI</div><div className="font-bold text-xl text-emerald-600 tabular-nums">{invTotalROI}%</div></div>
                  <div><div className="text-[10px] text-slate-500">Annual Rental Yield</div><div className="font-bold text-xl tabular-nums">{invRentalYield}%</div></div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Loan Eligibility Checker */}
          <div className="bg-white border border-slate-200 rounded-3xl p-7">
            <div className="flex items-center gap-x-3 mb-5">
              <FaHandHoldingUsd className="text-3xl text-blue-600" />
              <div>
                <div className="font-bold text-slate-800">AI Loan Eligibility Checker</div>
                <div className="text-xs text-slate-500">Feature #12 • Instant Results</div>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs">Monthly Income (₹)</label>
                  <input type="number" value={loanIncome} onChange={(e) => setLoanIncome(Number(e.target.value))} className="w-full border px-3 py-2 rounded-2xl text-sm" /></div>
                <div><label className="text-xs">Existing EMI (₹)</label>
                  <input type="number" value={loanEmi} onChange={(e) => setLoanEmi(Number(e.target.value))} className="w-full border px-3 py-2 rounded-2xl text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs">Age</label>
                  <input type="number" value={loanAge} onChange={(e) => setLoanAge(Number(e.target.value))} className="w-full border px-3 py-2 rounded-2xl text-sm" /></div>
                <div><label className="text-xs">Tenure (Years)</label>
                  <select value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))} className="w-full border px-3 py-2 rounded-2xl text-sm">
                    <option value={20}>20 Years</option>
                    <option value={25}>25 Years</option>
                    <option value={30}>30 Years</option>
                  </select></div>
              </div>
              <div className="pt-4 border-t">
                <div className="text-xs uppercase tracking-widest text-slate-500 mb-1">MAX ELIGIBLE LOAN</div>
                <div className="font-bold text-3xl md:text-4xl tabular-nums text-slate-800">{formatLakh(loanMaxAmount)}</div>
                <div className="flex justify-between text-xs mt-3">
                  <div>EMI: <span className="font-semibold">{formatINR(loanEMIResult)}</span></div>
                  <div className="text-emerald-600 font-medium">8 Banks Approved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Construction Cost Calculator */}
          <div className="bg-white border border-slate-200 rounded-3xl p-7">
            <div className="flex items-center gap-x-3 mb-5">
              <FaHardHat className="text-3xl text-blue-600" />
              <div>
                <div className="font-bold text-slate-800">Construction Cost Calculator</div>
                <div className="text-xs text-slate-500">Feature #13 • For Self-Build Buyers</div>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-x-3">
                <div><label className="text-xs">Plot Size (sq.ft)</label>
                  <input type="number" value={constSize} onChange={(e) => setConstSize(Number(e.target.value))} className="w-full border px-3 py-2 rounded-2xl" /></div>
                <div><label className="text-xs">Number of Floors</label>
                  <select value={constFloors} onChange={(e) => setConstFloors(Number(e.target.value))} className="w-full border px-3 py-2 rounded-2xl">
                    <option value={1}>G+0 (Ground)</option>
                    <option value={2}>G+1</option>
                    <option value={3}>G+2</option>
                  </select></div>
              </div>
              <div><label className="text-xs">Material Quality</label>
                <select value={constQuality} onChange={(e) => setConstQuality(e.target.value)} className="w-full border px-3 py-2 rounded-2xl">
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                </select></div>
              <div className="pt-4 border-t text-sm">
                <div className="flex justify-between font-bold text-xl text-slate-800">
                  <span>Estimated Total</span>
                  <span className="tabular-nums">{formatLakh(constTotalCost)}</span>
                </div>
                <div className="mt-4 text-[10px] grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-100 rounded p-1.5"><div className="font-mono text-xs">Structure</div><div className="font-semibold">{formatLakh(constStructure)}</div></div>
                  <div className="bg-slate-100 rounded p-1.5"><div className="font-mono text-xs">Finishing</div><div className="font-semibold">{formatLakh(constFinish)}</div></div>
                  <div className="bg-slate-100 rounded p-1.5"><div className="font-mono text-xs">Others</div><div className="font-semibold">{formatLakh(constOther)}</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)' }} className="text-white">
        <div className="max-w-screen-2xl mx-auto px-8 py-16 text-center">
          <div className="max-w-lg mx-auto">
            <h2 className="text-4xl font-bold tracking-tight">Ready to Transform Your Real Estate Sales?</h2>
            <p className="mt-4 text-white/80">
              These 25 features give Jai Santoshi Maa Infrastructure Pvt. Ltd. a significant competitive advantage in the Odisha real estate market.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => openModal('dashboard')}
                className="px-8 py-3.5 bg-white text-slate-900 font-semibold rounded-full flex-1 sm:flex-none hover:bg-slate-100 transition">
                Access Owner Dashboard Demo
              </button>
              <a href="https://briskode.com" target="_blank" rel="noopener noreferrer"
                className="px-8 py-3.5 border border-white/60 hover:bg-white/10 transition rounded-full flex-1 sm:flex-none">
                Talk to Briskode Technology
              </a>
            </div>
            <div className="mt-8 text-xs text-white/60">
              Presented by <span className="font-semibold">BRISKODE TECHNOLOGY</span> • Bhubaneswar, Odisha • www.briskode.com
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MODALS ==================== */}

      {/* AI Property Recommendation Modal (Feature 1) */}
      {showModal === 'ai' && (
        <AIRecommendationModal
          onClose={closeModal}
          onBookVisit={() => openModal('visit')}
        />
      )}

      {/* Live Plot Map Modal (Feature 3) */}
      {showModal === 'plot-map' && (
        <PlotMapModal onClose={closeModal} />
      )}

      {/* AI Sales Assistant Modal (Feature 6) */}
      {showModal === 'chatbot' && (
        <ChatbotModal
          onClose={closeModal}
          onBookVisit={() => openModal('visit')}
        />
      )}

      {/* Site Visit Booking Modal (Feature 7) */}
      {showModal === 'visit' && (
        <SiteVisitModal onClose={closeModal} />
      )}

      {/* Owner Dashboard Modal (Feature 25) */}
      {showModal === 'dashboard' && (
        <OwnerDashboardModal onClose={closeModal} />
      )}

      {/* Generic Feature Modals (Features 4,5,8,9,11,14-23) */}
      {typeof showModal === 'number' && showModal >= 4 && (
        <GenericFeatureModal
          num={showModal}
          onClose={closeModal}
          onShowAI={() => openModal('ai')}
        />
      )}

      {/* Modal animations */}
      <style>{`
        @keyframes modalPopIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .real-estate-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .real-estate-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
        }
      `}</style>
    </div>
  );
}
