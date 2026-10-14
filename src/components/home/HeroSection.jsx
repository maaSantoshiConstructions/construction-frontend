import React from 'react';
import { Link } from 'react-router-dom';
import {
  LuLayoutGrid,
  LuSmile,
  LuTrees,
  LuPhone,
  LuMessageCircle,
  LuMapPin,
  LuFileText
} from 'react-icons/lu';
import config from '../../config';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:py-24 bg-gradient-to-br from-[#041007] via-[#081a0c] to-[#040f06]">
      {/* Ambient emerald & golden glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/3 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Subtle architectural dot grid */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Floating ribbon tab (Desktop) */}
      <div className="hidden lg:flex absolute left-0 top-64 z-20 [writing-mode:vertical-rl] tracking-widest text-[11px] font-extrabold uppercase py-3.5 px-2 rounded-r-xl bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 shadow-xl cursor-pointer hover:translate-x-1 transition-transform">
        Get Best Deal
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Copy */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* AI Powered Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wider uppercase mb-6 backdrop-blur-md shadow-xs shadow-emerald-500/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              SMART REAL ESTATE • AI POWERED
            </div>

            {/* Main Headline */}
            <h1 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-white leading-[1.15] tracking-tight mb-5">
              Build Your Future.<br />
              <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(245,158,11,0.25)]">
                Invest with Confidence.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl mb-8 leading-relaxed font-normal">
              AI-powered real estate platform with intelligent features, smart calculators &amp; real-time insights.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-9">
              {[
                { icon: LuLayoutGrid, num: '10+', label: 'Smart Features' },
                { icon: LuSmile, num: '500+', label: 'Happy Customers' },
                { icon: LuTrees, num: '100+', label: 'Acres Delivered' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md hover:bg-white/[0.08] hover:border-amber-400/30 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-lg sm:text-xl leading-tight font-['Poppins',sans-serif]">
                      {stat.num}
                    </div>
                    <div className="text-slate-400 text-xs font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <Link
                to="/projects"
                className="px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 no-underline border-0 cursor-pointer"
              >
                <span>Explore Projects →</span>
              </Link>
              <Link
                to="/smart-features"
                className="px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/35 backdrop-blur-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 no-underline cursor-pointer"
              >
                <span>See Smart Features</span>
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="lg:col-span-5 relative">
            {/* Hero Estate Photo */}
            <div className="relative h-[340px] sm:h-[420px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80&auto=format&fit=crop"
                alt="Green City residential estate"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.parentElement.style.background = 'linear-gradient(135deg,#13341b,#23562e 40%,#9e7d3b 75%,#ffd580)';
                  e.target.remove();
                }}
              />
              {/* Subtle Dark Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#041007]/90 via-[#041007]/20 to-transparent pointer-events-none" />

              {/* Floating Frosted Project Card */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-[calc(100%-2rem)] sm:w-[260px] bg-[#041007]/80 backdrop-blur-xl border border-white/15 rounded-2xl p-4 sm:p-5 text-white shadow-2xl">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-400/30 px-2.5 py-0.5 rounded-full mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  Live Project
                </div>
                <h4 className="font-['Poppins',sans-serif] text-lg sm:text-xl font-extrabold text-white mb-0.5">
                  Green City
                </h4>
                <p className="text-slate-300 text-xs mb-0.5">Premium Residential Plots</p>
                <p className="text-slate-400 text-xs mb-3">Bhubaneswar, Odisha</p>
                <hr className="border-white/10 my-2.5" />
                <div className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
                  Starting From
                </div>
                <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent mb-3 font-['Poppins',sans-serif]">
                  ₹9.99 Lakh*
                </div>
                <Link
                  to="/projects"
                  className="block text-center w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-500 hover:text-slate-950 border border-white/20 hover:border-transparent transition-all duration-200 no-underline"
                >
                  View Details →
                </Link>
              </div>
            </div>

            {/* Quick Action Side Dock (Desktop & Mobile Responsive) */}
            <div className="mt-4 lg:mt-0 lg:absolute lg:-right-5 lg:top-1/2 lg:-translate-y-1/2 z-20 flex lg:flex-col items-center justify-around lg:justify-center gap-2 sm:gap-3 bg-white/95 backdrop-blur-md border border-white/80 p-2 sm:p-2.5 rounded-2xl shadow-xl">
              {[
                { href: 'tel:+917000012345', icon: LuPhone, label: 'Call Us' },
                {
                  href: `https://wa.me/${config.supportWhatsapp}?text=Hello%20Jai%20Santoshi%20Maa%20Infrastructure,%20I%20am%20interested%20in%20your%20properties.`,
                  icon: LuMessageCircle,
                  label: 'WhatsApp',
                  external: true,
                },
                { to: '/book-visit', icon: LuMapPin, label: 'Site Visit' },
                { href: '/brochure.pdf', icon: LuFileText, label: 'Brochure', download: 'Maa_Santoshi_Brochure.pdf' },
              ].map((item, idx) => {
                const content = (
                  <div className="flex flex-col items-center gap-1 p-1.5 sm:p-2 rounded-xl hover:bg-emerald-50 transition-colors text-slate-700 hover:text-emerald-800 cursor-pointer">
                    <item.icon size={18} className="text-emerald-700" />
                    <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
                  </div>
                );
                if (item.to) {
                  return (
                    <Link key={idx} to={item.to} className="no-underline">
                      {content}
                    </Link>
                  );
                }
                return (
                  <a
                    key={idx}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    download={item.download}
                    className="no-underline"
                  >
                    {content}
                  </a>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
