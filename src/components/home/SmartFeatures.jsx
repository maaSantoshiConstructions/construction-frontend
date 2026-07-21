import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LuBrain,
  LuTrendingUp,
  LuMap,
  LuEye,
  LuHardHat,
  LuMessageSquare,
  LuCalendar,
  LuGift,
  LuCompass,
  LuLaptop,
  LuScale,
  LuBadgePercent,
  LuCalculator,
  LuChartColumn,
  LuSquareCheck,
  LuMessageCircle,
  LuBot,
  LuStar,
  LuUser
} from 'react-icons/lu';

export default function SmartFeatures() {
  const { user, getRedirectPath } = useAuth();
  const dashboardPath = user ? getRedirectPath(user.role) : '/login';

  const features = [
    { to: '/ai-recommendation', icon: LuBrain, label: 'AI Property Recommendation' },
    { to: '/calculators', icon: LuTrendingUp, label: 'Investment Calculator' },
    { to: '/plot-map', icon: LuMap, label: 'Live Plot Map' },
    { to: '/virtual-tour', icon: LuEye, label: 'Virtual Site Visit' },
    { to: '/construction-tracker', icon: LuHardHat, label: 'Construction Tracker' },
    { to: '/ai-chatbot', icon: LuMessageSquare, label: 'AI Sales Assistant' },
    { to: '/book-visit', icon: LuCalendar, label: 'Smart Booking' },
    { to: '/customer/referrals', icon: LuGift, label: 'Referral Program' },
    { to: '/partner/dashboard', icon: LuCompass, label: 'Channel Partner Portal' },
    { to: '/book-visit', icon: LuLaptop, label: 'Online Booking' },
    { to: '/property-comparison', icon: LuScale, label: 'Property Comparison' },
    { to: '/calculators', icon: LuBadgePercent, label: 'Loan Eligibility' },
    { to: '/calculators', icon: LuCalculator, label: 'Construction Cost Calculator' },
    { to: '/ai-followup', icon: LuChartColumn, label: 'Lead Scoring' },
    { to: '/customer/documents', icon: LuSquareCheck, label: 'Legal Verification' },
    { to: '/whatsapp-crm', icon: LuMessageCircle, label: 'WhatsApp CRM' },
    { to: '/ai-followup', icon: LuBot, label: 'AI Follow-up' },
    { to: '/reviews', icon: LuStar, label: 'Reviews & Ratings' },
    { to: dashboardPath, icon: LuUser, label: 'Owner Dashboard' },
  ];

  const visibleFeatures = features.filter((f) => {
    if (user?.role === 'customer' && f.to === '/ai-followup') return false;
    return true;
  });

  return (
    <section className="features" id="features">
      <div className="wrap">
        <span className="eyebrow">POWERED BY INNOVATION</span>
        <div className="sec-head">
          <div>
            <h2>{visibleFeatures.length} Smart Features</h2>
            <p>Experience the future of real estate with our AI-powered platform.</p>
          </div>
          <Link to="/smart-features" className="btn-line">Explore All Features →</Link>
        </div>
        <div className="feat-grid">
          {visibleFeatures.map((f, i) => (
            <Link key={i} to={f.to} className="fcard">
              <div className="ic"><f.icon /></div>
              <span>{f.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

}
