import React from 'react';
import { motion } from 'framer-motion';
import { LuCalendar, LuClock, LuMapPin } from 'react-icons/lu';

export default function BookVisitForm({
  projects,
  timeSlots,
  getMinDate,
  register,
  watch,
  handleSubmitForm,
  errors,
  onSubmit,
  loading,
}) {
  const visitType = watch ? watch('visitType', 'physical') : 'physical';

  return (
    <div className="bg-[#f7f7fb] min-h-screen pb-[90px]">
      {/* ===== PAGE HEADER ===== */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-center py-16 px-4 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-white/10 text-amber-400 border border-white/10">
            SECURE YOUR PLOT
          </span>
          <h1 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-3.5">
            Book a Site Visit
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Schedule a free site visit with our experts to explore your dream plot in person.
          </p>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="max-w-xl mx-auto px-4 -mt-7 relative z-10">
        <div>
          {/* ===== FORM CARD ===== */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-9">
            <span className="inline-block px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wider rounded-md bg-indigo-50 text-indigo-700 mb-2">
              SCHEDULE YOUR VISIT
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mb-7">
              Select Date &amp; Time
            </h2>

            <form onSubmit={handleSubmitForm(onSubmit)} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">Select Project</label>
                <select
                  {...register('project', { required: 'Please select a project' })}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm text-slate-800 bg-white outline-none transition-colors border ${
                    errors.project ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-indigo-600'
                  }`}
                >
                  <option value="">Choose a project</option>
                  {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
                {errors.project && <p className="text-red-600 text-xs mt-1">{errors.project.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">Visit Type</label>
                <select
                  {...register('visitType', { required: 'Please select a visit type' })}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm text-slate-800 bg-white outline-none transition-colors border ${
                    errors.visitType ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-indigo-600'
                  }`}
                >
                  <option value="physical">Physical Visit (on-site with executive)</option>
                  <option value="vr">VR Visit (online virtual reality tour)</option>
                </select>
                {errors.visitType && <p className="text-red-600 text-xs mt-1">{errors.visitType.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">Preferred Date</label>
                  <div className="relative">
                    <LuCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
                    <input
                      type="date"
                      min={getMinDate()}
                      {...register('date', { required: 'Please select a date' })}
                      className={`w-full pl-9.5 pr-3.5 py-2.5 rounded-lg text-xs sm:text-sm text-slate-800 bg-white outline-none transition-colors border ${
                        errors.date ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-indigo-600'
                      }`}
                    />
                  </div>
                  {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">Time Slot</label>
                  <div className="relative">
                    <LuClock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none z-10" />
                    <select
                      {...register('timeSlot', { required: 'Please select a time' })}
                      className={`w-full pl-9.5 pr-3.5 py-2.5 rounded-lg text-xs sm:text-sm text-slate-800 bg-white outline-none transition-colors border ${
                        errors.timeSlot ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-indigo-600'
                      }`}
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                  </div>
                  {errors.timeSlot && <p className="text-red-600 text-xs mt-1">{errors.timeSlot.message}</p>}
                </div>
              </div>

              {visitType === 'physical' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">Pickup Location</label>
                  <div className="relative">
                    <LuMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
                    <input
                      type="text"
                      {...register('pickupLocation', { required: visitType === 'physical' ? 'Pickup location is required' : false })}
                      className={`w-full pl-9.5 pr-3.5 py-2.5 rounded-lg text-xs sm:text-sm text-slate-800 bg-white outline-none transition-colors border ${
                        errors.pickupLocation ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-indigo-600'
                      }`}
                      placeholder="Enter your pickup address"
                    />
                  </div>
                  {errors.pickupLocation && <p className="text-red-600 text-xs mt-1">{errors.pickupLocation.message}</p>}
                </div>
              )}

              {visitType === 'vr' && (
                <div className="p-3.5 rounded-lg border border-indigo-200 bg-indigo-50/70 text-xs font-medium text-indigo-900 leading-relaxed">
                  <strong>Virtual Reality Tour:</strong> You will join an online meeting. We will provide a 3D VR walkthrough of the project and plots. No pickup or physical travel is required!
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full justify-center py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 transition-all cursor-pointer shadow-xs disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 border-0"
              >
                {loading && (
                  <motion.div
                    className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full"
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
