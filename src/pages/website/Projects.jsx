import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjects } from '../../api/projects';
import { FaSearch, FaMapMarkerAlt, FaArrowRight, FaTimes } from 'react-icons/fa';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

const statusFilters = ['all', 'available', 'reserved', 'sold'];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      const { data } = await getProjects(params);
      setProjects(data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const statusColors = { available: 'bg-green-100 text-green-700', reserved: 'bg-yellow-100 text-yellow-700', sold: 'bg-red-100 text-red-700' };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-orange-600 to-amber-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Our Projects</h1>
            <p className="text-orange-100 text-lg">Discover premium plots across prime locations</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects by name or location..."
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {statusFilters.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${statusFilter === s ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </form>
        </motion.div>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchProjects} />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects found"
            description={search ? 'Try a different search term or filter.' : 'No projects are available at the moment.'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
            {projects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={project.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600'}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[project.status] || 'bg-slate-100 text-slate-600'}`}>
                    {project.status}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{project.name}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mb-3"><FaMapMarkerAlt /> {project.location}</p>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{project.description || 'Premium residential plots with all modern amenities and clear titles.'}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Starting from</span>
                      <p className="text-orange-600 font-bold text-lg">{project.price || 'Contact for price'}</p>
                    </div>
                    <Link to={`/projects/${project.slug}`} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1">
                      View <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
