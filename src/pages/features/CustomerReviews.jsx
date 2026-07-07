import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaGoogle } from 'react-icons/fa';

const fallbackReviews = [
  { _id: '1', customer: { name: 'Rajesh Kumar', avatar: '' }, rating: 5, title: 'Excellent experience', comment: 'Very transparent process. The team guided us through every step. Highly recommended for anyone looking to invest in Bhubaneswar.', createdAt: '2026-03-15' },
  { _id: '2', customer: { name: 'Anita Sharma', avatar: '' }, rating: 4, title: 'Great location and value', comment: 'Booked a plot in Santoshi Enclave. The live map feature helped us choose the perfect plot. Construction quality is impressive.', createdAt: '2026-02-20' },
  { _id: '3', customer: { name: 'Debasis Patra', avatar: '' }, rating: 5, title: 'Best real estate platform', comment: 'The AI recommendation was spot on! Found the perfect villa that matched all my requirements. Digital documentation made it very smooth.', createdAt: '2026-01-10' },
  { _id: '4', customer: { name: 'Suchitra Rout', avatar: '' }, rating: 4, title: 'Satisfied customer', comment: 'Good investment option in Patia area. The team is responsive and the WhatsApp updates keep us informed about construction progress.', createdAt: '2025-12-05' },
  { _id: '5', customer: { name: 'Prakash Mohanty', avatar: '' }, rating: 5, title: 'Trustworthy developers', comment: 'After researching multiple options, we chose JSM Infrastructure. The RERA registration gave us confidence. Great after-sales support.', createdAt: '2025-11-18' },
  { _id: '6', customer: { name: 'Sunita Das', avatar: '' }, rating: 5, title: 'Dream home realized', comment: 'From plot selection to possession, everything was handled professionally. The owner dashboard is very useful to track progress.', createdAt: '2025-10-22' },
];

const RatingStars = ({ rating }) => (
  <div style={{ display: 'flex', gap: '3px' }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <FaStar key={star} style={{ color: star <= rating ? 'var(--gold)' : 'var(--line)', fontSize: '13px' }} />
    ))}
  </div>
);

const Avatar = ({ name }) => (
  <div style={{
    width: '44px',
    height: '44px',
    background: 'linear-gradient(135deg, var(--indigo), var(--indigo-light))',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: '13.5px',
    flexShrink: 0,
  }}>
    {name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
  </div>
);

export default function CustomerReviews() {
  const [reviews] = useState(fallbackReviews);
  const [filter, setFilter] = useState(0);

  const filteredReviews = filter ? reviews.filter((r) => r.rating === filter) : reviews;
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const distribution = [0, 0, 0, 0, 0];
  reviews.forEach((r) => distribution[r.rating - 1]++);

  return (
    <div style={{ background: '#f7f7fb', minHeight: '100vh', paddingBottom: '90px' }}>
      
      {/* ===== PAGE HEADER ===== */}
      <div style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(91,79,224,.35), transparent 55%), linear-gradient(120deg,#0b0f2e 0%,#161b45 55%,#1c1450 100%)',
        padding: '64px 0 60px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(91,79,224,.1)' }} />
        <div className="wrap">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>TESTIMONIALS</span>
          <h1 style={{ fontFamily: 'Poppins, Inter, sans-serif', fontSize: '40px', fontWeight: 800, color: '#fff', marginTop: '8px', marginBottom: '14px' }}>
            Customer Reviews
          </h1>
          <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Hear from our homeowners and plot investors in Bhubaneswar &amp; Cuttack.
          </p>
        </div>
      </div>

      {/* ===== CONTENT WRAPPER ===== */}
      <div className="wrap" style={{ marginTop: '-28px', position: 'relative', zIndex: 10, maxWidth: '1000px' }}>
        
        {/* Overall Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid var(--line)',
            boxShadow: '0 15px 40px rgba(20,20,60,.1)',
            padding: '36px',
            marginBottom: '32px',
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
            alignItems: 'center',
          }}>
            {/* Overall Rating numbers */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 6px' }}>
                Overall Rating
              </p>
              <p style={{ fontSize: '56px', fontWeight: 800, color: 'var(--text)', margin: 0, lineHeight: 1 }}>
                {avgRating.toFixed(1)}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 6px' }}>
                <RatingStars rating={Math.round(avgRating)} />
              </div>
              <p style={{ fontSize: '12px', color: 'var(--gray)', margin: 0, fontWeight: 500 }}>
                Based on {reviews.length} verified reviews
              </p>
            </div>

            {/* Distribution bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star - 1];
                const pct = (count / reviews.length) * 100;
                return (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                    <span style={{ width: '40px', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {star} <FaStar style={{ color: 'var(--gold)', fontSize: '11px' }} />
                    </span>
                    <div style={{ flex: 1, height: '8px', background: '#f4f6fa', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'var(--gold)', borderRadius: '4px', width: `${pct}%`, transition: 'width 0.5s ease' }} />
                    </div>
                    <span style={{ width: '24px', textAlign: 'right', color: 'var(--gray)', fontWeight: 500 }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Google review action */}
            <div style={{ textAlign: 'center' }}>
              <a
                href="https://g.co/kgs/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  border: 'none',
                  textDecoration: 'none',
                  fontSize: '14.5px',
                  fontWeight: 700,
                }}
              >
                <FaGoogle style={{ fontSize: '14px' }} /> Write a Google Review
              </a>
            </div>
          </div>
        </motion.div>

        {/* Filter buttons list */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
          <button
            onClick={() => setFilter(0)}
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s',
              background: filter === 0 ? 'var(--indigo)' : '#fff',
              color: filter === 0 ? '#fff' : 'var(--text)',
              border: `1px solid ${filter === 0 ? 'transparent' : 'var(--line)'}`,
            }}
          >
            All Reviews
          </button>
          {[5, 4, 3, 2, 1].map((star) => {
            const isActive = filter === star;
            return (
              <button
                key={star}
                onClick={() => setFilter(isActive ? 0 : star)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s',
                  background: isActive ? 'var(--indigo)' : '#fff',
                  color: isActive ? '#fff' : 'var(--text)',
                  border: `1px solid ${isActive ? 'transparent' : 'var(--line)'}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FaStar style={{ color: isActive ? '#fff' : 'var(--gold)', fontSize: '11px', marginTop: '-1px' }} /> {star} Star
              </button>
            );
          })}
        </div>

        {/* Reviews Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '20px',
        }}>
          {filteredReviews.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid var(--line)',
                padding: '24px',
                boxShadow: '0 4px 15px rgba(20,20,60,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <FaQuoteLeft style={{ color: '#efeafe', fontSize: '20px' }} />
                  <RatingStars rating={review.rating} />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px', fontFamily: 'Poppins, sans-serif' }}>
                  {review.title}
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--gray)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                <Avatar name={review.customer.name} />
                <div>
                  <p style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                    {review.customer.name}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '2px', margin: 0 }}>
                    {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
