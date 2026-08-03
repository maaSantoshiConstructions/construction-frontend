import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import { getAssetUrl } from '../../config';

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>}
    </div>
  );
}

const inputClass = (hasErr) =>
  `w-full px-4 py-3 bg-slate-50 border ${
    hasErr ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200'
  } rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed`;

export default function ProjectFormModal({
  showModal,
  setShowModal,
  editing,
  submitting,
  submittingPhase,
  onSubmit,
  register,
  handleSubmitForm,
  errors,
  selectedFiles = [],
  setSelectedFiles,
  imageValidationError,
  setImageValidationError,
  updateProject,
  fetchProjects,
  setEditing,
}) {
  // Prevent accidental page refresh / navigation during active submission
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (submitting) {
        e.preventDefault();
        e.returnValue = 'Project creation is in progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    if (submitting) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [submitting]);

  if (!showModal) return null;

  const handleClose = () => {
    if (submitting) return;
    setShowModal(false);
  };

  const handleFileChange = (e) => {
    if (submitting) return;
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    if (setImageValidationError) {
      setImageValidationError('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 shrink-0 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editing ? 'Edit Project' : '+ Add Project'}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {editing ? 'Update project details below' : 'Fill in all required project details'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            title={submitting ? 'Submission in progress...' : 'Close'}
          >
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            if (submitting) {
              e.preventDefault();
              return;
            }
            handleSubmitForm(onSubmit)(e);
          }}
          className="flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-5">
            {/* Project Name */}
            <FormField label="Project Name *" error={errors.name?.message}>
              <input
                {...register('name', { required: 'Project Name is required' })}
                disabled={submitting}
                placeholder="e.g. Green City Phase 2"
                className={inputClass(!!errors.name)}
              />
            </FormField>

            {/* Type & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Type *" error={errors.type?.message}>
                <select
                  {...register('type', { required: 'Project Type is required' })}
                  disabled={submitting}
                  className={`${inputClass(!!errors.type)} cursor-pointer`}
                >
                  <option value="plotted_development">Plotted Development</option>
                  <option value="villas">Villas</option>
                  <option value="apartments">Apartments</option>
                  <option value="commercial">Commercial</option>
                </select>
              </FormField>
              <FormField label="Status *" error={errors.status?.message}>
                <select
                  {...register('status', { required: 'Project Status is required' })}
                  disabled={submitting}
                  className={`${inputClass(!!errors.status)} cursor-pointer`}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </FormField>
            </div>

            {/* Description */}
            <FormField label="Description">
              <textarea
                {...register('description')}
                disabled={submitting}
                rows={3}
                placeholder="Short description of the project..."
                className={`${inputClass(false)} resize-none`}
              />
            </FormField>

            {/* Location & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Location / Area *" error={errors.location?.message}>
                <input
                  {...register('location', { required: 'Location / Area is required' })}
                  disabled={submitting}
                  placeholder="e.g. Patia"
                  className={inputClass(!!errors.location)}
                />
              </FormField>
              <FormField label="City *" error={errors.city?.message}>
                <input
                  {...register('city', { required: 'City is required' })}
                  disabled={submitting}
                  placeholder="e.g. Bhubaneswar"
                  className={inputClass(!!errors.city)}
                />
              </FormField>
            </div>

            {/* State & Price per Sq.Ft */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="State">
                <input
                  {...register('state')}
                  disabled={submitting}
                  placeholder="e.g. Odisha"
                  className={inputClass(false)}
                />
              </FormField>
              <FormField label="Price per Sq.Ft (₹)">
                <input
                  type="number"
                  disabled={submitting}
                  {...register('pricePerSqft', { min: { value: 0, message: 'Must be positive' } })}
                  placeholder="e.g. 2450"
                  className={inputClass(!!errors.pricePerSqft)}
                />
              </FormField>
            </div>

            {/* Total Plots & Total Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Total Plots *" error={errors.totalPlots?.message}>
                <input
                  type="number"
                  disabled={submitting}
                  {...register('totalPlots', {
                    required: 'Total Plots is required',
                    min: { value: 0, message: 'Must be 0 or greater' },
                  })}
                  placeholder="e.g. 150"
                  className={inputClass(!!errors.totalPlots)}
                />
              </FormField>
              <FormField label="Total Area (sq.ft / acres) *" error={errors.totalArea?.message}>
                <input
                  type="number"
                  disabled={submitting}
                  {...register('totalArea', {
                    required: 'Total Area is required',
                    min: { value: 0, message: 'Must be 0 or greater' },
                  })}
                  placeholder="e.g. 120000"
                  className={inputClass(!!errors.totalArea)}
                />
              </FormField>
            </div>

            {/* RERA Number & Possession Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="RERA Number *" error={errors.reraNumber?.message}>
                <input
                  {...register('reraNumber', { required: 'RERA Number is required' })}
                  disabled={submitting}
                  placeholder="e.g. OD/01/2023/01234"
                  className={inputClass(!!errors.reraNumber)}
                />
              </FormField>
              <FormField label="Possession Date *" error={errors.possessionDate?.message}>
                <input
                  type="date"
                  disabled={submitting}
                  {...register('possessionDate', { required: 'Possession Date is required' })}
                  className={inputClass(!!errors.possessionDate)}
                />
              </FormField>
            </div>

            {/* Amenities & Highlights */}
            <FormField label="Amenities (comma-separated)">
              <input
                {...register('amenities')}
                disabled={submitting}
                placeholder="e.g. Park, Clubhouse, Security, Gym"
                className={inputClass(false)}
              />
            </FormField>

            <FormField label="Location Highlights (comma-separated)">
              <input
                {...register('highlights')}
                disabled={submitting}
                placeholder="e.g. Near National Highway, 10 min to station, Hospital close by"
                className={inputClass(false)}
              />
            </FormField>

            {/* Existing Images (Edit mode) */}
            {editing && editing.images?.length > 0 && (
              <div className="mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Existing Images
                </label>
                <div className="flex gap-2 flex-wrap">
                  {editing.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 group"
                    >
                      <img src={getAssetUrl(img)} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={async () => {
                          if (submitting) return;
                          const newImages = editing.images.filter((_, i) => i !== idx);
                          const updated = { ...editing, images: newImages };
                          await updateProject(editing._id, { images: newImages });
                          setEditing(updated);
                          toast.success('Image removed');
                          fetchProjects();
                        }}
                        className="absolute top-1 right-1 bg-red-500/90 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center hover:bg-red-600 transition-colors disabled:cursor-not-allowed"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Upload Field */}
            <FormField label="Upload Project Images (Select multiple, max 10 images, 5MB limit each)">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                disabled={submitting}
                onChange={handleFileChange}
                className={inputClass(!!imageValidationError)}
              />
              {imageValidationError && (
                <p className="text-red-500 text-xs mt-1.5 font-semibold">⚠️ {imageValidationError}</p>
              )}
              {selectedFiles.length > 0 && !imageValidationError && (
                <p className="text-emerald-600 text-xs mt-1.5 font-semibold">
                  ✓ {selectedFiles.length} file(s) selected for upload
                </p>
              )}
            </FormField>

            {/* Layout Image */}
            <FormField label="Layout Plan Map Image URL">
              <input
                {...register('layoutImage')}
                disabled={submitting}
                placeholder="e.g. https://images.unsplash.com/photo-..."
                className={inputClass(false)}
              />
            </FormField>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-3 py-1">
              <input
                type="checkbox"
                id="featured"
                disabled={submitting}
                {...register('featured')}
                className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-200 cursor-pointer disabled:cursor-not-allowed"
              />
              <label
                htmlFor="featured"
                className="text-sm font-semibold text-slate-800 cursor-pointer disabled:cursor-not-allowed"
              >
                Featured Project (Show on Homepage)
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end items-center gap-3 px-8 py-5 bg-slate-50 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 text-sm font-semibold border border-slate-200 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold rounded-xl shadow-md shadow-amber-500/20 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {submitting && (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              <span>
                {submitting
                  ? submittingPhase || 'Creating Project...'
                  : editing
                  ? 'Update Project'
                  : 'Create Project'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
