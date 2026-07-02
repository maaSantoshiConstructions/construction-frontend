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
import heroBg from '../../assets/hero.png';

const featureList = [
  { num: 1, title: 'AI Property Recommendation System', desc: 'Personalized recommendations based on budget, location preference, plot type & investment goals.', cta: 'TRY LIVE DEMO' },
  { num: 2, title: 'Investment Return Calculator', desc: 'Calculate future value, rental income, ROI & EMI over 5, 10 & 15 years with appreciation projections.', cta: 'OPEN CALCULATOR' },
  { num: 3, title: 'Live Plot Availability Map', desc: 'Real-time interactive township map. Green = Available, Yellow = Reserved, Red = Sold. Instant booking.', cta: 'VIEW LIVE MAP' },
  { num: 4, title: '360° Virtual Site Visit', desc: 'Drone videos, virtual walkthroughs & Street View. Experience the site 24×7 from any device.', cta: 'START VIRTUAL TOUR' },
  { num: 6, title: 'AI Sales Assistant (24×7)', desc: 'Multilingual intelligent chatbot answering plot prices, loan eligibility, RERA status & books visits.', cta: 'CHAT WITH AI NOW' },
  { num: 7, title: 'Smart Site Visit Booking', desc: 'Frictionless booking with auto-assigned executive, instant WhatsApp confirmation & reminders.', cta: 'BOOK NOW' },
  { num: 8, title: 'Customer Referral Program', desc: 'Earn ₹10,000 + Gold Coin + Cashback. Track referrals live with personal dashboard.', cta: 'REFER NOW' },
  { num: 10, title: 'Online Plot Booking', desc: 'Book instantly with ₹5,000–₹25,000 token. Upload Aadhaar, PAN & get instant receipt & agreement.', cta: 'BOOK A PLOT' },
  { num: 12, title: 'AI Loan Eligibility Checker', desc: 'Instantly calculate max eligible loan, EMI & partner banks based on income & obligations.', cta: 'CHECK ELIGIBILITY' },
  { num: 13, title: 'Construction Cost Calculator', desc: 'Detailed cost breakdown for self-build customers based on land size, floors & material quality.', cta: 'CALCULATE' },
  { num: 15, title: 'Dynamic Price Increase Timer', desc: 'Transparent countdown timers showing upcoming price increases to create genuine urgency.', cta: 'VIEW TIMER' },
  { num: 16, title: 'AI Interior Visualizer', desc: 'Upload any room photo & instantly visualize modern, luxury, Scandinavian or traditional interiors.', cta: 'VISUALIZE' },
  { num: 17, title: 'Plot Direction Analyzer', desc: 'Vastu analysis with score, sunlight, wind direction & East/North facing benefits.', cta: 'ANALYZE' },
  { num: 18, title: 'Nearby Location Explorer', desc: 'Interactive map showing schools, hospitals, malls, temples & commute times in minutes.', cta: 'EXPLORE' },
  { num: 19, title: 'Legal Document Verification', desc: 'Secure online viewer for Sale Deed, Mutation, ROR, Layout Approval & all NOCs.', cta: 'VIEW DOCUMENTS' },
  { num: 20, title: 'WhatsApp CRM Integration', desc: 'Every inquiry instantly routed to sales executive + CRM + WhatsApp with zero lead leakage.', cta: 'LEARN MORE' },
  { num: 21, title: 'AI Follow-up Automation', desc: 'Intelligent nurturing sequences via WhatsApp, email & SMS based on lead behavior.', cta: 'AUTOMATE' },
  { num: 22, title: 'Live Customer Reviews', desc: 'Video testimonials, Google reviews & authentic before/after construction stories.', cta: 'WATCH REVIEWS' },
  { num: 25, title: 'Owner & Investor Dashboard', desc: 'Complete self-service portal to view properties, payments, documents, updates & earn referral rewards.', cta: 'ACCESS DASHBOARD' },
];

const projectsData = [
  { id: 1, name: 'Santoshi Enclave - Phase 1', location: 'Patia, Bhubaneswar', price: '₹2,450/sq.ft', status: '68% Sold', statusColor: 'emerald', img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80', tags: ['1200\u20134000 sqft plots', 'North & East facing'], plots: 142 },
  { id: 2, name: 'Santoshi Villas', location: 'Chandrasekharpur, Bhubaneswar', price: '₹4,850/sq.ft', status: 'Phase 2 Launching', statusColor: 'amber', img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', tags: ['3 & 4 BHK Villas', 'Gated Community'], plots: 37 },
  { id: 3, name: 'Santoshi Greens', location: 'Khandagiri, Bhubaneswar', price: '₹1,950/sq.ft', status: 'New Launch', statusColor: 'emerald', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56b08?w=800&q=80', tags: ['Affordable Plots', 'Near NH-16'], plots: 89 },
];

export default function Home() {
  const { showModal, openModal, closeModal } = useModal();
  const [projects, setProjects] = useState([]);

  const [invAmount, setInvAmount] = useState(4500000);
  const [invRate, setInvRate] = useState(11);
  const [invYears, setInvYears] = useState(10);

  const [loanIncome, setLoanIncome] = useState(85000);
  const [loanEmi, setLoanEmi] = useState(12000);
  const [loanAge, setLoanAge] = useState(34);
  const [loanTenure, setLoanTenure] = useState(25);

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

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeModal]);

  const showFeature = (num) => {
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
      {/* HERO */}
      <header className="relative min-h-[620px] h-[100dvh] flex items-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.60)), url(${heroBg})`,
          backgroundSize: 'cover', backgroundPosition: 'center'
        }}>
        <div className="absolute inset-0 animate-hero-bg pointer-events-none"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1600585154340-be6161a56b08?w=2000&q=80)`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.3
          }} />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-purple-900/20 pointer-events-none" />
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none animate-float-1" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none animate-float-2" />
        <div className="max-w-screen-2xl mx-auto px-8 pt-28 pb-16 w-full relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-x-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 shadow-sm border border-white/60 opacity-0 animate-slide-down"
              style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-emerald-700">RERA APPROVED • BHUBANESWAR, ODISHA</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[1.02] font-bold tracking-tighter text-white font-heading opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              Your Dream Plot.<br />
              <span className="bg-gradient-to-r from-blue-300 via-white to-blue-200 bg-clip-text text-transparent">Intelligent Buying.</span>
            </h1>
            <p className="mt-6 max-w-lg text-xl text-white/80 leading-relaxed opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              Experience India's most advanced real estate platform. 24×7 AI-powered sales, virtual tours, live plot maps & transparent construction tracking.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
              <button onClick={() => openModal('ai')}
                className="group flex items-center gap-x-3 bg-white hover:bg-blue-50 text-slate-900 font-semibold px-8 h-14 rounded-full text-base shadow-lg shadow-black/10 hover:shadow-xl transition-all duration-300 active:scale-[0.98]">
                <span>Find My Perfect Plot with AI</span>
                <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-x-3 border-2 border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-semibold px-7 h-14 rounded-full text-base transition-all duration-300">
                <i className="fa-solid fa-play mr-1" />
                <span>Watch 1:42 Video Tour</span>
              </button>
            </div>
            <div className="mt-10 flex items-center gap-x-6 text-sm opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
              <div className="flex -space-x-2">
                {[28, 47, 12].map((n, i) => (
                  <img key={i} src={`https://i.pravatar.cc/28?img=${n}`} className="w-7 h-7 rounded-full ring-2 ring-white/70 object-cover" alt="" />
                ))}
              </div>
              <div className="text-white/80">
                <span className="font-semibold text-white">2,847+</span> families already found their home
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block z-10 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <div className="flex flex-col items-center text-white/50 text-xs tracking-[3px]">
            <span>SCROLL TO EXPLORE</span>
            <i className="fa-solid fa-chevron-down mt-1 animate-bounce" />
          </div>
        </div>
      </header>

      {/* TRUST BAR */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-8 py-5">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center gap-x-8 text-slate-600">
              <div className="flex items-center gap-x-2"><i className="fa-solid fa-shield-halved text-emerald-500" /> <span className="font-medium">RERA Registered</span></div>
              <div className="flex items-center gap-x-2"><i className="fa-solid fa-headset text-emerald-500" /> <span className="font-medium">24×7 AI Support</span></div>
              <div className="flex items-center gap-x-2"><i className="fa-solid fa-map-marked text-emerald-500" /> <span className="font-medium">Live Plot Tracking</span></div>
            </div>
            <div className="text-xs px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full font-semibold flex items-center gap-x-1.5">
              <i className="fa-solid fa-check-double" />
              <span>100% Transparent Construction Updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY */}
      <section className="max-w-screen-2xl mx-auto px-8 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold tracking-widest rounded-full mb-5">EXECUTIVE SUMMARY</div>
          <h2 className="section-header font-heading">The website is not just a brochure.<br />It is a <span className="text-blue-600">24×7 Sales & Lead Generation Platform.</span></h2>
          <div className="mt-6 text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed">
            For Jai Santoshi Maa Infrastructure Pvt. Ltd., Briskode Technology has built a complete suite of modern, AI-powered features designed specifically for the Indian real estate market. From intelligent property matching to automated follow-ups and transparent construction tracking — every feature is built to build trust, create urgency, and drive conversions.
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="max-w-screen-2xl mx-auto px-8 pb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold tracking-widest rounded-full mb-4">OUR FLAGSHIP PROJECT</div>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 font-heading">Santoshi Enclave</h3>
            <p className="text-slate-500 mt-1">Premium plotted development • Patia, Bhubaneswar • RERA: OR/06/2025/001234</p>
          </div>
          <Link to="/projects" className="hidden md:flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            View All Projects <i className="ml-2 fa-solid fa-arrow-right" />
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
              <div key={i} className="real-estate-card bg-white rounded-2xl overflow-hidden group shadow-sm hover:shadow-2xl">
                <div className="relative h-56 overflow-hidden">
                  <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-x-1.5">
                    <div className={`w-2 h-2 rounded-full ${isStatusColor === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <span className="font-bold text-slate-700">{status}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-xl text-slate-800">{name}</div>
                      <div className="text-sm text-slate-400">{location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Starting from</div>
                      <div className="font-bold text-xl text-slate-900">{price}</div>
                    </div>
                  </div>
                  <div className="my-4 flex gap-x-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-medium">{p.tags?.[0] || 'Prime plots'}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-medium">{p.tags?.[1] || 'Premium location'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-sm">
                      <span className="font-semibold text-slate-800">{plotsAvail}</span>
                      <span className="text-slate-400"> plots available</span>
                    </div>
                    <button onClick={() => openModal('plot-map')} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      VIEW LIVE MAP <i className="fa-solid fa-map ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 25 FEATURES */}
      <section id="features" className="bg-gradient-to-b from-slate-50 to-white py-24 border-t border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-extrabold tracking-widest rounded-full mb-4">POWERED BY BRISKODE TECHNOLOGY</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 font-heading">25 Powerful Features</h2>
            <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">Every tool designed to convert visitors into buyers, build trust and deliver a world-class digital experience.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {featureList.map((feat) => (
              <div key={feat.num} onClick={() => showFeature(feat.num)}
                className="feature-card cursor-pointer bg-white rounded-2xl p-6 group">
                <div className="flex items-start gap-x-4">
                  <div className="feature-number w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-sm font-extrabold">
                    {String(feat.num).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm leading-snug group-hover:text-blue-700 transition-colors text-slate-800">{feat.title}</div>
                    <div className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{feat.desc}</div>
                    <div className="mt-3 text-[10px] text-emerald-600 font-semibold flex items-center gap-1.5">
                      <i className="fa-solid fa-rocket" /> {feat.cta}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => document.getElementById('calculators-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 text-sm px-6 py-3 font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all rounded-full text-slate-600 hover:text-slate-800">
              <span>Jump to Interactive Calculators</span> <i className="fa-solid fa-arrow-down" />
            </button>
          </div>
        </div>
      </section>

      {/* CALCULATORS */}
      <section id="calculators-section" className="max-w-screen-2xl mx-auto px-8 py-24">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-extrabold tracking-widest rounded-full mb-4">POWERFUL TOOLS</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 font-heading">Try Our Interactive Tools</h2>
          <p className="text-slate-500 mt-3 text-lg">Real calculators used by thousands of smart buyers in Odisha</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Investment Calculator */}
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg shadow-lg shadow-blue-500/20">
                <i className="fa-solid fa-chart-line" />
              </div>
              <div>
                <div className="font-bold text-slate-800">Investment Return Calculator</div>
                <div className="text-xs text-slate-400">Feature #2 • Live Demo</div>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Investment Amount (₹)</label>
                <input type="range" min={1500000} max={15000000} step={50000} value={invAmount}
                  onChange={(e) => setInvAmount(Number(e.target.value))} className="w-full accent-blue-600" />
                <div className="flex justify-between text-xs mt-1"><span className="text-slate-400">15L</span><span className="font-mono font-semibold text-slate-700">{formatINR(invAmount)}</span><span className="text-slate-400">1.5Cr</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Rate (%/yr)</label>
                  <input type="range" min={6} max={18} step={0.5} value={invRate}
                    onChange={(e) => setInvRate(Number(e.target.value))} className="w-full accent-blue-600" />
                  <div className="text-center mt-0.5"><span className="font-mono font-semibold text-slate-700">{invRate}</span><span className="text-slate-400">%</span></div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Period</label>
                  <select value={invYears} onChange={(e) => setInvYears(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-shadow">
                    <option value={5}>5 Years</option>
                    <option value={10}>10 Years</option>
                    <option value={15}>15 Years</option>
                  </select>
                </div>
              </div>
              <div className="pt-5 border-t border-slate-100">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Future Value</div>
                    <div className="font-bold text-base md:text-lg text-slate-800 tabular-nums mt-0.5">{formatCr(invFutureValue)}</div>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <div className="text-[10px] text-emerald-600 uppercase tracking-wider">Total ROI</div>
                    <div className="font-bold text-base md:text-lg text-emerald-700 tabular-nums mt-0.5">{invTotalROI}%</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Rental Yield</div>
                    <div className="font-bold text-base md:text-lg text-slate-800 tabular-nums mt-0.5">{invRentalYield}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Calculator */}
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg shadow-lg shadow-blue-500/20">
                <i className="fa-solid fa-hand-holding-usd" />
              </div>
              <div>
                <div className="font-bold text-slate-800">AI Loan Eligibility Checker</div>
                <div className="text-xs text-slate-400">Feature #12 • Instant Results</div>
              </div>
            </div>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-slate-500">Monthly Income (₹)</label>
                  <input type="number" value={loanIncome} onChange={(e) => setLoanIncome(Number(e.target.value))} className="w-full mt-1 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-shadow" /></div>
                <div><label className="text-xs font-semibold text-slate-500">Existing EMI (₹)</label>
                  <input type="number" value={loanEmi} onChange={(e) => setLoanEmi(Number(e.target.value))} className="w-full mt-1 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-shadow" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-slate-500">Age</label>
                  <input type="number" value={loanAge} onChange={(e) => setLoanAge(Number(e.target.value))} className="w-full mt-1 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-shadow" /></div>
                <div><label className="text-xs font-semibold text-slate-500">Tenure (Years)</label>
                  <select value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))} className="w-full mt-1 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-shadow">
                    <option value={20}>20 Years</option>
                    <option value={25}>25 Years</option>
                    <option value={30}>30 Years</option>
                  </select></div>
              </div>
              <div className="pt-5 border-t border-slate-100">
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">MAX ELIGIBLE LOAN</div>
                <div className="font-bold text-3xl md:text-4xl tabular-nums text-slate-800 mt-1">{formatLakh(loanMaxAmount)}</div>
                <div className="flex justify-between items-center text-xs mt-3">
                  <div>EMI: <span className="font-semibold text-slate-700">{formatINR(loanEMIResult)}</span></div>
                  <div className="bg-emerald-50 text-emerald-600 font-semibold px-3 py-1 rounded-full">8 Banks Approved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Construction Calculator */}
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg shadow-lg shadow-blue-500/20">
                <i className="fa-solid fa-hard-hat" />
              </div>
              <div>
                <div className="font-bold text-slate-800">Construction Cost Calculator</div>
                <div className="text-xs text-slate-400">Feature #13 • For Self-Build Buyers</div>
              </div>
            </div>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-x-3">
                <div><label className="text-xs font-semibold text-slate-500">Plot Size (sq.ft)</label>
                  <input type="number" value={constSize} onChange={(e) => setConstSize(Number(e.target.value))} className="w-full mt-1 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-shadow" /></div>
                <div><label className="text-xs font-semibold text-slate-500">Floors</label>
                  <select value={constFloors} onChange={(e) => setConstFloors(Number(e.target.value))} className="w-full mt-1 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-shadow">
                    <option value={1}>G+0 (Ground)</option>
                    <option value={2}>G+1</option>
                    <option value={3}>G+2</option>
                  </select></div>
              </div>
              <div><label className="text-xs font-semibold text-slate-500">Material Quality</label>
                <select value={constQuality} onChange={(e) => setConstQuality(e.target.value)} className="w-full mt-1 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-shadow">
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                </select></div>
              <div className="pt-5 border-t border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-slate-500">Estimated Total</span>
                  <span className="font-bold text-2xl text-slate-800 tabular-nums">{formatLakh(constTotalCost)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ['Structure', formatLakh(constStructure)],
                    ['Finishing', formatLakh(constFinish)],
                    ['Others', formatLakh(constOther)],
                  ].map(([label, val], i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-2.5 text-center">
                      <div className="text-[10px] text-slate-400 font-medium">{label}</div>
                      <div className="font-bold text-xs text-slate-700 tabular-nums mt-0.5">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="premium-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-screen-2xl mx-auto px-8 py-20 text-center relative z-10">
          <div className="max-w-xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-heading leading-tight">Ready to Transform Your Real Estate Sales?</h2>
            <p className="mt-5 text-lg text-white/70 leading-relaxed">These 25 features give Jai Santoshi Maa Infrastructure Pvt. Ltd. a significant competitive advantage in the Odisha real estate market.</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => openModal('dashboard')}
                className="px-10 py-4 bg-white text-slate-900 font-bold rounded-full flex-1 sm:flex-none hover:bg-slate-50 transition-all duration-300 active:scale-[0.98] shadow-xl shadow-black/10">
                Access Owner Dashboard Demo
              </button>
              <a href="https://briskode.com" target="_blank" rel="noopener noreferrer"
                className="px-10 py-4 border-2 border-white/20 hover:border-white/40 hover:bg-white/10 font-semibold rounded-full flex-1 sm:flex-none transition-all duration-300">
                Talk to Briskode Technology
              </a>
            </div>
            <div className="mt-10 text-sm text-white/40">
              Presented by <span className="font-semibold text-white/60">BRISKODE TECHNOLOGY</span> • Bhubaneswar, Odisha • www.briskode.com
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs">
        <div className="max-w-screen-2xl mx-auto px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-y-3">
          <div>© 2026 Jai Santoshi Maa Infrastructure Pvt. Ltd. All rights reserved. | RERA compliant digital platform</div>
          <div className="flex items-center gap-x-5">
            <div>Powered by <span className="font-semibold text-white">Briskode Technology</span></div>
            <div className="hidden md:block">|</div>
            <div>Bhubaneswar, Odisha</div>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {showModal === 'ai' && <AIRecommendationModal onClose={closeModal} onBookVisit={() => openModal('visit')} />}
      {showModal === 'plot-map' && <PlotMapModal onClose={closeModal} />}
      {showModal === 'chatbot' && <ChatbotModal onClose={closeModal} onBookVisit={() => openModal('visit')} />}
      {showModal === 'visit' && <SiteVisitModal onClose={closeModal} />}
      {showModal === 'dashboard' && <OwnerDashboardModal onClose={closeModal} />}
      {typeof showModal === 'number' && showModal >= 4 && (
        <GenericFeatureModal num={showModal} onClose={closeModal} onShowAI={() => openModal('ai')} />
      )}
    </div>
  );
}
