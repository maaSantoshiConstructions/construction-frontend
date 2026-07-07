import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createSiteVisit } from '../../api/siteVisits';
import { getProjects } from '../../api/projects';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCheckCircle, FaWhatsapp } from 'react-icons/fa';

const timeSlots = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
];

export default function BookVisit() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [visitDetails, setVisitDetails] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await getProjects({ limit: 50 });
        setProjects(data?.data || []);
      } catch {
        setProjects([
          { _id: '1', name: 'Green Valley Estate', slug: 'green-valley-estate' },
          { _id: '2', name: 'Lakeview Residency', slug: 'lakeview-residency' },
          { _id: '3', name: 'Golden Palm Enclave', slug: 'golden-palm-enclave' },
        ]);
      }
    };
    fetchProjects();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const visitData = {
        ...data,
        date: new Date(data.date).toISOString(),
      };
      await createSiteVisit(visitData);
      setVisitDetails(data);
      setSuccess(true);
      toast.success('Site visit booked successfully!');
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to book visit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (success && visitDetails) {
    return (
      <div style={{ background: '#f7f7fb', minHeight: '100vh', paddingBottom: '90px' }}>
        {/* ===== PAGE HEADER ===== */}
        <div style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(91,79,224,.35), transparent 55%), linear-gradient(120deg,#0b0f2e 0%,#161b45 55%,#1c1450 100%)',
          padding: '64px 0 60px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div className="wrap">
            <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>SUCCESS</span>
            <h1 style={{ fontFamily: 'Poppins,Inter,sans-serif', fontSize: '42px', fontWeight: 800, color: '#fff', margin: '12px 0 14px' }}>
              Booking Confirmed!
            </h1>
          </div>
        </div>

        <div className="wrap" style={{ marginTop: '-28px', position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: '#fff',
              borderRadius: '16px',
              border: '1px solid var(--line)',
              boxShadow: '0 15px 40px rgba(20,20,60,.1)',
              padding: '36px',
              maxWidth: '520px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              background: '#e6f7ed',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <FaCheckCircle style={{ color: '#2ecc71', fontSize: '28px' }} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>
              Visit Scheduled Successfully
            </h2>
            <p style={{ color: 'var(--gray)', fontSize: '14.5px', marginBottom: '24px', lineHeight: 1.5 }}>
              Your site visit has been scheduled. Our executive will contact you shortly to confirm the details.
            </p>

            <div style={{
              background: '#f8f8fc',
              borderRadius: '12px',
              border: '1px solid var(--line)',
              padding: '20px',
              marginBottom: '28px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--gray)', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Project</span>
                <span style={{ fontSize: '15px', color: 'var(--text)', fontWeight: 700 }}>{visitDetails.project}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--gray)', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preferred Date</span>
                  <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 600 }}>
                    {new Date(visitDetails.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--gray)', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time Slot</span>
                  <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 600 }}>{visitDetails.timeSlot}</span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--gray)', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pickup Location</span>
                <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 600 }}>{visitDetails.pickupLocation}</span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '16px' }}>
              For instant confirmation, please share this booking with our support team:
            </p>

            <a
              href={`https://wa.me/919876543210?text=Hi! I have booked a site visit for project "${visitDetails.project}" on ${visitDetails.date} at ${visitDetails.timeSlot}. Please confirm.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '14px',
                fontSize: '15px',
                fontWeight: 700,
                background: '#2ecc71',
                color: '#fff',
                border: 'none',
              }}
            >
              <FaWhatsapp style={{ fontSize: '18px' }} /> Confirm via WhatsApp
            </a>

            <button
              onClick={() => { setSuccess(false); setVisitDetails(null); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--indigo)',
                fontSize: '14px',
                fontWeight: 600,
                marginTop: '20px',
                cursor: 'pointer',
              }}
            >
              ← Book Another Visit
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

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
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>SECURE YOUR PLOT</span>
          <h1 style={{ fontFamily: 'Poppins, Inter, sans-serif', fontSize: '40px', fontWeight: 800, color: '#fff', marginTop: '8px', marginBottom: '14px' }}>
            Book a Site Visit
          </h1>
          <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Schedule a free site visit with our experts to explore your dream plot in person.
          </p>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="wrap" style={{ marginTop: '-28px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* ===== FORM CARD ===== */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid var(--line)',
            boxShadow: '0 15px 40px rgba(20,20,60,.1)',
            padding: '36px',
          }}>
            <span className="eyebrow">SCHEDULE YOUR VISIT</span>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', marginBottom: '28px' }}>
              Select Date &amp; Time
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Select Project</label>
                <select
                  {...register('project', { required: 'Please select a project' })}
                  style={inputStyle(!!errors.project)}
                >
                  <option value="">Choose a project</option>
                  {projects.map((p) => <option key={p._id} value={p.name}>{p.name}</option>)}
                </select>
                {errors.project && <p style={errStyle}>{errors.project.message}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Preferred Date</label>
                  <div style={{ position: 'relative' }}>
                    <FaCalendarAlt style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)', fontSize: '14px' }} />
                    <input
                      type="date"
                      min={getMinDate()}
                      {...register('date', { required: 'Please select a date' })}
                      style={{ ...inputStyle(!!errors.date), paddingLeft: '38px' }}
                    />
                  </div>
                  {errors.date && <p style={errStyle}>{errors.date.message}</p>}
                </div>

                <div>
                  <label style={labelStyle}>Time Slot</label>
                  <div style={{ position: 'relative' }}>
                    <FaClock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)', fontSize: '14px', pointerEvents: 'none', zIndex: 1 }} />
                    <select
                      {...register('timeSlot', { required: 'Please select a time' })}
                      style={{ ...inputStyle(!!errors.timeSlot), paddingLeft: '38px' }}
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                  </div>
                  {errors.timeSlot && <p style={errStyle}>{errors.timeSlot.message}</p>}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Pickup Location</label>
                <div style={{ position: 'relative' }}>
                  <FaMapMarkerAlt style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)', fontSize: '14px' }} />
                  <input
                    type="text"
                    {...register('pickupLocation', { required: 'Pickup location is required' })}
                    style={{ ...inputStyle(!!errors.pickupLocation), paddingLeft: '38px' }}
                    placeholder="Enter your pickup address"
                  />
                </div>
                {errors.pickupLocation && <p style={errStyle}>{errors.pickupLocation.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: 700,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  border: 'none',
                  marginTop: '10px',
                }}
              >
                {loading && (
                  <motion.div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid var(--navy)',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      marginRight: '8px',
                      display: 'inline-block',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                )}
                {loading ? 'Booking...' : 'Book Site Visit'}
              </button>
            </form>
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

