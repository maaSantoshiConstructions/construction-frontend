import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { LuEye, LuEyeOff } from 'react-icons/lu';

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

  const inputClass = (hasErr) =>
    `w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium text-slate-900 outline-none bg-white transition-colors focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 ${
      hasErr ? 'border-red-500' : 'border-slate-200 hover:border-slate-300'
    }`;

  return (
    <div className="min-h-screen flex">
      {/* Left Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0b0f2e] via-[#161b45] to-[#1c1450] items-center justify-center p-12 relative overflow-hidden flex-col text-center">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/15 pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-amber-500/10 pointer-events-none" />

        <div className="relative z-10 max-w-sm">
          <img
            src="/construction logo.png"
            alt="JSMIL"
            className="h-32 w-auto object-contain mx-auto mb-5 block"
          />
          <h1 className="text-white font-['Poppins',sans-serif] font-extrabold text-3xl leading-snug mb-4">
            Build Your Future. <br />
            Invest with Confidence.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Join our AI-powered platform for real-time plot tracking, seamless booking, and transparent project updates.
          </p>
          <div className="flex gap-6 justify-center">
            {[
              ['10+', 'Smart Features'],
              ['500+', 'Happy Customers'],
              ['100+', 'Acres Delivered'],
            ].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="text-amber-400 font-['Poppins',sans-serif] font-extrabold text-xl">
                  {n}
                </div>
                <div className="text-slate-400 text-xs mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center bg-[#f7f7fb] p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="flex lg:hidden justify-center mb-6">
            <img
              src="/construction logo.png"
              alt="JSMIL"
              className="h-20 w-auto object-contain"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-9">
            <h2 className="font-['Poppins',sans-serif] text-2xl font-extrabold text-slate-900 mb-1">
              Create Account
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mb-6">
              Fill in your details to get started
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="John Doe"
                  className={inputClass(!!errors.name)}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/i, message: 'Invalid email address' },
                  })}
                  placeholder="you@example.com"
                  className={inputClass(!!errors.email)}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register('phone', {
                    required: 'Phone number is required',
                    minLength: { value: 10, message: 'Minimum 10 digits' },
                  })}
                  placeholder="9876543210"
                  className={inputClass(!!errors.phone)}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' },
                    })}
                    placeholder="••••••••"
                    className={`${inputClass(!!errors.password)} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer text-slate-400 hover:text-slate-600 p-1 flex items-center justify-center"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === watch('password') || 'Passwords do not match',
                    })}
                    placeholder="••••••••"
                    className={`${inputClass(!!errors.confirmPassword)} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer text-slate-400 hover:text-slate-600 p-1 flex items-center justify-center"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`cta-btn w-full justify-center py-3.5 text-xs font-bold rounded-xl border-0 shadow-md no-underline transition-all mt-2 ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {loading ? 'Creating Account...' : 'Create Account →'}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-6">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-bold no-underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            <Link
              to="/"
              className="text-slate-400 hover:text-slate-600 no-underline transition-colors font-medium"
            >
              ← Back to Website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
