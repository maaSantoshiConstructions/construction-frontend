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
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="trust-item" style={{
      flexDirection: 'column', textAlign: 'center', padding: '28px 16px',
      borderRadius: '14px', border: '1px solid var(--line)',
      background: '#fff', boxShadow: '0 2px 10px rgba(20,20,60,.05)',
      gap: '10px',
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: '#efeafe', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '22px', margin: '0 auto',
      }}>
        {ic}
      </div>
      <div style={{ fontFamily: 'Poppins,Inter,sans-serif', fontSize: '32px', fontWeight: 800, color: 'var(--indigo)', lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--gray)' }}>{label}</div>
    </div>
  );
}

export default function About() {
  return (
    <div style={{ background: 'var(--white)', minHeight: '100vh' }}>

      {/* ===== HERO HEADER ===== */}
      <div style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(91,79,224,.35), transparent 55%), linear-gradient(120deg,#0b0f2e 0%,#161b45 55%,#1c1450 100%)',
        padding: '64px 0 60px',
        textAlign: 'center',
      }}>
        <div className="wrap">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>OUR STORY</span>
          <h1 style={{ fontFamily: 'Poppins,Inter,sans-serif', fontSize: '42px', fontWeight: 800, color: '#fff', margin: '12px 0 14px' }}>
            About Us
          </h1>
          <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            Building trust, shaping communities, and helping you find the perfect piece of land for over a decade.
          </p>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="wrap" style={{ paddingTop: '60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px', marginBottom: '60px' }}>
          {stats.map((s) => <StatCounter key={s.label} {...s} />)}
        </div>

        {/* ===== OUR STORY ===== */}
        <div className="section" style={{ padding: '0 0 60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <span className="eyebrow">OUR STORY</span>
              <h2 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text)', margin: '8px 0 18px' }}>
                A Legacy of Trust &amp; Excellence
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--gray)', fontSize: '14.5px', lineHeight: 1.7 }}>
                <p>Founded in 2010, Jai Santoshi Maa Infrastructure started with a simple mission — to make plot buying transparent, simple, and rewarding for every Indian.</p>
                <p>Over the past 15+ years, we have delivered over 50 projects and helped more than 2000 families find their dream plots across prime locations in Odisha.</p>
                <p>Our commitment to quality, legal transparency, and customer satisfaction has made us one of the most trusted names in the real estate industry.</p>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&q=80&auto=format&fit=crop"
                alt="Office building"
                style={{ borderRadius: '16px', width: '100%', height: '340px', objectFit: 'cover', boxShadow: '0 20px 50px rgba(20,20,60,.15)', display: 'block' }}
              />
              <div style={{
                position: 'absolute', bottom: '-20px', left: '-20px',
                background: '#fff', borderRadius: '12px', padding: '16px 20px',
                boxShadow: '0 10px 30px rgba(0,0,0,.12)',
                border: '1px solid var(--line)',
              }}>
                <div style={{ fontFamily: 'Poppins,Inter,sans-serif', fontSize: '26px', fontWeight: 800, color: 'var(--indigo)' }}>15+</div>
                <div style={{ fontSize: '12px', color: 'var(--gray)' }}>Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== MISSION / VISION / VALUES ===== */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '38px' }}>
            <span className="eyebrow">WHAT DRIVES US</span>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text)', marginTop: '8px' }}>Mission, Vision &amp; Values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '22px' }}>
            {values.map((v) => (
              <div key={v.title} className="ccard" style={{ flexDirection: 'column', gap: '0' }}>
                <div style={{ marginBottom: '14px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: '#efeafe', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '22px', marginBottom: '14px',
                  }}>
                    {v.ic}
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>{v.title}</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--gray)', lineHeight: 1.65 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== TEAM ===== */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '38px' }}>
            <span className="eyebrow">LEADERSHIP</span>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text)', marginTop: '8px' }}>Meet Our Team</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '22px' }}>
            {team.map((m) => (
              <div key={m.name} style={{
                background: '#fff', border: '1px solid var(--line)', borderRadius: '14px',
                padding: '28px 20px', textAlign: 'center',
                boxShadow: '0 2px 10px rgba(20,20,60,.05)',
                transition: '.25s',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 36px rgba(20,20,60,.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(20,20,60,.05)'}
              >
                <img
                  src={m.image}
                  alt={m.name}
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 14px', display: 'block', border: '3px solid #efeafe' }}
                />
                <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{m.name}</h4>
                <p style={{ fontSize: '12px', color: 'var(--gray)' }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== CTA BANNER ===== */}
        <div className="cta-banner" style={{ marginBottom: '90px' }}>
          <div>
            <h3>Ready to Start Your Journey?</h3>
            <p>Let us help you find the perfect plot. Our team is just a call away.</p>
          </div>
          <div className="cta-stats">
            <div><div className="num">500+</div><div className="lbl">Plots Sold</div></div>
            <div><div className="num">2000+</div><div className="lbl">Happy Families</div></div>
            <div><div className="num">15+</div><div className="lbl">Years Trust</div></div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-gold">Contact Us →</Link>
            <Link to="/projects" className="btn-outline">View Projects</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
