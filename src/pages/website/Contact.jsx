import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createLead } from '../../api/leads';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';

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
    <div className="bg-slate-50 min-h-screen">
      {/* ===== PAGE HEADER ===== */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-14 md:py-20 text-center relative overflow-hidden px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-amber-400 font-bold text-[11px] md:text-xs uppercase tracking-widest mb-3 border border-white/10">
            GET IN TOUCH
          </span>
          <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-normal px-2">
            We&apos;d love to hear from you. Get in touch with our team and we&apos;ll respond within 24 hours.
          </p>
        </div>
      </div>

      {/* ===== CONTENT WRAPPER ===== */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 md:pt-14 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ===== FORM CARD ===== */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 md:p-10">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest font-poppins">
              SEND A MESSAGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 mb-6 font-poppins">
              How Can We Help You?
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
              {/* Name + Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Your name"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition bg-white ${
                      errors.name ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                    })}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition bg-white ${
                      errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone is required', minLength: { value: 10, message: 'Min 10 digits' } })}
                  placeholder="9876543210"
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition bg-white ${
                    errors.phone ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message
                </label>
                <textarea
                  rows={5}
                  {...register('message', { required: 'Message is required' })}
                  placeholder="Tell us about your requirements..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition resize-none bg-white ${
                    errors.message ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                  }`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1 font-medium">{errors.message.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane className="text-xs" />
                {loading ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* ===== RIGHT SIDEBAR ===== */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            
            {/* Contact info cards */}
            {[
              { icon: <FaMapMarkerAlt />, label: 'Address', value: 'Bhubaneswar, Odisha, India 751029' },
              { icon: <FaPhoneAlt />, label: 'Phone', value: '+91 70000 12345' },
              { icon: <FaEnvelope />, label: 'Email', value: 'info@jsminfra.com' },
              { icon: <FaClock />, label: 'Office Hours', value: 'Mon – Sat: 9:00 AM – 7:00 PM' },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-start gap-4 shadow-sm hover:shadow-md transition duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-800 mb-0.5 font-poppins">
                    {item.label}
                  </h5>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}

            {/* CTA mini banner */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-6 text-white shadow-xl space-y-4">
              <div>
                <h4 className="font-poppins text-lg font-bold text-white mb-1">
                  Ready to Book a Site Visit?
                </h4>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  Our team will personally take you through our projects. Schedule your visit today.
                </p>
              </div>

              <Link
                to="/book-visit"
                className="inline-block px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md transition duration-200 text-center"
              >
                Book a Visit →
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
