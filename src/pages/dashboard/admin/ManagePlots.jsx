import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { getPlots, createPlot, updatePlot, deletePlot } from '../../../api/plots';
import { getProjects } from '../../../api/projects';
import ErrorMessage from '../../../components/common/ErrorMessage';

// Import refactored modular subcomponents
import PlotsHeader from '../../../components/manage-plots/PlotsHeader';
import PlotsStats from '../../../components/manage-plots/PlotsStats';
import PlotsFilters from '../../../components/manage-plots/PlotsFilters';
import PlotsTable from '../../../components/manage-plots/PlotsTable';
import PlotFormModal from '../../../components/manage-plots/PlotFormModal';

const facings = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];

export default function ManagePlots() {
  const [plots, setPlots] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({ project: '', status: '', facing: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, available: 0, reserved: 0, sold: 0, blocked: 0 });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchPlots = useCallback(async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: p, limit: 10 };
      if (filters.project) params.project = filters.project;
      if (filters.status) params.status = filters.status;
      if (filters.facing) params.facing = filters.facing;
      if (searchTerm) params.search = searchTerm;
      const { data: res } = await getPlots(params);
      setPlots(res?.data || []);
      setTotalPages(res?.totalPages || 1);
      if (res?.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load plots');
    } finally {
      setLoading(false);
    }
  }, [page, filters, searchTerm]);

  const fetchProjectsList = async () => {
    try {
      const { data: res } = await getProjects({ limit: 100 });
      setProjects(res?.data || []);
    } catch { }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPlots();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchPlots]);

  useEffect(() => {
    fetchProjectsList();
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ plotNumber: '', project: '', size: '', length: '', width: '', facing: 'North', roadWidth: '', price: '', corner: false, coordinates: '', status: 'available' });
    setShowModal(true);
  };

  const openEdit = (plot) => {
    setEditing(plot);
    reset({
      plotNumber: plot.plotNumber || '',
      project: plot.project?._id || plot.project || '',
      size: plot.size || '',
      length: plot.length || '',
      width: plot.width || '',
      facing: plot.facing || 'North',
      roadWidth: plot.roadWidth || '',
      price: plot.price || '',
      corner: plot.corner || false,
      coordinates: plot.coordinates ? `${plot.coordinates.lat || ''},${plot.coordinates.lng || ''}` : '',
      status: plot.status || 'available',
    });
    setShowModal(true);
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const coords = formData.coordinates ? formData.coordinates.split(',').map(c => parseFloat(c.trim())) : [];
      const payload = {
        ...formData,
        size: formData.size ? parseFloat(formData.size) : undefined,
        length: formData.length ? parseFloat(formData.length) : undefined,
        width: formData.width ? parseFloat(formData.width) : undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        roadWidth: formData.roadWidth ? parseFloat(formData.roadWidth) : undefined,
        corner: Boolean(formData.corner),
        coordinates: coords.length === 2 ? { lat: coords[0], lng: coords[1] } : undefined,
      };
      if (editing) {
        await updatePlot(editing._id, payload);
        toast.success('Plot updated successfully');
      } else {
        await createPlot(payload);
        toast.success('Plot created successfully');
      }
      setShowModal(false);
      fetchPlots();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plot?')) return;
    try {
      await deletePlot(id);
      toast.success('Plot deleted');
      fetchPlots();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-7">
      {/* ─── Page Header ─── */}
      <PlotsHeader openCreate={openCreate} />

      {/* ─── Stats Cards ─── */}
      <PlotsStats stats={stats} />

      {/* ─── Search & Filters Bar ─── */}
      <PlotsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        projects={projects}
        facings={facings}
        setPage={setPage}
      />

      {/* ─── Table / Error ─── */}
      {error ? <ErrorMessage message={error} onRetry={() => fetchPlots()} /> : (
        <PlotsTable
          plots={plots}
          loading={loading}
          openEdit={openEdit}
          handleDelete={handleDelete}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* ─── Add / Edit Plot Modal ─── */}
      <PlotFormModal
        showModal={showModal}
        setShowModal={setShowModal}
        editing={editing}
        submitting={submitting}
        onSubmit={onSubmit}
        projects={projects}
        facings={facings}
        register={register}
        handleSubmitForm={handleSubmit}
        errors={errors}
      />
    </div>
  );
}
