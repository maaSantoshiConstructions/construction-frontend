import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { getProjects, createProject, updateProject, deleteProject, uploadProjectImages } from '../../../api/projects';
import ErrorMessage from '../../../components/common/ErrorMessage';

const statusColor = { upcoming: '#d99f36', ongoing: '#5b4fe0', completed: '#2f9e5c' };

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchProjects = async (p = page) => {
    setLoading(true); setError(null);
    try {
      const { data: res } = await getProjects({ page: p, limit: 10 });
      setProjects(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) { setError(err?.response?.data?.message || 'Failed to load projects'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, [page]);

  const openCreate = () => {
    setEditing(null);
    setSelectedFiles([]);
    reset({
      name: '',
      type: 'plotted_development',
      description: '',
      location: '',
      city: '',
      state: '',
      status: 'upcoming',
      pricePerSqft: '',
      reraNumber: '',
      amenities: '',
      layoutImage: '',
      totalPlots: '',
      totalArea: '',
      possessionDate: '',
      highlights: '',
    });
    setShowModal(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setSelectedFiles([]);
    reset({
      ...project,
      amenities: project.amenities?.join(', ') || '',
      highlights: project.highlights?.join(', ') || '',
      possessionDate: project.possessionDate ? new Date(project.possessionDate).toISOString().split('T')[0] : '',
      layoutImage: project.layoutImage || '',
    });
    setShowModal(true);
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : [],
        highlights: formData.highlights ? formData.highlights.split(',').map(h => h.trim()) : [],
        totalPlots: formData.totalPlots ? Number(formData.totalPlots) : null,
        totalArea: formData.totalArea ? Number(formData.totalArea) : null,
        possessionDate: formData.possessionDate || null,
      };
      let savedProject;
      if (editing) { 
        const { data: res } = await updateProject(editing._id, payload);
        savedProject = res?.data;
        toast.success('Project updated');
      }
      else { 
        const { data: res } = await createProject(payload);
        savedProject = res?.data;
        toast.success('Project created');
      }

      if (selectedFiles.length > 0 && savedProject?._id) {
        const uploadData = new FormData();
        selectedFiles.forEach((file) => {
          uploadData.append('images', file);
        });
        await uploadProjectImages(savedProject._id, uploadData);
        toast.success('Images uploaded successfully');
      }

      setShowModal(false); fetchProjects();
    } catch (err) { toast.error(err?.response?.data?.message || 'Operation failed'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { await deleteProject(id); toast.success('Deleted'); fetchProjects(); }
    catch (err) { toast.error(err?.response?.data?.message || 'Delete failed'); }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '22px', fontWeight: 800, color: '#171a35', marginBottom: '4px' }}>Manage Projects</h1>
          <p style={{ color: '#6b6f8a', fontSize: '13.5px' }}>Create and manage real estate projects</p>
        </div>
        <button onClick={openCreate} className="btn-gold" style={{ fontSize: '13px', padding: '10px 20px', border: 'none' }}>
          + Add Project
        </button>
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => fetchProjects()} /> : (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e6e6f0', boxShadow: '0 2px 10px rgba(20,20,60,.05)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ea1c4' }}>Loading projects...</div>
          ) : projects.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏗</div>
              <p style={{ color: '#6b6f8a', fontSize: '14px', marginBottom: '16px' }}>No projects yet. Add your first project.</p>
              <button onClick={openCreate} className="btn-gold" style={{ fontSize: '13px', padding: '10px 20px', border: 'none' }}>+ Add Project</button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f7f7fb', borderBottom: '1px solid #e6e6f0' }}>
                  {['#','Name','Type','Location','Plots','Status','Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11.5px', fontWeight: 700, color: '#6b6f8a', letterSpacing: '.5px', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((r, i) => (
                  <tr key={r._id} style={{ borderBottom: '1px solid #f0f0f6', transition: '.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f7f7fb'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={td}>{(page - 1) * 10 + i + 1}</td>
                    <td style={td}><span style={{ fontWeight: 600, color: '#171a35', fontSize: '13.5px' }}>{r.name}</span></td>
                    <td style={td}><span style={{ color: '#6b6f8a', fontSize: '13px', textTransform: 'capitalize' }}>{r.type?.replace(/_/g,' ')}</span></td>
                    <td style={td}><span style={{ color: '#6b6f8a', fontSize: '13px' }}>{r.location?.city || r.location?.address || '-'}</span></td>
                    <td style={td}><span style={{ color: '#6b6f8a', fontSize: '13px' }}>{r.totalPlots || r.plots?.length || 0}</span></td>
                    <td style={td}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: (statusColor[r.status] || '#3a2fb8') + '18', color: statusColor[r.status] || '#3a2fb8' }}>
                        {r.status}
                      </span>
                    </td>
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
          )}

          {/* Pagination */}
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

      {/* ===== MODAL ===== */}
      {showModal && (
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

            <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
      )}
    </div>
  );
}

function FormField({ label, error, children }) {
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
