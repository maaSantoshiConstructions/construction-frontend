import React from 'react';
import toast from 'react-hot-toast';

function FormField({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#171a35', marginBottom: '6px' }}>{label}</label>
      {children}
      {error && <p style={{ color: '#c0392b', fontSize: '11.5px', marginTop: '4px' }}>{error}</p>}
    </div>
  );
}

const fi = (hasErr) => ({
  width: '100%', padding: '10px 14px', border: `1px solid ${hasErr ? '#c0392b' : '#e6e6f0'}`,
  borderRadius: '8px', fontSize: '13.5px', color: '#171a35', outline: 'none', fontFamily: 'Inter,sans-serif',
  boxSizing: 'border-box', transition: 'border-color .2s', background: '#fff',
});

export default function ProjectFormModal({
  showModal,
  setShowModal,
  editing,
  submitting,
  onSubmit,
  register,
  handleSubmitForm,
  errors,
  selectedFiles,
  setSelectedFiles,
  updateProject,
  fetchProjects,
  setEditing,
}) {
  if (!showModal) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(11,15,46,.5)' }}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 70px rgba(0,0,0,.3)' }}
        onClick={e => e.stopPropagation()}>

        {/* Modal header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e6e6f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 2 }}>
          <div>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '18px', fontWeight: 800, color: '#171a35' }}>{editing ? 'Edit Project' : '+ Add Project'}</h2>
            <p style={{ fontSize: '12.5px', color: '#6b6f8a' }}>{editing ? 'Update project details' : 'Fill in the project details below'}</p>
          </div>
          <button onClick={() => setShowModal(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#6b6f8a', lineHeight: 1 }}>✕</button>
        </div>

        <form onSubmit={handleSubmitForm(onSubmit)} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <FormField label="Project Name *" error={errors.name?.message}>
            <input {...register('name', { required: 'Name is required' })} placeholder="e.g. Green City Phase 2" style={fi(!!errors.name)} />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormField label="Type">
              <select {...register('type')} style={fi()}>
                <option value="plotted_development">Plotted Development</option>
                <option value="villas">Villas</option>
                <option value="apartments">Apartments</option>
                <option value="commercial">Commercial</option>
              </select>
            </FormField>
            <FormField label="Status">
              <select {...register('status')} style={fi()}>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </FormField>
          </div>

          <FormField label="Description">
            <textarea {...register('description')} rows={3} placeholder="Short description of the project..." style={{ ...fi(), resize: 'none' }} />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormField label="Location / Area">
              <input {...register('location')} placeholder="e.g. Patia" style={fi()} />
            </FormField>
            <FormField label="City">
              <input {...register('city')} placeholder="e.g. Bhubaneswar" style={fi()} />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormField label="State">
              <input {...register('state')} placeholder="e.g. Odisha" style={fi()} />
            </FormField>
            <FormField label="Price per Sq.Ft (₹)">
              <input type="number" {...register('pricePerSqft')} placeholder="e.g. 2450" style={fi()} />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormField label="Total Plots">
              <input type="number" {...register('totalPlots')} placeholder="e.g. 150" style={fi()} />
            </FormField>
            <FormField label="Total Area (sq.ft / acres)">
              <input type="number" {...register('totalArea')} placeholder="e.g. 120000" style={fi()} />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormField label="RERA Number">
              <input {...register('reraNumber')} placeholder="e.g. OD/01/2023/01234" style={fi()} />
            </FormField>
            <FormField label="Possession Date">
              <input type="date" {...register('possessionDate')} style={fi()} />
            </FormField>
          </div>

          <FormField label="Amenities (comma-separated)">
            <input {...register('amenities')} placeholder="e.g. Park, Clubhouse, Security, Gym" style={fi()} />
          </FormField>

          <FormField label="Location Highlights (comma-separated)">
            <input {...register('highlights')} placeholder="e.g. Near National Highway, 10 min to station, Hospital close by" style={fi()} />
          </FormField>

          {editing && editing.images?.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#171a35', marginBottom: '6px' }}>Existing Images</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {editing.images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e6e6f0' }}>
                    <img src={img.startsWith('http') ? img : `http://localhost:5002/${img}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={async () => {
                        const newImages = editing.images.filter((_, i) => i !== idx);
                        const updated = { ...editing, images: newImages };
                        await updateProject(editing._id, { images: newImages });
                        setEditing(updated);
                        toast.success('Image removed');
                        fetchProjects();
                      }}
                      style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(231,76,60,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <FormField label="Upload Project Images (Select multiple)">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
              style={fi()}
            />
          </FormField>

          <FormField label="Layout Plan Map Image URL">
            <input
              {...register('layoutImage')}
              placeholder="e.g. https://images.unsplash.com/photo-..."
              style={fi()}
            />
          </FormField>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '4px' }}>
            <button type="button" onClick={() => setShowModal(false)}
              style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e6e6f0', background: '#fff', color: '#6b6f8a', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-gold"
              style={{ fontSize: '13.5px', opacity: submitting ? .7 : 1, cursor: submitting ? 'not-allowed' : 'pointer', border: 'none' }}>
              {submitting ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
