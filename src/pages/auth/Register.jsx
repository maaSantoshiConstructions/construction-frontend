import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register: registerUser, getRedirectPath } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      toast.success('Account created successfully!');
      navigate(redirectParam || getRedirectPath(user.role));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left panel */}
      <div style={{
        display: 'none',
        width: '50%',
        background: 'radial-gradient(ellipse at 30% 20%, rgba(91,79,224,.4), transparent 60%), linear-gradient(135deg,#0b0f2e 0%,#161b45 60%,#1c1450 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
        flexDirection: 'column',
      }} className="register-left">
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(91,79,224,.15)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(232,179,85,.1)' }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '380px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '14px',
            background: 'linear-gradient(135deg,#e8b355,#d99f36)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Poppins,sans-serif', fontWeight: 800, color: '#0b0f2e', fontSize: '22px',
            margin: '0 auto 24px',
          }}>JS</div>
          <div style={{ color: '#e8b355', fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '.3px', marginBottom: '4px' }}>JAI SANTOSHI MAA</div>
          <div style={{ color: '#c7cae0', fontSize: '10px', letterSpacing: '1.5px', marginBottom: '28px' }}>INFRASTRUCTURE PVT. LTD.</div>
          <h1 style={{ color: '#fff', fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '28px', lineHeight: 1.2, marginBottom: '16px' }}>
            Build Your Future.<br />Invest with Confidence.
          </h1>
          <p style={{ color: '#b7bade', fontSize: '14px', lineHeight: 1.7 }}>
            Join our AI-powered platform for real-time plot tracking, seamless booking, and transparent project updates.
          </p>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '40px' }}>
            {[['25+','Smart Features'], ['500+','Happy Customers'], ['100+','Acres Delivered']].map(([n,l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ color: '#e8b355', fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '20px' }}>{n}</div>
                <div style={{ color: '#9ea1c4', fontSize: '11px', marginTop: '2px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f7f7fb',
        padding: '32px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Logo for mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px', justifyContent: 'center' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '8px',
              background: 'linear-gradient(135deg,#e8b355,#d99f36)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, color: '#0b0f2e', fontSize: '16px', fontFamily: 'Poppins,sans-serif',
            }}>JS</div>
            <div>
              <div style={{ color: '#0b0f2e', fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: '14px', letterSpacing: '.3px' }}>JAI SANTOSHI MAA</div>
              <div style={{ color: '#6b6f8a', fontSize: '9px', letterSpacing: '1.5px' }}>INFRASTRUCTURE PVT. LTD.</div>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e6e6f0', boxShadow: '0 15px 40px rgba(20,20,60,.09)', padding: '36px' }}>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '24px', fontWeight: 800, color: '#171a35', marginBottom: '6px' }}>Create Account</h2>
            <p style={{ color: '#6b6f8a', fontSize: '14px', marginBottom: '28px' }}>Fill in your details to get started</p>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={lbl}>Full Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="John Doe"
                  style={inp(!!errors.name)}
                />
                {errors.name && <p style={err}>{errors.name.message}</p>}
              </div>

              <div>
                <label style={lbl}>Email Address</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/i, message: 'Invalid email address' },
                  })}
                  placeholder="you@example.com"
                  style={inp(!!errors.email)}
                />
                {errors.email && <p style={err}>{errors.email.message}</p>}
              </div>

              <div>
                <label style={lbl}>Phone Number</label>
                <input
                  type="tel"
                  {...register('phone', {
                    required: 'Phone number is required',
                    minLength: { value: 10, message: 'Minimum 10 digits' },
                  })}
                  placeholder="9876543210"
                  style={inp(!!errors.phone)}
                />
                {errors.phone && <p style={err}>{errors.phone.message}</p>}
              </div>

              <div>
                <label style={lbl}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' },
                    })}
                    placeholder="••••••••"
                    style={{ ...inp(!!errors.password), paddingRight: '40px' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b6f8a', fontSize: '14px' }}>
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {errors.password && <p style={err}>{errors.password.message}</p>}
              </div>

              <div>
                <label style={lbl}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === watch('password') || 'Passwords do not match',
                    })}
                    placeholder="••••••••"
                    style={{ ...inp(!!errors.confirmPassword), paddingRight: '40px' }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b6f8a', fontSize: '14px' }}>
                    {showConfirm ? '🙈' : '👁'}
                  </button>
                </div>
                {errors.confirmPassword && <p style={err}>{errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-gold"
                style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px', opacity: loading ? .7 : 1, cursor: loading ? 'not-allowed' : 'pointer', border: 'none', marginTop: '10px' }}>
                {loading ? 'Creating Account...' : 'Create Account →'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b6f8a', marginTop: '20px' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#3a2fb8', fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ea1c4', marginTop: '20px' }}>
            <Link to="/" style={{ color: '#9ea1c4' }}>← Back to Website</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media(min-width:1024px){.register-left{display:flex !important;}}
      `}</style>
    </div>
  );
}

const lbl = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#171a35', marginBottom: '6px' };
const inp = (hasErr) => ({
  width: '100%', padding: '11px 14px', border: `1px solid ${hasErr ? '#c0392b' : '#e6e6f0'}`,
  borderRadius: '8px', fontSize: '14px', color: '#171a35', outline: 'none',
  transition: 'border-color .2s', background: '#fff', fontFamily: 'Inter,sans-serif', boxSizing: 'border-box',
});
const err = { color: '#c0392b', fontSize: '11.5px', marginTop: '4px' };
