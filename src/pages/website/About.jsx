import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { value: 500,  suffix: '+', label: 'Plots Sold',          ic: '▦' },
  { value: 50,   suffix: '+', label: 'Projects Delivered',   ic: '🏗' },
  { value: 2000, suffix: '+', label: 'Happy Customers',      ic: '☺' },
  { value: 15,   suffix: '+', label: 'Years Experience',     ic: '⭐' },
];

const team = [
  { name: 'Mr. Suresh Kumar',   role: 'Founder & CEO',              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { name: 'Mrs. Anjali Sharma', role: 'Director of Operations',     image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
  { name: 'Mr. Rajesh Verma',   role: 'Head of Sales',              image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
  { name: 'Mr. Vikram Patel',   role: 'Chief Financial Officer',    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' },
];

const values = [
  { ic: '🎯', title: 'Our Mission',  desc: 'To provide every Indian with a hassle-free, transparent, and rewarding plot buying experience powered by technology and trust.' },
  { ic: '👁', title: 'Our Vision',   desc: "To become India's most trusted real estate platform, enabling smart land investments for millions of families." },
  { ic: '🤝', title: 'Our Values',   desc: 'Integrity, transparency, customer-first approach, and innovation are at the core of everything we do.' },
  { ic: '🏅', title: 'Our Promise',  desc: '100% clear titles, RERA compliance, timely delivery, and complete legal support for every transaction.' },
];

/* Animated counter that fires when element enters viewport */
function StatCounter({ value, suffix, label, ic }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-7 text-center shadow-sm hover:shadow-md transition duration-300 flex flex-col items-center justify-center gap-2"
    >
      <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl md:text-2xl font-bold">
        {ic}
      </div>
      <div className="font-poppins text-2xl md:text-3xl font-extrabold text-indigo-600 tracking-tight">
        {count}{suffix}
      </div>
      <div className="text-xs md:text-sm font-semibold text-slate-500">{label}</div>
    </div>
  );
}

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ===== HERO HEADER ===== */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-14 md:py-20 text-center relative overflow-hidden px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-amber-400 font-bold text-[11px] md:text-xs uppercase tracking-widest mb-3 border border-white/10">
            OUR STORY
          </span>
          <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            About Us
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-normal px-2">
            Building trust, shaping communities, and helping you find the perfect piece of land for over a decade.
          </p>
        </div>
      </div>

      {/* ===== MAIN CONTAINER ===== */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 md:pt-14 pb-20">
        
        {/* ===== STATS GRID ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-14 md:mb-20">
          {stats.map((s) => (
            <StatCounter key={s.label} {...s} />
          ))}
        </div>

        {/* ===== OUR STORY ===== */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 md:p-12 mb-14 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest font-poppins">
                OUR STORY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-4 font-poppins leading-snug">
                A Legacy of Trust &amp; Excellence
              </h2>
              <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed font-normal">
                <p>
                  Founded in 2010, Jai Santoshi Maa Infrastructure started with a simple mission — to make plot buying transparent, simple, and rewarding for every Indian.
                </p>
                <p>
                  Over the past 15+ years, we have delivered over 50 projects and helped more than 2000 families find their dream plots across prime locations in Odisha.
                </p>
                <p>
                  Our commitment to quality, legal transparency, and customer satisfaction has made us one of the most trusted names in the real estate industry.
                </p>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&q=80&auto=format&fit=crop"
                alt="Office building"
                className="rounded-2xl w-full h-64 sm:h-80 lg:h-96 object-cover shadow-lg"
              />
              <div className="absolute -bottom-4 left-4 bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-200/80">
                <div className="font-poppins text-2xl sm:text-3xl font-extrabold text-indigo-600">
                  15+
                </div>
                <div className="text-xs font-semibold text-slate-500">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== MISSION / VISION / VALUES ===== */}
        <div className="mb-14 md:mb-20">
          <div className="text-center mb-8 md:mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest font-poppins">
              WHAT DRIVES US
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-poppins">
              Mission, Vision &amp; Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-4">
                  {v.ic}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 font-poppins">
                  {v.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== LEADERSHIP TEAM ===== */}
        <div className="mb-14 md:mb-20">
          <div className="text-center mb-8 md:mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest font-poppins">
              LEADERSHIP
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-poppins">
              Meet Our Team
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {team.map((m) => (
              <div
                key={m.name}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 text-center shadow-sm hover:shadow-lg transition duration-300"
              >
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover mx-auto mb-3 border-4 border-indigo-50 shadow-sm"
                />
                <h4 className="text-xs md:text-sm font-bold text-slate-800 mb-1 font-poppins">
                  {m.name}
                </h4>
                <p className="text-[11px] md:text-xs font-semibold text-slate-400">
                  {m.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== CTA BANNER ===== */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 md:p-12 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-poppins">
              Ready to Start Your Journey?
            </h3>
            <p className="text-slate-300 text-sm max-w-lg">
              Let us help you find the perfect plot. Our team is just a call away.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition duration-200 text-center min-w-[140px]"
            >
              Contact Us →
            </Link>
            <Link
              to="/projects"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition duration-200 text-center min-w-[140px]"
            >
              View Projects
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
