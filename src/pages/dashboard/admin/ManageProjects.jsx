import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { getProjects, createProject, updateProject, deleteProject, uploadProjectImages } from '../../../api/projects';
import ErrorMessage from '../../../components/common/ErrorMessage';

// Import refactored subcomponents
import ProjectsHeader from '../../../components/manage-projects/ProjectsHeader';
import ProjectFormModal from '../../../components/manage-projects/ProjectFormModal';

const statusColor = { upcoming: '#d99f36', ongoing: '#5b4fe0', completed: '#2f9e5c' };
const td = { padding: '13px 16px', fontSize: '13px', verticalAlign: 'middle' };

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
      <ProjectsHeader openCreate={openCreate} />

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
      <ProjectFormModal
        showModal={showModal}
        setShowModal={setShowModal}
        editing={editing}
        submitting={submitting}
        onSubmit={onSubmit}
        register={register}
        handleSubmitForm={handleSubmit}
        errors={errors}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        updateProject={updateProject}
        fetchProjects={fetchProjects}
        setEditing={setEditing}
      />
    </div>
  );
}
