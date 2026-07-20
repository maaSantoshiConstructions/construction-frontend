import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createSiteVisit } from '../../api/siteVisits';
import { getProjects } from '../../api/projects';
import { useAuth } from '../../context/AuthContext';

// Import modular subcomponents
import BookVisitSuccess from '../../components/book-visit/BookVisitSuccess';
import BookVisitForm from '../../components/book-visit/BookVisitForm';

const timeSlots = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
];

export default function BookVisit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [visitDetails, setVisitDetails] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!user) {
      toast.error('Please log in to schedule a site visit.');
      navigate('/login?redirect=/book-visit');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await getProjects({ limit: 50 });
        setProjects(data?.data || []);
      } catch {
        setProjects([
          { _id: '1', name: 'Green Valley Estate', slug: 'green-valley-estate' },
          { _id: '2', name: 'Lakeview Residency', slug: 'lakeview-residency' },
          { _id: '3', name: 'Golden Palm Enclave', slug: 'golden-palm-enclave' },
        ]);
      }
    };
    fetchProjects();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const selectedProj = projects.find(p => p._id === data.project);
      const visitData = {
        project: data.project,
        preferredDate: new Date(data.date).toISOString(),
        preferredTime: data.timeSlot,
        pickupLocation: data.visitType === 'vr' ? undefined : data.pickupLocation,
        visitType: data.visitType || 'physical',
      };
      await createSiteVisit(visitData);
      setVisitDetails({
        ...data,
        projectName: selectedProj ? selectedProj.name : 'Selected Project',
      });
      setSuccess(true);
      toast.success('Site visit booked successfully!');
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to book visit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (success && visitDetails) {
    return (
      <BookVisitSuccess
        visitDetails={visitDetails}
        setSuccess={setSuccess}
        setVisitDetails={setVisitDetails}
      />
    );
  }

  return (
    <BookVisitForm
      projects={projects}
      timeSlots={timeSlots}
      getMinDate={getMinDate}
      register={register}
      watch={watch}
      handleSubmitForm={handleSubmit}
      errors={errors}
      onSubmit={onSubmit}
      loading={loading}
    />
  );
}
