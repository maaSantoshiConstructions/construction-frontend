import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

export default function PlotFormModal({
  showModal,
  setShowModal,
  editing,
  submitting,
  onSubmit,
  projects,
  facings,
  register,
  handleSubmitForm,
  errors,
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
      >
        <form onSubmit={handleSubmitForm(onSubmit)} className="flex flex-col max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 shrink-0">
            <div>
              <h2 className="text-[20px] font-bold text-slate-900 leading-tight">{editing ? 'Edit Plot Inventory' : 'Add New Plot'}</h2>
              <p className="text-[13px] text-slate-400 font-medium mt-0.5">{editing ? 'Update the details of this plot' : 'Fill in the details to add a new plot'}</p>
            </div>
            <button type="button" onClick={() => setShowModal(false)} className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-all duration-200 text-slate-400 hover:text-slate-700">
              <FaTimes className="text-[14px]" />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-7 py-6 space-y-8">
            {/* Section 1: Basic Info */}
            <div>
              <h3 className="text-[13px] font-semibold text-slate-700 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2 uppercase tracking-wide">
                <span className="w-1 h-4 bg-amber-500 rounded-full" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-2">Plot Number *</label>
                  <input
                    placeholder="e.g. 104"
                    {...register('plotNumber', { required: 'Plot number is required' })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400"
                  />
                  {errors.plotNumber && <p className="text-rose-500 text-[12px] mt-1.5">{errors.plotNumber.message}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-2">Project *</label>
                  <select
                    {...register('project', { required: 'Project is required' })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium"
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                  {errors.project && <p className="text-rose-500 text-[12px] mt-1.5">{errors.project.message}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Dimensions & Specs */}
            <div>
              <h3 className="text-[13px] font-semibold text-slate-700 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2 uppercase tracking-wide">
                <span className="w-1 h-4 bg-amber-500 rounded-full" />
                Dimensions &amp; Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-x-5 gap-y-5">
                <div className="md:col-span-2">
                  <label className="block text-[12px] font-semibold text-slate-600 mb-2">Size (sq.ft)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1200"
                    {...register('size')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[12px] font-semibold text-slate-600 mb-2">Length (ft)</label>
                  <input
                    type="number"
                    placeholder="e.g. 40"
                    {...register('length')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[12px] font-semibold text-slate-600 mb-2">Width (ft)</label>
                  <input
                    type="number"
                    placeholder="e.g. 30"
                    {...register('width')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-[12px] font-semibold text-slate-600 mb-2">Facing Direction</label>
                  <select
                    {...register('facing')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium"
                  >
                    {facings.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-[12px] font-semibold text-slate-600 mb-2">Road Width (ft)</label>
                  <input
                    type="number"
                    placeholder="e.g. 30"
                    {...register('roadWidth')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400"
                  />
                </div>

                <div className="md:col-span-6 mt-1">
                  <label className="flex items-center gap-3 text-[13px] font-semibold text-slate-700 cursor-pointer select-none hover:text-slate-900 transition-colors duration-200">
                    <input
                      type="checkbox"
                      {...register('corner')}
                      className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500/20 accent-amber-500 transition-all"
                    />
                    <span>Corner Plot (Premium Location)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 3: Pricing & Location */}
            <div>
              <h3 className="text-[13px] font-semibold text-slate-700 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2 uppercase tracking-wide">
                <span className="w-1 h-4 bg-amber-500 rounded-full" />
                Pricing &amp; Location Coordinates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-2">Total Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1500000"
                    {...register('price')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-2">Plot Status</label>
                  <select
                    {...register('status')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[12px] font-semibold text-slate-600 mb-2">Coordinates (latitude,longitude)</label>
                  <input
                    placeholder="e.g. 20.2961,85.8245"
                    {...register('coordinates')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">Comma-separated GPS coordinates for plotting on the master plan layout.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 px-7 py-4.5 bg-slate-50 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 text-[14px] font-semibold border border-slate-200 rounded-xl transition-all duration-200 shadow-sm active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-[14px] rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <span>{editing ? 'Save Changes' : 'Create Plot'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
