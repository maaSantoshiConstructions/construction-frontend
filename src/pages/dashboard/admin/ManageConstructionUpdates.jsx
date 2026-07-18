import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { getUpdates, createUpdate, updateUpdate, deleteUpdate } from '../../../api/constructionUpdates';
import { getProjects } from '../../../api/projects';
import { getPlots } from '../../../api/plots';

import UpdatesHeader from '../../../components/manage-construction-updates/UpdatesHeader';
import UpdatesTable from '../../../components/manage-construction-updates/UpdatesTable';
import UpdateFormModal from '../../../components/manage-construction-updates/UpdateFormModal';

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
      <UpdatesHeader openCreate={openCreate} />

      <UpdatesTable
        updates={updates}
        loading={loading}
        error={error}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        openEdit={openEdit}
        handleDelete={handleDelete}
        openCreate={openCreate}
        fetchUpdates={() => fetchUpdates()}
      />

      <UpdateFormModal
        showModal={showModal}
        setShowModal={setShowModal}
        editing={editing}
        submitting={submitting}
        onSubmit={onSubmit}
        projects={projects}
        plots={plots}
        progressValue={progressValue}
        files={files}
        setFiles={setFiles}
        register={register}
        handleSubmitForm={handleSubmit}
        errors={errors}
      />
    </div>
  );
}
