import React from 'react';
import { LuSparkles } from 'react-icons/lu';

export default function ReferralHeader() {
  return (
    <div
      style={{
        background:
          'radial-gradient(ellipse at 30% 20%, rgba(91,79,224,.35), transparent 55%), linear-gradient(120deg,#0b0f2e 0%,#161b45 55%,#1c1450 100%)',
        padding: '64px 0 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          left: '-80px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'rgba(91,79,224,.1)',
        }}
      />
      <div className="wrap max-w-4xl mx-auto px-4">
        <span
          className="eyebrow"
          style={{
            background: 'rgba(255,255,255,.08)',
            color: 'var(--gold)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '1px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <LuSparkles size={14} /> REFER &amp; EARN REWARDS
        </span>
        <h1
          style={{
            fontFamily: 'Poppins,Inter,sans-serif',
            fontSize: '40px',
            fontWeight: 800,
            color: '#fff',
            margin: '16px 0 14px',
            lineHeight: 1.25,
          }}
        >
          Turn Your Connections Into <span style={{ color: '#e8b355' }}>Real Estate Payouts</span>
        </h1>
        <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
          Invite your friends and family to invest in prime land with Maa Santoshi Constructions. Log in to access your referral code and earn cash rewards!
        </p>
      </div>
    </div>
  );
}
