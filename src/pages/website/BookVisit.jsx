import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createSiteVisit } from '../../api/siteVisits';
import { getProjects } from '../../api/projects';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCheckCircle, FaWhatsapp } from 'react-icons/fa';

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
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [visitDetails, setVisitDetails] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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
      const visitData = {
        ...data,
        date: new Date(data.date).toISOString(),
      };
      await createSiteVisit(visitData);
      setVisitDetails(data);
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Visit Booked!</h2>
          <p className="text-slate-500 mb-6">Your site visit has been scheduled successfully.</p>
          <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left text-sm space-y-2">
            <p><span className="text-slate-400">Date:</span> <span className="font-medium text-slate-700">{new Date(visitDetails.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
            <p><span className="text-slate-400">Time:</span> <span className="font-medium text-slate-700">{visitDetails.timeSlot}</span></p>
            <p><span className="text-slate-400">Pickup:</span> <span className="font-medium text-slate-700">{visitDetails.pickupLocation}</span></p>
          </div>
          <p className="text-sm text-slate-500 mb-4">Share this with our team on WhatsApp for confirmation:</p>
          <a
            href={`https://wa.me/919876543210?text=Hi! I have booked a site visit on ${visitDetails.date} at ${visitDetails.timeSlot}. Please confirm.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-full transition-colors"
          >
            <FaWhatsapp className="text-lg" /> Confirm via WhatsApp
          </a>
          <button
            onClick={() => { setSuccess(false); setVisitDetails(null); }}
            className="block mt-4 mx-auto text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Book Another Visit
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-orange-600 to-amber-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Book a Site Visit</h1>
            <p className="text-orange-100">Schedule a visit to explore your dream plot in person</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Schedule Your Visit</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Project</label>
              <select
                {...register('project', { required: 'Please select a project' })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
              >
                <option value="">Choose a project</option>
                {projects.map((p) => <option key={p._id} value={p.name}>{p.name}</option>)}
              </select>
              {errors.project && <p className="text-red-500 text-xs mt-1">{errors.project.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="date"
                    min={getMinDate()}
                    {...register('date', { required: 'Please select a date' })}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                  />
                </div>
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time Slot</label>
                <div className="relative">
                  <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm z-10" />
                  <select
                    {...register('timeSlot', { required: 'Please select a time' })}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm appearance-none bg-white"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                </div>
                {errors.timeSlot && <p className="text-red-500 text-xs mt-1">{errors.timeSlot.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pickup Location</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  {...register('pickupLocation', { required: 'Pickup location is required' })}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                  placeholder="Enter your pickup address"
                />
              </div>
              {errors.pickupLocation && <p className="text-red-500 text-xs mt-1">{errors.pickupLocation.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Booking...' : 'Book Site Visit'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
