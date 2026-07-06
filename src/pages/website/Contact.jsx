import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createLead } from '../../api/leads';

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await createLead({ ...data, source: 'website_contact' });
      toast.success('Message sent! We will get back to you soon.');
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--white)', minHeight: '100vh' }}>

      {/* ===== PAGE HEADER ===== */}
      <div style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(91,79,224,.35), transparent 55%), linear-gradient(120deg,#0b0f2e 0%,#161b45 55%,#1c1450 100%)',
        padding: '64px 0 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="wrap" style={{ textAlign: 'center' }}>
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>GET IN TOUCH</span>
          <h1 style={{ fontFamily: 'Poppins, Inter, sans-serif', fontSize: '40px', fontWeight: 800, color: '#fff', marginTop: '8px', marginBottom: '14px' }}>
            Contact Us
          </h1>
          <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            We&apos;d love to hear from you. Get in touch with our team and we&apos;ll respond within 24 hours.
          </p>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="wrap" style={{ paddingTop: '60px', paddingBottom: '90px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '28px', alignItems: 'start' }}>

          {/* ===== FORM CARD ===== */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid var(--line)',
            boxShadow: '0 15px 40px rgba(20,20,60,.1)',
            padding: '36px',
          }}>
            <span className="eyebrow">SEND A MESSAGE</span>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', marginBottom: '28px' }}>
              How Can We Help You?
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Name + Email row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Your name"
                    style={inputStyle(!!errors.name)}
                  />
                  {errors.name && <p style={errStyle}>{errors.name.message}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                    })}
                    placeholder="you@example.com"
                    style={inputStyle(!!errors.email)}
                  />
                  {errors.email && <p style={errStyle}>{errors.email.message}</p>}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone is required', minLength: { value: 10, message: 'Min 10 digits' } })}
                  placeholder="9876543210"
                  style={inputStyle(!!errors.phone)}
                />
                {errors.phone && <p style={errStyle}>{errors.phone.message}</p>}
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle}>Message</label>
                <textarea
                  rows={5}
                  {...register('message', { required: 'Message is required' })}
                  placeholder="Tell us about your requirements..."
                  style={{ ...inputStyle(!!errors.message), resize: 'none' }}
                />
                {errors.message && <p style={errStyle}>{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold"
                style={{ alignSelf: 'flex-start', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', border: 'none' }}
              >
                {loading ? 'Sending...' : '✉ Send Message'}
              </button>
            </form>
          </div>

          {/* ===== RIGHT SIDEBAR ===== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Contact info cards */}
            {[
              { ic: '📍', label: 'Address', value: 'Bhubaneswar, Odisha, India 751029' },
              { ic: '📞', label: 'Phone', value: '+91 70000 12345' },
              { ic: '✉', label: 'Email', value: 'info@jsminfra.com' },
              { ic: '🕐', label: 'Office Hours', value: 'Mon – Sat: 9:00 AM – 7:00 PM' },
            ].map((item) => (
              <div key={item.label} className="trust-item" style={{ borderRadius: '12px', border: '1px solid var(--line)', boxShadow: '0 2px 10px rgba(20,20,60,.05)', background: '#fff' }}>
                <div className="trust-item ic" style={{ fontSize: '19px', width: '44px', height: '44px', borderRadius: '12px', background: '#efeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.ic}
                </div>
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>{item.label}</h5>
                  <p style={{ fontSize: '13px', color: 'var(--gray)' }}>{item.value}</p>
                </div>
              </div>
            ))}

            {/* CTA mini banner */}
            <div style={{
              background: 'linear-gradient(120deg,#3a2fb8,#5b4fe0 60%,#7a3fd6)',
              borderRadius: '14px',
              padding: '24px',
              color: '#fff',
              marginTop: '4px',
            }}>
              <h4 style={{ fontFamily: 'Poppins,Inter,sans-serif', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
                Ready to Book a Site Visit?
              </h4>
              <p style={{ fontSize: '12.5px', color: '#d8d4ff', marginBottom: '18px', lineHeight: 1.5 }}>
                Our team will personally take you through our projects. Schedule your visit today.
              </p>
              <a href="/book-visit" className="btn-gold" style={{ fontSize: '13px', padding: '10px 20px' }}>
                Book a Visit →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Style helpers ===== */
const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text)',
  marginBottom: '6px',
};

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '11px 14px',
  border: `1px solid ${hasError ? '#e55' : 'var(--line)'}`,
  borderRadius: '8px',
  fontSize: '14px',
  color: 'var(--text)',
  outline: 'none',
  transition: 'border-color .2s',
  background: '#fff',
  fontFamily: 'Inter, sans-serif',
  boxSizing: 'border-box',
});

const errStyle = {
  color: '#c0392b',
  fontSize: '11.5px',
  marginTop: '4px',
};
