import React from 'react';
import { LuX } from 'react-icons/lu';

function FormField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="block text-xs font-semibold text-slate-800">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

export default function UpdateFormModal({
  showModal = false,
  setShowModal,
  editing,
  submitting = false,
  onSubmit,
  projects = [],
  plots = [],
  progressValue = 0,
  files = [],
  setFiles,
  register,
  handleSubmitForm,
  errors,
}) {
  if (!showModal) return null;

  const inputClass = (hasErr) =>
    `w-full px-3.5 py-2.5 border rounded-xl text-xs font-medium text-slate-900 outline-none bg-white transition-colors focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 ${
      hasErr ? 'border-red-500' : 'border-slate-200 hover:border-slate-300'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-['Poppins',sans-serif] text-lg font-bold text-slate-900">
              {editing ? 'Edit Construction Update' : '+ Add Construction Update'}
            </h2>
            <p className="text-xs text-slate-500">Track progress for a project</p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="bg-transparent border-0 cursor-pointer text-slate-400 hover:text-slate-700 text-xl p-1 flex items-center justify-center transition-colors"
            aria-label="Close Modal"
          >
            <LuX />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmitForm(onSubmit)} className="p-6 flex flex-col gap-4.5">
          <FormField label="Title *" error={errors.title?.message}>
            <input
              {...register('title', { required: 'Title is required' })}
              placeholder="e.g. Foundation Work Completed"
              className={inputClass(!!errors.title)}
            />
          </FormField>

          <FormField label="Description">
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Describe what was done..."
              className={`${inputClass(false)} resize-none`}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Project">
              <select {...register('project')} className={inputClass(false)}>
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Plot (optional)">
              <select {...register('plot')} className={inputClass(false)}>
                <option value="">All Plots</option>
                {plots.map((p) => (
                  <option key={p._id} value={p._id}>
                    Plot {p.plotNumber}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Stage">
              <select
                {...register('stage', { required: 'Stage is required' })}
                className={inputClass(!!errors.stage)}
              >
                <option value="">Select Stage</option>
                {['planning', 'foundation', 'structure', 'roofing', 'finishing', 'completed'].map(
                  (s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  )
                )}
              </select>
            </FormField>

            <FormField label={`Progress: ${progressValue || 0}%`}>
              <input
                type="range"
                min="0"
                max="100"
                {...register('progressPercent')}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${
                    (progressValue || 0) >= 80 ? 'bg-emerald-600' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${progressValue || 0}%` }}
                />
              </div>
            </FormField>
          </div>

          <FormField label="Images (max 5)">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 5))}
              className="text-xs text-slate-700 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
            {files.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {files.map((f, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100"
                  >
                    {f.name}
                  </span>
                ))}
              </div>
            )}
            {editing?.images?.length > 0 && (
              <div className="mt-1.5">
                <span className="text-[11px] text-slate-400">
                  {editing.images.length} existing image(s)
                </span>
              </div>
            )}
          </FormField>

          <FormField label="Engineer Report">
            <textarea
              {...register('engineerReport')}
              rows={2}
              placeholder="Optional engineer notes or report..."
              className={`${inputClass(false)} resize-none`}
            />
          </FormField>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`cta-btn px-5 py-2.5 text-xs font-bold rounded-xl transition-all border-0 ${
                submitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {submitting ? 'Saving...' : editing ? 'Save Update' : 'Create Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
