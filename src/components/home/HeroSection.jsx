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
    <section className="hero">
      <div className="gift-tab">Get Best Deal</div>
      <div className="wrap">
        <div className="hero-copy">
          <span className="badge">● SMART REAL ESTATE • AI POWERED</span>
          <h1>
            Build Your Future.<br />
            <span className="accent">Invest with Confidence.</span>
          </h1>
          <p className="lead">
            AI-powered real estate platform with 20 intelligent features, smart calculators &amp; real-time insights.
          </p>
          <div className="hero-stats">
            <div className="hstat">
              <div className="ic">
                <LuLayoutGrid size={22} className="text-amber-500" />
              </div>
              <div>
                <div className="num">20+</div>
                <div className="lbl">Smart Features</div>
              </div>
            </div>
            <div className="hstat">
              <div className="ic">
                <LuSmile size={22} className="text-amber-500" />
              </div>
              <div>
                <div className="num">500+</div>
                <div className="lbl">Happy Customers</div>
              </div>
            </div>
            <div className="hstat">
              <div className="ic">
                <LuTrees size={22} className="text-amber-500" />
              </div>
              <div>
                <div className="num">100+</div>
                <div className="lbl">Acres Delivered</div>
              </div>
            </div>
          </div>
          <div className="hero-actions">
            <Link to="/projects" className="btn-gold">Explore Projects →</Link>
            <Link to="/smart-features" className="btn-outline">See 20 Features ▦</Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-photo">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80&auto=format&fit=crop"
              alt="Green City residential towers at dusk"
              onError={(e) => {
                e.target.parentElement.style.background = 'linear-gradient(135deg,#3a3f6b,#7d7aa3 40%,#c9b28a 75%,#efd9a8)';
                e.target.remove();
              }}
            />
            <div className="project-card">
              <div className="live"><span className="dot"></span> Live Project</div>
              <h4>Green City</h4>
              <p>Premium Residential Plots</p>
              <p>Bhubaneswar, Odisha</p>
              <hr />
              <div className="from">Starting From</div>
              <div className="price">₹9.99 Lakh*</div>
              <Link to="/projects" className="vd">View Details →</Link>
            </div>
          </div>

          <div className="side-dock">
            <a href="tel:+917000012345" className="item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="ic"><LuPhone size={18} /></div><span>Call Us</span>
            </a>
            <a href={`https://wa.me/${config.supportWhatsapp}?text=Hello%20Jai%20Santoshi%20Maa%20Infrastructure,%20I%20am%20interested%20in%20your%20properties.`} target="_blank" rel="noopener noreferrer" className="item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="ic"><LuMessageCircle size={18} /></div><span>WhatsApp</span>
            </a>
            <Link to="/book-visit" className="item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="ic"><LuMapPin size={18} /></div><span>Site Visit</span>
            </Link>
            <a href="/brochure.pdf" download="Maa_Santoshi_Brochure.pdf" className="item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="ic"><LuFileText size={18} /></div><span>Brochure</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
