import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImages,
} from '../../../api/projects';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { validateImageFiles } from '../../../utils/fileValidation';
import { LuPlus, LuStar, LuBuilding2 } from 'react-icons/lu';

// Import subcomponents
import ProjectsHeader from '../../../components/manage-projects/ProjectsHeader';
import ProjectFormModal from '../../../components/manage-projects/ProjectFormModal';

const statusStyle = {
  upcoming: 'bg-amber-50 text-amber-700 border-amber-200',
  ongoing: 'bg-green-50 text-green-800 border-green-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittingPhase, setSubmittingPhase] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageValidationError, setImageValidationError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchProjects = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getProjects({ page: p, limit: 10 });
      setProjects(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page]);

  const openCreate = () => {
    setEditing(null);
    setSelectedFiles([]);
    setImageValidationError('');
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
      featured: false,
    });
    setShowModal(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setSelectedFiles([]);
    setImageValidationError('');
    reset({
      ...project,
      location:
        typeof project.location === 'object' && project.location !== null
          ? project.location.address || ''
          : typeof project.location === 'string'
          ? project.location
          : '',
      city:
        typeof project.location === 'object' && project.location !== null
          ? project.location.city || ''
          : project.city || '',
      state:
        typeof project.location === 'object' && project.location !== null
          ? project.location.state || ''
          : project.state || '',
      amenities: Array.isArray(project.amenities)
        ? project.amenities.join(', ')
        : project.amenities || '',
      highlights: Array.isArray(project.highlights)
        ? project.highlights.join(', ')
        : project.highlights || '',
      possessionDate: project.possessionDate
        ? new Date(project.possessionDate).toISOString().split('T')[0]
        : '',
      layoutImage: project.layoutImage || '',
      featured: !!project.featured,
    });
    setShowModal(true);
  };

  const onSubmit = async (formData) => {
    if (submitting) return;

    if (selectedFiles.length > 0) {
      const fileCheck = validateImageFiles(selectedFiles);
      if (!fileCheck.valid) {
        setImageValidationError(fileCheck.error);
        toast.error(fileCheck.error);
        return;
      }
    }

    setImageValidationError('');
    setSubmitting(true);
    setSubmittingPhase(editing ? 'Updating Project...' : 'Creating Project...');

    const toastId = toast.loading(editing ? 'Updating project...' : 'Creating project...');
    let savedProject = null;

    try {
      const payload = {
        name: formData.name,
        slug:
          formData.slug ||
          formData.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, ''),
        type: formData.type,
        status: formData.status,
        description: formData.description,
        location: {
          ...(typeof editing?.location === 'object' && editing.location !== null
            ? editing.location
            : {}),
          address: formData.location || '',
          city: formData.city || '',
          state: formData.state || '',
        },
        pricePerSqft: formData.pricePerSqft ? Number(formData.pricePerSqft) : undefined,
        totalPlots: formData.totalPlots ? Number(formData.totalPlots) : undefined,
        totalArea: formData.totalArea ? Number(formData.totalArea) : undefined,
        possessionDate: formData.possessionDate || undefined,
        reraNumber: formData.reraNumber ? formData.reraNumber.trim() : '',
        layoutImage: formData.layoutImage || '',
        amenities: formData.amenities ? formData.amenities.split(',').map((a) => a.trim()) : [],
        highlights: formData.highlights ? formData.highlights.split(',').map((h) => h.trim()) : [],
        featured: !!formData.featured,
      };

      if (editing) {
        const { data: res } = await updateProject(editing._id, payload);
        savedProject = res?.data;
      } else {
        const { data: res } = await createProject(payload);
        savedProject = res?.data;
      }

      if (selectedFiles.length > 0 && savedProject?._id) {
        setSubmittingPhase('Uploading Images...');
        toast.loading('Uploading project images...', { id: toastId });

        const uploadData = new FormData();
        selectedFiles.forEach((file) => {
          uploadData.append('images', file);
        });

        try {
          await uploadProjectImages(savedProject._id, uploadData);
        } catch (uploadErr) {
          if (!editing && savedProject._id) {
            try {
              await deleteProject(savedProject._id);
            } catch {}
          }
          const uploadMsg =
            uploadErr?.response?.data?.message ||
            'Image upload failed. Project creation rolled back.';
          toast.error(uploadMsg, { id: toastId });
          setSubmitting(false);
          setSubmittingPhase('');
          return;
        }
      }

      toast.success(editing ? 'Project updated successfully' : 'Project created successfully', {
        id: toastId,
      });
      setShowModal(false);
      setSelectedFiles([]);
      fetchProjects();
    } catch (err) {
      const errMsg = err?.response?.data?.message || 'Operation failed. Please check form inputs.';
      toast.error(errMsg, { id: toastId });
    } finally {
      setSubmitting(false);
      setSubmittingPhase('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      toast.success('Project deleted');
      fetchProjects();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      {/* Header */}
      <ProjectsHeader openCreate={openCreate} />

      {error ? (
        <ErrorMessage message={error} onRetry={() => fetchProjects()} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-slate-400 text-xs sm:text-sm font-medium">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center text-2xl mx-auto mb-3">
                <LuBuilding2 />
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mb-4">
                No projects yet. Add your first project.
              </p>
              <button
                type="button"
                onClick={openCreate}
                className="cta-btn inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl border-0 shadow-md no-underline cursor-pointer"
              >
                <LuPlus className="text-sm" /> Add Project
              </button>
            </div>
          ) : (
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['#', 'Name', 'Type', 'Location', 'Plots', 'Status', 'Featured', 'Actions'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((r, i) => {
                  const badgeStyle =
                    statusStyle[r.status] || 'bg-green-50 text-green-800 border-green-200';
                  return (
                    <tr key={r._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 text-xs font-bold text-slate-500 align-middle">
                        {(page - 1) * 10 + i + 1}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-bold text-slate-900 align-middle">
                        {r.name}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 font-medium capitalize align-middle">
                        {r.type?.replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 font-medium align-middle">
                        {r.location?.city || r.location?.address || '-'}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-bold text-slate-800 align-middle">
                        {r.totalPlots || r.plots?.length || 0}
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-md border capitalize ${badgeStyle}`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await updateProject(r._id, { featured: !r.featured });
                              toast.success(
                                r.featured ? 'Removed from featured' : 'Marked as featured'
                              );
                              fetchProjects();
                            } catch (err) {
                              toast.error('Failed to update featured status');
                            }
                          }}
                          className={`bg-transparent border-0 cursor-pointer text-lg outline-none p-1 transition-colors ${
                            r.featured
                              ? 'text-amber-500'
                              : 'text-slate-300 hover:text-amber-400'
                          }`}
                          title={r.featured ? 'Remove from featured' : 'Mark as featured'}
                        >
                          ★
                        </button>
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(r)}
                            className="px-3 py-1.5 rounded-lg border border-green-200 bg-green-50/50 hover:bg-green-50 text-green-800 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(r._id)}
                            className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-slate-100">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    p === page
                      ? 'bg-green-700 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <ProjectFormModal
        showModal={showModal}
        setShowModal={setShowModal}
        editing={editing}
        submitting={submitting}
        submittingPhase={submittingPhase}
        onSubmit={onSubmit}
        register={register}
        handleSubmitForm={handleSubmit}
        errors={errors}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        imageValidationError={imageValidationError}
        setImageValidationError={setImageValidationError}
        updateProject={updateProject}
        fetchProjects={fetchProjects}
        setEditing={setEditing}
      />
    </div>
  );
}
