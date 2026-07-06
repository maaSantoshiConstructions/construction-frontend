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
  { id: 1, name: 'Santoshi Enclave - Phase 1', location: 'Patia, Bhubaneswar', price: '₹2,450/sq.ft', status: '68% Sold', statusColor: 'blue', img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80', tags: ['1200\u20134000 sqft plots', 'North & East facing'], plots: 142 },
  { id: 2, name: 'Santoshi Villas', location: 'Chandrasekharpur, Bhubaneswar', price: '₹4,850/sq.ft', status: 'Phase 2 Launching', statusColor: 'gold', img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', tags: ['3 & 4 BHK Villas', 'Gated Community'], plots: 37 },
  { id: 3, name: 'Santoshi Greens', location: 'Khandagiri, Bhubaneswar', price: '₹1,950/sq.ft', status: 'New Launch', statusColor: 'blue', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56b08?w=800&q=80', tags: ['Affordable Plots', 'Near NH-16'], plots: 89 },
];

export default function Home() {
  const { showModal, openModal, closeModal } = useModal();
  const [projects, setProjects] = useState([]);
  const [typewriterDone, setTypewriterDone] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');

  useEffect(() => {
    const text = 'Intelligent Buying.';
    let i = 0;
    const startTimeout = setTimeout(() => {
      setTypewriterText('');
      setTypewriterDone(false);
      const interval = setInterval(() => {
        setTypewriterText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setTypewriterDone(true);
        }
      }, 60);
    }, 1200);
    return () => clearTimeout(startTimeout);
  }, []);

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
      <header className="relative min-h-[620px] h-[100dvh] flex items-center overflow-hidden bg-[#081426]"
        style={{
          backgroundImage: `linear-gradient(rgba(8,20,38,0.85), rgba(8,20,38,0.65)), url(${heroBg})`,
          backgroundSize: 'cover', backgroundPosition: 'center'
        }}>
        <div className="absolute inset-0 animate-hero-bg pointer-events-none"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1600585154340-be6161a56b08?w=2000&q=80)`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.15
          }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#355CFF]/10 via-transparent to-[#6D28D9]/10 pointer-events-none animate-gradient-shift" />
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#355CFF]/10 rounded-full blur-3xl pointer-events-none animate-blob" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#6D28D9]/10 rounded-full blur-3xl pointer-events-none animate-float-2" />
        <div className="absolute top-1/3 -left-24 w-64 h-64 bg-[#D4A64A]/8 rounded-full blur-3xl pointer-events-none animate-float-3" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#355CFF]/8 rounded-full blur-3xl pointer-events-none animate-float-1" />
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full relative z-10">
          <div className="flex items-center gap-16 w-full">
            <div className="flex-1 max-w-xl">
              <div className="inline-flex items-center gap-x-2 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 shadow-sm border border-white/10 opacity-0 animate-slide-down"
                style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                <div className="w-2 h-2 bg-[#D4A64A] rounded-full animate-pulse" />
                <span className="text-xs font-bold tracking-widest text-[#D4A64A]">SMART REAL ESTATE • AI POWERED</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[1.02] font-bold tracking-tighter text-white font-heading opacity-0 animate-fade-in-up"
                style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                Build Your Future.<br />
                <span className="bg-gradient-to-r from-[#D4A64A] via-white to-[#F5D68E] bg-clip-text text-transparent animate-text-shimmer">
                  {typewriterText || '\u00A0'}
                  {!typewriterDone && <span className="typewriter-cursor">&nbsp;</span>}
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-xl text-white/60 leading-relaxed opacity-0 animate-fade-in-up"
                style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                Experience India's most advanced real estate platform. 24×7 AI-powered sales, virtual tours, live plot maps & transparent construction tracking.
              </p>
              <div className="mt-10 flex flex-wrap gap-4 opacity-0 animate-fade-in-up"
                style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
                <button onClick={() => openModal('ai')}
                  className="group relative flex items-center gap-x-3 bg-gradient-to-r from-[#D4A64A] to-[#F5D68E] text-[#081426] font-bold px-8 h-14 rounded-full text-base shadow-lg shadow-[#D4A64A]/20 hover:shadow-xl transition-all duration-300 active:scale-[0.98] animate-cta-ring">
                  <span>Explore Projects</span>
                  <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-x-3 border-2 border-white/10 hover:border-[#D4A64A]/50 hover:bg-white/5 text-white font-semibold px-7 h-14 rounded-full text-base transition-all duration-300">
                  <i className="fa-solid fa-list mr-1" />
                  <span>See 25 Features</span>
                </button>
              </div>
              <div className="mt-10 flex items-center gap-x-6 text-sm opacity-0 animate-fade-in-up"
                style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
                <div className="flex -space-x-2">
                  {[28, 47, 12].map((n, i) => (
                    <img key={i} src={`https://i.pravatar.cc/28?img=${n}`} className="w-7 h-7 rounded-full ring-2 ring-white/20 object-cover" alt="" />
                  ))}
                </div>
                <div className="text-white/50">
                  <span className="font-semibold text-white">2,847+</span> families already found their home
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm opacity-0 animate-fade-in-up"
                style={{ animationDelay: '1.0s', animationFillMode: 'forwards' }}>
                <div><span className="stat-number text-lg">25+</span> <span className="text-white/40">Smart Features</span></div>
                <div><span className="stat-number text-lg">500+</span> <span className="text-white/40">Happy Customers</span></div>
                <div><span className="stat-number text-lg">100+</span> <span className="text-white/40">Acres Delivered</span></div>
              </div>
            </div>
            <div className="flex-1 hidden lg:block relative">
              <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-black/30">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56b08?w=800&q=80"
                  className="w-full h-full object-cover"
                  alt="Premium Property"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081426]/60 via-transparent to-transparent" />
              </div>
              <div className="floating-card absolute -bottom-6 -left-6 p-5 w-64">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#355CFF] to-[#6D28D9] flex items-center justify-center text-white text-sm font-bold">SM</div>
                  <div>
                    <div className="text-white text-sm font-semibold">Santoshi Enclave</div>
                    <div className="text-[#D4A64A] text-xs">Premium Plots</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10">
                  <div>
                    <div className="text-[10px] text-white/40">Starting From</div>
                    <div className="text-white font-bold">₹2,450/sq.ft</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40">Plots Left</div>
                    <div className="text-[#D4A64A] font-bold">37 Only</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block z-10 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <div className="flex flex-col items-center text-white/40 text-xs tracking-[3px]">
            <span>SCROLL TO EXPLORE</span>
            <i className="fa-solid fa-chevron-down mt-1 animate-bounce" />
          </div>
        </div>
      </header>

      {/* TRUST BAR */}
      <div className="bg-[#13203C]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center gap-x-8 text-white/70">
              <div className="flex items-center gap-x-2"><i className="fa-solid fa-shield-halved text-[#D4A64A]" /> <span className="font-medium">RERA Registered</span></div>
              <div className="flex items-center gap-x-2"><i className="fa-solid fa-headset text-[#355CFF]" /> <span className="font-medium">24×7 AI Support</span></div>
              <div className="flex items-center gap-x-2"><i className="fa-solid fa-map-marked text-[#D4A64A]" /> <span className="font-medium">Live Plot Tracking</span></div>
            </div>
            <div className="text-xs px-4 py-1.5 bg-[#D4A64A]/10 text-[#D4A64A] rounded-full font-semibold flex items-center gap-x-1.5 border border-[#D4A64A]/20">
              <i className="fa-solid fa-check-double" />
              <span>100% Transparent Construction Updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY */}
      <section className="bg-[#081426]">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4A64A]/10 text-[#D4A64A] text-xs font-bold tracking-widest rounded-full mb-5 border border-[#D4A64A]/20">EXECUTIVE SUMMARY</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-heading leading-tight">The website is not just a brochure.<br />It is a <span className="bg-gradient-to-r from-[#D4A64A] to-[#F5D68E] bg-clip-text text-transparent">24×7 Sales & Lead Generation Platform.</span></h2>
            <div className="mt-6 text-lg text-white/50 max-w-3xl mx-auto leading-relaxed">
              For Jai Santoshi Maa Infrastructure Pvt. Ltd., Briskode Technology has built a complete suite of modern, AI-powered features designed specifically for the Indian real estate market. From intelligent property matching to automated follow-ups and transparent construction tracking — every feature is built to build trust, create urgency, and drive conversions.
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="bg-[#081426] border-t border-white/5">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4A64A]/10 text-[#D4A64A] text-xs font-bold tracking-widest rounded-full mb-4 border border-[#D4A64A]/20">OUR FLAGSHIP PROJECT</div>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-heading">Santoshi Enclave</h3>
              <p className="text-white/40 mt-1">Premium plotted development • Patia, Bhubaneswar • RERA: OR/06/2025/001234</p>
            </div>
            <Link to="/projects" className="hidden md:flex items-center text-sm font-semibold text-[#D4A64A] hover:text-[#F5D68E] transition-colors">
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
              <div key={i} className="real-estate-card bg-[#13203C]/50 rounded-2xl overflow-hidden group shadow-lg hover:shadow-[#355CFF]/10">
                <div className="relative h-56 overflow-hidden">
                  <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081426]/60 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 bg-[#081426]/80 backdrop-blur-sm text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-x-1.5 border border-white/10">
                    <div className={`w-2 h-2 rounded-full ${isStatusColor === 'gold' ? 'bg-[#D4A64A]' : 'bg-[#355CFF]'}`} />
                    <span className="font-bold text-white">{status}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-xl text-white">{name}</div>
                      <div className="text-sm text-white/40">{location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">Starting from</div>
                      <div className="font-bold text-xl bg-gradient-to-r from-[#D4A64A] to-[#F5D68E] bg-clip-text text-transparent">{price}</div>
                    </div>
                  </div>
                  <div className="my-4 flex gap-x-3">
                    <span className="text-xs bg-white/5 text-white/70 px-3 py-1.5 rounded-full font-medium">{p.tags?.[0] || 'Prime plots'}</span>
                    <span className="text-xs bg-white/5 text-white/70 px-3 py-1.5 rounded-full font-medium">{p.tags?.[1] || 'Premium location'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="text-sm">
                      <span className="font-semibold text-white">{plotsAvail}</span>
                      <span className="text-white/40"> plots available</span>
                    </div>
                    <button onClick={() => openModal('plot-map')} className="inline-flex items-center gap-1 text-xs font-semibold bg-[#355CFF]/10 text-[#355CFF] hover:bg-[#355CFF]/20 px-3 py-1.5 rounded-full transition-colors">
                      VIEW LIVE MAP <i className="fa-solid fa-map ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </section>

      {/* 25 FEATURES */}
      <section id="features" className="bg-[#081426] py-24 lg:py-32 border-t border-white/5 border-b border-white/5">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4A64A]/10 text-[#D4A64A] text-xs font-extrabold tracking-widest rounded-full mb-4 border border-[#D4A64A]/20">POWERED BY BRISKODE TECHNOLOGY</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-heading">25 Powerful Features</h2>
            <p className="mt-4 text-lg text-white/50 max-w-xl mx-auto">Every tool designed to convert visitors into buyers, build trust and deliver a world-class digital experience.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {featureList.map((feat) => (
              <div key={feat.num} onClick={() => showFeature(feat.num)}
                className="feature-card cursor-pointer rounded-2xl p-6 group">
                <div className="flex items-start gap-x-4">
                  <div className="feature-number w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-sm font-extrabold">
                    {String(feat.num).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm leading-snug group-hover:text-[#D4A64A] transition-colors text-white/90">{feat.title}</div>
                    <div className="text-xs text-white/40 mt-1.5 line-clamp-2 leading-relaxed">{feat.desc}</div>
                    <div className="mt-3 text-[10px] text-[#D4A64A] font-semibold flex items-center gap-1.5">
                      <i className="fa-solid fa-rocket" /> {feat.cta}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => document.getElementById('calculators-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 text-sm px-6 py-3 font-semibold border border-white/10 hover:border-[#D4A64A]/30 hover:bg-white/5 transition-all rounded-full text-white/60 hover:text-white">
              <span>Jump to Interactive Calculators</span> <i className="fa-solid fa-arrow-down" />
            </button>
          </div>
        </div>
      </section>

      {/* CALCULATORS */}
      <section id="calculators-section" className="bg-[#F7F9FC]">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#355CFF]/10 text-[#355CFF] text-xs font-extrabold tracking-widest rounded-full mb-4">POWERFUL TOOLS</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1F2937] font-heading">Try Our Interactive Tools</h2>
          <p className="text-[#1F2937]/60 mt-3 text-lg">Real calculators used by thousands of smart buyers in Odisha</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Investment Calculator */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#355CFF] to-[#6D28D9] flex items-center justify-center text-white text-lg shadow-lg shadow-[#355CFF]/20">
                <i className="fa-solid fa-chart-line" />
              </div>
              <div>
                <div className="font-bold text-[#1F2937]">Investment Return Calculator</div>
                <div className="text-xs text-[#1F2937]/40">Feature #2 • Live Demo</div>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-[#1F2937]/60 uppercase tracking-wider mb-1 block">Investment Amount (₹)</label>
                <input type="range" min={1500000} max={15000000} step={50000} value={invAmount}
                  onChange={(e) => setInvAmount(Number(e.target.value))} className="w-full accent-[#355CFF]" />
                <div className="flex justify-between text-xs mt-1"><span className="text-[#1F2937]/40">15L</span><span className="font-mono font-semibold text-[#1F2937]">{formatINR(invAmount)}</span><span className="text-[#1F2937]/40">1.5Cr</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#1F2937]/60 uppercase tracking-wider mb-1 block">Rate (%/yr)</label>
                  <input type="range" min={6} max={18} step={0.5} value={invRate}
                    onChange={(e) => setInvRate(Number(e.target.value))} className="w-full accent-[#355CFF]" />
                  <div className="text-center mt-0.5"><span className="font-mono font-semibold text-[#1F2937]">{invRate}</span><span className="text-[#1F2937]/40">%</span></div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1F2937]/60 uppercase tracking-wider mb-1 block">Period</label>
                  <select value={invYears} onChange={(e) => setInvYears(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-[#355CFF]/20 focus:border-[#355CFF] transition-shadow">
                    <option value={5}>5 Years</option>
                    <option value={10}>10 Years</option>
                    <option value={15}>15 Years</option>
                  </select>
                </div>
              </div>
              <div className="pt-5 border-t border-slate-100">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-[10px] text-[#1F2937]/40 uppercase tracking-wider">Future Value</div>
                    <div className="font-bold text-base md:text-lg text-[#1F2937] tabular-nums mt-0.5">{formatCr(invFutureValue)}</div>
                  </div>
                  <div className="bg-[#355CFF]/5 rounded-xl p-3">
                    <div className="text-[10px] text-[#355CFF] uppercase tracking-wider">Total ROI</div>
                    <div className="font-bold text-base md:text-lg text-[#355CFF] tabular-nums mt-0.5">{invTotalROI}%</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-[10px] text-[#1F2937]/40 uppercase tracking-wider">Rental Yield</div>
                    <div className="font-bold text-base md:text-lg text-[#1F2937] tabular-nums mt-0.5">{invRentalYield}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Calculator */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#355CFF] to-[#6D28D9] flex items-center justify-center text-white text-lg shadow-lg shadow-[#355CFF]/20">
                <i className="fa-solid fa-hand-holding-usd" />
              </div>
              <div>
                <div className="font-bold text-[#1F2937]">AI Loan Eligibility Checker</div>
                <div className="text-xs text-[#1F2937]/40">Feature #12 • Instant Results</div>
              </div>
            </div>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-[#1F2937]/60">Monthly Income (₹)</label>
                  <input type="number" value={loanIncome} onChange={(e) => setLoanIncome(Number(e.target.value))} className="w-full mt-1 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#355CFF]/20 focus:border-[#355CFF] transition-shadow" /></div>
                <div><label className="text-xs font-semibold text-[#1F2937]/60">Existing EMI (₹)</label>
                  <input type="number" value={loanEmi} onChange={(e) => setLoanEmi(Number(e.target.value))} className="w-full mt-1 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#355CFF]/20 focus:border-[#355CFF] transition-shadow" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-[#1F2937]/60">Age</label>
                  <input type="number" value={loanAge} onChange={(e) => setLoanAge(Number(e.target.value))} className="w-full mt-1 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#355CFF]/20 focus:border-[#355CFF] transition-shadow" /></div>
                <div><label className="text-xs font-semibold text-[#1F2937]/60">Tenure (Years)</label>
                  <select value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))} className="w-full mt-1 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-[#355CFF]/20 focus:border-[#355CFF] transition-shadow">
                    <option value={20}>20 Years</option>
                    <option value={25}>25 Years</option>
                    <option value={30}>30 Years</option>
                  </select></div>
              </div>
              <div className="pt-5 border-t border-slate-100">
                <div className="text-[10px] uppercase tracking-widest text-[#1F2937]/40 font-semibold">MAX ELIGIBLE LOAN</div>
                <div className="font-bold text-3xl md:text-4xl tabular-nums text-[#1F2937] mt-1">{formatLakh(loanMaxAmount)}</div>
                <div className="flex justify-between items-center text-xs mt-3">
                  <div>EMI: <span className="font-semibold text-[#1F2937]">{formatINR(loanEMIResult)}</span></div>
                  <div className="bg-[#355CFF]/10 text-[#355CFF] font-semibold px-3 py-1 rounded-full">8 Banks Approved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Construction Calculator */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#355CFF] to-[#6D28D9] flex items-center justify-center text-white text-lg shadow-lg shadow-[#355CFF]/20">
                <i className="fa-solid fa-hard-hat" />
              </div>
              <div>
                <div className="font-bold text-[#1F2937]">Construction Cost Calculator</div>
                <div className="text-xs text-[#1F2937]/40">Feature #13 • For Self-Build Buyers</div>
              </div>
            </div>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-x-3">
                <div><label className="text-xs font-semibold text-[#1F2937]/60">Plot Size (sq.ft)</label>
                  <input type="number" value={constSize} onChange={(e) => setConstSize(Number(e.target.value))} className="w-full mt-1 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#355CFF]/20 focus:border-[#355CFF] transition-shadow" /></div>
                <div><label className="text-xs font-semibold text-[#1F2937]/60">Floors</label>
                  <select value={constFloors} onChange={(e) => setConstFloors(Number(e.target.value))} className="w-full mt-1 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-[#355CFF]/20 focus:border-[#355CFF] transition-shadow">
                    <option value={1}>G+0 (Ground)</option>
                    <option value={2}>G+1</option>
                    <option value={3}>G+2</option>
                  </select></div>
              </div>
              <div><label className="text-xs font-semibold text-[#1F2937]/60">Material Quality</label>
                <select value={constQuality} onChange={(e) => setConstQuality(e.target.value)} className="w-full mt-1 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-[#355CFF]/20 focus:border-[#355CFF] transition-shadow">
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                </select></div>
              <div className="pt-5 border-t border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-[#1F2937]/60">Estimated Total</span>
                  <span className="font-bold text-2xl text-[#1F2937] tabular-nums">{formatLakh(constTotalCost)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ['Structure', formatLakh(constStructure)],
                    ['Finishing', formatLakh(constFinish)],
                    ['Others', formatLakh(constOther)],
                  ].map(([label, val], i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-2.5 text-center">
                      <div className="text-[10px] text-[#1F2937]/40 font-medium">{label}</div>
                      <div className="font-bold text-xs text-[#1F2937] tabular-nums mt-0.5">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>
      <section className="premium-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#355CFF]/5 to-[#6D28D9]/5 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#355CFF]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#6D28D9]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center relative z-10">
          <div className="max-w-xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-heading leading-tight">Ready to Transform Your Real Estate Sales?</h2>
            <p className="mt-5 text-lg text-white/60 leading-relaxed">These 25 features give Jai Santoshi Maa Infrastructure Pvt. Ltd. a significant competitive advantage in the Odisha real estate market.</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => openModal('dashboard')}
                className="px-10 py-4 bg-gradient-to-r from-[#D4A64A] to-[#F5D68E] text-[#081426] font-bold rounded-full flex-1 sm:flex-none hover:opacity-90 transition-all duration-300 active:scale-[0.98] shadow-xl shadow-[#D4A64A]/20">
                Access Owner Dashboard Demo
              </button>
              <a href="https://briskode.com" target="_blank" rel="noopener noreferrer"
                className="px-10 py-4 border-2 border-white/10 hover:border-white/30 hover:bg-white/5 font-semibold rounded-full flex-1 sm:flex-none transition-all duration-300">
                Talk to Briskode Technology
              </a>
            </div>
            <div className="mt-10 text-sm text-white/30">
              Presented by <span className="font-semibold text-[#D4A64A]">BRISKODE TECHNOLOGY</span> • Bhubaneswar, Odisha • www.briskode.com
            </div>
          </div>
        </div>
      </section>

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
