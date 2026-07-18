import React from 'react';

const fi = (hasErr) => ({
  width: '100%', padding: '10px 14px', border: `1px solid ${hasErr ? '#c0392b' : '#e6e6f0'}`,
  borderRadius: '8px', fontSize: '13.5px', color: '#171a35', outline: 'none', fontFamily: 'Inter,sans-serif',
  boxSizing: 'border-box', transition: 'border-color .2s', background: '#fff',
});

function FF({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#171a35', marginBottom: '6px' }}>{label}</label>
      {children}
      {error && <p style={{ color: '#c0392b', fontSize: '11.5px', marginTop: '4px' }}>{error}</p>}
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
  errors
}) {
  if (!showModal) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(11,15,46,.5)' }}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 70px rgba(0,0,0,.3)' }}
        onClick={e => e.stopPropagation()}>

        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e6e6f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 2 }}>
          <div>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '18px', fontWeight: 800, color: '#171a35' }}>{editing ? 'Edit Update' : '+ Add Construction Update'}</h2>
            <p style={{ fontSize: '12.5px', color: '#6b6f8a' }}>Track progress for a project</p>
          </div>
          <button onClick={() => setShowModal(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#6b6f8a', lineHeight: 1 }}>&#x2715;</button>
        </div>

        <form onSubmit={handleSubmitForm(onSubmit)} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <FF label="Title *" error={errors.title?.message}>
            <input {...register('title', { required: 'Title is required' })} placeholder="e.g. Foundation Work Completed" style={fi(!!errors.title)} />
          </FF>

          <FF label="Description">
            <textarea {...register('description')} rows={3} placeholder="Describe what was done..." style={{ ...fi(), resize: 'none' }} />
          </FF>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FF label="Project">
              <select {...register('project')} style={fi()}>
                <option value="">Select Project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </FF>
            <FF label="Plot (optional)">
              <select {...register('plot')} style={fi()}>
                <option value="">All Plots</option>
                {plots.map(p => <option key={p._id} value={p._id}>Plot {p.plotNumber}</option>)}
              </select>
            </FF>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FF label="Stage">
              <select {...register('stage', { required: 'Stage is required' })} style={fi(!!errors.stage)}>
                <option value="">Select Stage</option>
                {['planning', 'foundation', 'structure', 'roofing', 'finishing', 'completed'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </FF>
            <FF label={`Progress: ${progressValue || 0}%`}>
              <input type="range" min="0" max="100" {...register('progressPercent')}
                style={{ width: '100%', accentColor: '#3a2fb8', cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ea1c4', marginTop: '4px' }}>
                <span>0%</span><span>50%</span><span>100%</span>
              </div>
              <div style={{ height: '8px', background: '#e6e6f0', borderRadius: '4px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressValue || 0}%`, background: (progressValue || 0) >= 80 ? '#2f9e5c' : '#3a2fb8', borderRadius: '4px', transition: 'width .2s' }} />
              </div>
            </FF>
          </div>

          <FF label="Images (max 5)">
            <input type="file" accept="image/*" multiple
              onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 5))}
              style={{ fontSize: '13px', color: '#171a35' }} />
            {files.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {files.map((f, i) => (
                  <span key={i} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: '#f0f0ff', color: '#3a2fb8', fontWeight: 600 }}>{f.name}</span>
                ))}
              </div>
            )}
            {editing?.images?.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <span style={{ fontSize: '11px', color: '#9ea1c4' }}>{editing.images.length} existing image(s)</span>
              </div>
            )}
          </FF>

          <FF label="Engineer Report">
            <textarea {...register('engineerReport')} rows={2} placeholder="Optional engineer notes or report..." style={{ ...fi(), resize: 'none' }} />
          </FF>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '4px' }}>
            <button type="button" onClick={() => setShowModal(false)}
              style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e6e6f0', background: '#fff', color: '#6b6f8a', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-gold"
              style={{ fontSize: '13.5px', opacity: submitting ? .7 : 1, cursor: submitting ? 'not-allowed' : 'pointer', border: 'none' }}>
              {submitting ? 'Saving...' : editing ? 'Save Update' : 'Create Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
