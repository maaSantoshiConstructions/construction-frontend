import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProject } from '../../api/projects';
import { FaMapMarkerAlt, FaCheck, FaTimes, FaArrowRight, FaPhone, FaCalendarAlt, FaShareAlt, FaBed, FaBath, FaCar, FaTree, FaShieldAlt, FaWifi } from 'react-icons/fa';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const amenitiesList = [
  { icon: FaTree, label: 'Landscaped Gardens' },
  { icon: FaCar, label: 'Car Parking' },
  { icon: FaShieldAlt, label: '24/7 Security' },
  { icon: FaWifi, label: 'Wi-Fi Connectivity' },
  { icon: FaBed, label: 'Club House' },
  { icon: FaBath, label: 'Modern Sanitation' },
];

export default function ProjectDetails() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getProject(slug);
      setProject(data?.data || data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [slug]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProject} />;
  if (!project) return <ErrorMessage message="Project not found" />;

  const images = project.images?.length > 0 ? project.images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200'];
  const plotSummary = project.plotSummary || { total: 120, available: 45, reserved: 30, sold: 45 };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="text-sm text-slate-500 mb-4">
            <Link to="/projects" className="hover:text-orange-600">Projects</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800 font-medium">{project.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 mb-3">
                <img src={images[selectedImage]} alt={project.name} className="w-full h-full object-cover" />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-orange-600' : 'border-transparent'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize mb-3 ${project.status === 'available' ? 'bg-green-100 text-green-700' : project.status === 'reserved' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {project.status}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">{project.name}</h1>
              <p className="text-slate-500 flex items-center gap-1 mb-4"><FaMapMarkerAlt /> {project.location}</p>
              <p className="text-slate-600 mb-6">{project.description || 'Premium residential plots with world-class amenities and excellent connectivity.'}</p>

              <div className="bg-slate-50 rounded-xl p-5 mb-6">
                <p className="text-sm text-slate-500 mb-1">Starting Price</p>
                <p className="text-3xl font-bold text-orange-600">{project.price || '₹35 Lakhs'}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <p className="text-lg font-bold text-green-600">{plotSummary.available}</p>
                  <p className="text-xs text-green-600">Available</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-xl">
                  <p className="text-lg font-bold text-yellow-600">{plotSummary.reserved}</p>
                  <p className="text-xs text-yellow-600">Reserved</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-xl">
                  <p className="text-lg font-bold text-red-600">{plotSummary.sold}</p>
                  <p className="text-xs text-red-600">Sold</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to={`/plot-map?project=${project.slug}`} className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors text-sm flex items-center gap-2">
                  <FaMapMarkerAlt /> View on Map
                </Link>
                <Link to="/book-visit" className="px-5 py-2.5 border border-orange-600 text-orange-600 hover:bg-orange-50 font-medium rounded-lg transition-colors text-sm flex items-center gap-2">
                  <FaCalendarAlt /> Book Visit
                </Link>
                <button className="px-5 py-2.5 border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium rounded-lg transition-colors text-sm flex items-center gap-2">
                  <FaShareAlt /> Share
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-3">
              {amenitiesList.map((amenity, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <amenity.icon className="text-orange-600" />
                  </div>
                  <span className="text-sm text-slate-700 font-medium">{amenity.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Location Highlights</h2>
            <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-3">
              {[
                '5 min from Metro Station',
                '2 km from Shopping Mall',
                '500 m from School',
                '3 km from Hospital',
                'Direct access to National Highway',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <FaCheck className="text-green-500 text-xs flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 bg-orange-50 rounded-xl p-5 border border-orange-100">
              <h3 className="font-semibold text-slate-800 mb-2">Interested in this project?</h3>
              <p className="text-sm text-slate-600 mb-4">Our sales team is ready to help you with more details.</p>
              <a href="tel:+919876543210" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors text-sm">
                <FaPhone /> Call +91 98765 43210
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
