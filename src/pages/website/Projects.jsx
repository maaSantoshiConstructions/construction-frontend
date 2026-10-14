import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { LuSearch, LuArrowRight, LuMapPin } from 'react-icons/lu';
import { getProjects } from '../../api/projects';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import config, { getAssetUrl } from '../../config';

const statusFilters = ['all', 'upcoming', 'ongoing', 'completed'];
const typeFilters = ['all', 'plotted_development', 'villas', 'apartments'];

const statusStyle = {
  upcoming: 'bg-amber-50 text-amber-700 border-amber-200',
  ongoing: 'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.type = typeFilter;
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
  }, [statusFilter, typeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="bg-[#f5f9f3] min-h-screen pb-24">
      {/* ===== HEADER ===== */}
      <div className="relative overflow-hidden text-center py-14 sm:py-16 px-4 bg-gradient-to-r from-[#0d1f0d] via-[#1a3a1a] to-[#162b16]">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-green-500/10 pointer-events-none" />
        <div className="wrap max-w-4xl mx-auto">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-amber-400 text-xs font-bold tracking-wider uppercase mb-3">
            PREMIUM PROPERTIES
          </span>
          <h1 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl md:text-5xl font-extrabold text-white my-3">
            Our Projects
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Discover premium residential plots, luxury villas, and apartments across prime locations in Odisha.
          </p>
        </div>
      </div>

      {/* ===== SEARCH & FILTER BAR ===== */}
      <div className="wrap max-w-6xl mx-auto px-4 sm:px-6 -mt-7 relative z-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5 sm:p-7 mb-10">
          <form onSubmit={handleSearch} className="flex flex-col gap-5">
            <div className="flex items-center gap-3 flex-col sm:flex-row">
              <div className="relative flex-1 w-full">
                <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects by name, city, location..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 outline-none bg-white transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/10"
                />
              </div>
              <button
                type="submit"
                className="cta-btn w-full sm:w-auto px-7 py-3 text-xs font-bold rounded-xl border-0 shadow-md no-underline cursor-pointer"
              >
                Search
              </button>
            </div>

            <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-100">
              {/* Status Filter */}
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Project Status
                </span>
                <div className="flex gap-2 flex-wrap">
                  {statusFilters.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatusFilter(s)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border-0 cursor-pointer ${
                        statusFilter === s
                          ? 'bg-green-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Property Type
                </span>
                <div className="flex gap-2 flex-wrap">
                  {typeFilters.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTypeFilter(t)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border-0 cursor-pointer ${
                        typeFilter === t
                          ? 'bg-green-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {t === 'all'
                        ? 'All'
                        : t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* ===== PROJECTS GRID ===== */}
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchProjects} />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects found"
            description={
              search
                ? 'Try checking your search query or filters.'
                : 'We are launching new properties soon.'
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const bStyle =
                statusStyle[project.status] || 'bg-green-50 text-green-700 border-green-200';
              return (
                <div
                  key={project._id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
                >
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={
                        getAssetUrl(project.image || (project.images && project.images[0])) ||
                        config.fallbackImageUrl
                      }
                      alt={project.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {project.status && (
                      <span
                        className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border shadow-xs ${bStyle}`}
                      >
                        {project.status}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-['Poppins',sans-serif] text-base font-bold text-slate-900 group-hover:text-green-700 transition-colors">
                      {project.name}
                    </h3>
                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                      <LuMapPin className="text-slate-400 text-xs shrink-0" />
                      <span className="truncate">
                        {typeof project.location === 'object' && project.location !== null
                          ? [project.location.address, project.location.city, project.location.state]
                              .filter(Boolean)
                              .join(', ') || '-'
                          : project.location || '-'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2.5 mb-4 line-clamp-2 leading-relaxed flex-1">
                      {project.description ||
                        'Premium real estate development with smart features, green parks, security, and electricity connectivity.'}
                    </p>
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center mt-auto">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Starting From
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-amber-600 font-['Poppins',sans-serif]">
                          {project.pricePerSqft
                            ? `₹${project.pricePerSqft}/Sq.ft`
                            : 'Contact for Price'}
                        </div>
                      </div>
                      <RouterLink
                        to={`/projects/${project.slug}`}
                        className="cta-btn inline-flex items-center gap-1 text-xs font-bold no-underline"
                      >
                        <span>View Project</span>
                        <LuArrowRight className="text-xs" />
                      </RouterLink>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
