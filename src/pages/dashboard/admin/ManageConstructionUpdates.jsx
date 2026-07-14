import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { getUpdates, createUpdate, updateUpdate, deleteUpdate } from '../../../api/constructionUpdates';
import { getProjects } from '../../../api/projects';
import { getPlots } from '../../../api/plots';
import ErrorMessage from '../../../components/common/ErrorMessage';

const stageColor = { planning: '#3a2fb8', foundation: '#d99f36', structure: '#5b4fe0', roofing: '#7a3fd6', finishing: '#2f9e5c', completed: '#2f9e5c' };

export default function ManageConstructionUpdates() {
  const [updates, setUpdates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState([]);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const progressValue = watch('progressPercent', 0);
  const selectedProject = watch('project');

  const fetchUpdates = async (p = page) => {
    setLoading(true); setError(null);
    try {
      const { data: res } = await getUpdates({ page: p, limit: 10 });
      setUpdates(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) { setError(err?.response?.data?.message || 'Failed to load updates'); }
    finally { setLoading(false); }
  };

  const fetchProjectsList = async () => {
    try { const { data: res } = await getProjects({ limit: 100 }); setProjects(res?.data || []); } catch {}
  };

  useEffect(() => { fetchUpdates(); }, [page]);
  useEffect(() => { fetchProjectsList(); }, []);

  useEffect(() => {
    const fetchPlots = async () => {
      if (!selectedProject) { setPlots([]); return; }
      try {
        const { data: res } = await getPlots({ project: selectedProject, limit: 500 });
        setPlots(res?.data || []);
      } catch { setPlots([]); }
    };
    fetchPlots();
  }, [selectedProject]);

  const openCreate = () => {
    setEditing(null);
    setFiles([]);
    reset({ title: '', description: '', project: '', plot: '', stage: '', progressPercent: 0, engineerReport: '' });
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setFiles([]);
    reset({
      title: u.title || '',
      description: u.description || '',
      project: u.project?._id || u.project || '',
      plot: u.plot?._id || u.plot || '',
      stage: u.stage || '',
      progressPercent: u.progressPercent || 0,
      engineerReport: u.engineerReport || '',
    });
    setShowModal(true);
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title || '');
      fd.append('description', formData.description || '');
      fd.append('project', formData.project || '');
      fd.append('stage', formData.stage || '');
      fd.append('progressPercent', formData.progressPercent ? parseInt(formData.progressPercent) : 0);
      if (formData.plot) fd.append('plot', formData.plot);
      if (formData.engineerReport) fd.append('engineerReport', formData.engineerReport);
      files.forEach((f) => fd.append('images', f));

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (editing) { await updateUpdate(editing._id, fd, config); toast.success('Update saved'); }
      else { await createUpdate(fd, config); toast.success('Update created'); }
      setShowModal(false); fetchUpdates();
    } catch (err) { toast.error(err?.response?.data?.message || 'Operation failed'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this update?')) return;
    try { await deleteUpdate(id); toast.success('Deleted'); fetchUpdates(); }
    catch (err) { toast.error(err?.response?.data?.message || 'Delete failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '22px', fontWeight: 800, color: '#171a35', marginBottom: '4px' }}>Construction Updates</h1>
          <p style={{ color: '#6b6f8a', fontSize: '13.5px' }}>Track and publish construction progress for all projects</p>
        </div>
        <button onClick={openCreate} className="btn-gold" style={{ fontSize: '13px', padding: '10px 20px', border: 'none' }}>
          + Add Update
        </button>
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => fetchUpdates()} /> : (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e6e6f0', boxShadow: '0 2px 10px rgba(20,20,60,.05)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ea1c4' }}>Loading updates...</div>
          ) : updates.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>&#x1F477;</div>
              <p style={{ color: '#6b6f8a', fontSize: '14px', marginBottom: '16px' }}>No construction updates yet.</p>
              <button onClick={openCreate} className="btn-gold" style={{ fontSize: '13px', padding: '10px 20px', border: 'none' }}>+ Add First Update</button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f7f7fb', borderBottom: '1px solid #e6e6f0' }}>
                    {['Title','Project','Stage','Progress','Date','Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11.5px', fontWeight: 700, color: '#6b6f8a', letterSpacing: '.5px', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {updates.map((r) => (
                    <tr key={r._id} style={{ borderBottom: '1px solid #f0f0f6', transition: '.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f7f7fb'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <td style={td}><span style={{ fontWeight: 600, color: '#171a35', fontSize: '13.5px' }}>{r.title}</span></td>
                      <td style={td}><span style={{ color: '#6b6f8a', fontSize: '13px' }}>{r.project?.name || '-'}</span></td>
                      <td style={td}>
                        {r.stage ? (
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: (stageColor[r.stage?.toLowerCase()] || '#3a2fb8') + '18', color: stageColor[r.stage?.toLowerCase()] || '#3a2fb8' }}>
                            {r.stage.charAt(0).toUpperCase() + r.stage.slice(1)}
                          </span>
                        ) : '-'}
                      </td>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '80px', height: '6px', background: '#e6e6f0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${r.progressPercent || 0}%`, background: (r.progressPercent || 0) >= 80 ? '#2f9e5c' : '#3a2fb8', borderRadius: '3px', transition: 'width .4s' }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#171a35' }}>{r.progressPercent || 0}%</span>
                        </div>
                      </td>
                      <td style={td}><span style={{ color: '#6b6f8a', fontSize: '12.5px' }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '-'}</span></td>
                      <td style={td}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => openEdit(r)}
                            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e6e6f0', background: '#fff', color: '#3a2fb8', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(r._id)}
                            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #fde8e8', background: '#fff8f8', color: '#c0392b', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '16px' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid', borderColor: p === page ? '#3a2fb8' : '#e6e6f0', background: p === page ? '#3a2fb8' : '#fff', color: p === page ? '#fff' : '#6b6f8a', fontWeight: p === page ? 700 : 400, fontSize: '13px', cursor: 'pointer' }}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {showModal && (
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

            <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
      )}
    </div>
  );
}

function FF({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#171a35', marginBottom: '6px' }}>{label}</label>
      {children}
      {error && <p style={{ color: '#c0392b', fontSize: '11.5px', marginTop: '4px' }}>{error}</p>}
    </div>
  );
}

const td = { padding: '13px 16px', fontSize: '13px', verticalAlign: 'middle' };
const fi = (hasErr) => ({
  width: '100%', padding: '10px 14px', border: `1px solid ${hasErr ? '#c0392b' : '#e6e6f0'}`,
  borderRadius: '8px', fontSize: '13.5px', color: '#171a35', outline: 'none', fontFamily: 'Inter,sans-serif',
  boxSizing: 'border-box', transition: 'border-color .2s', background: '#fff',
});
