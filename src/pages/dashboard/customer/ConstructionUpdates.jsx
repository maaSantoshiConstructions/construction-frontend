import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuHardHat, LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { getMyPlotUpdates } from '../../../api/constructionUpdates';
import ErrorMessage from '../../../components/common/ErrorMessage';

const stageBadgeStyle = {
  planning: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  foundation: 'bg-amber-50 text-amber-700 border-amber-200',
  structure: 'bg-purple-50 text-purple-700 border-purple-200',
  roofing: 'bg-pink-50 text-pink-700 border-pink-200',
  finishing: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const stageDotStyle = {
  planning: 'bg-indigo-600',
  foundation: 'bg-amber-500',
  structure: 'bg-purple-600',
  roofing: 'bg-pink-600',
  finishing: 'bg-emerald-600',
  completed: 'bg-emerald-600',
};

export default function ConstructionUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const fetchUpdates = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getMyPlotUpdates();
      const items = res?.data || res || [];
      setUpdates(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const groupedByProject = updates.reduce((acc, u) => {
    const key = u.project?.name || u.projectName || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(u);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
            <div className="h-6 w-48 bg-slate-200 rounded mb-3" />
            <div className="h-4 w-full bg-slate-100 rounded mb-2" />
            <div className="h-4 w-3/4 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) return <ErrorMessage message={error} onRetry={fetchUpdates} />;

  if (updates.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900">
            Construction Updates
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Track the progress of your property construction
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-3xl mx-auto mb-3">
            <LuHardHat />
          </div>
          <p className="text-slate-700 font-bold text-sm">No updates yet</p>
          <p className="text-slate-400 text-xs mt-1">
            Updates will appear here once construction begins
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900">
          Construction Updates
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Track the progress of your property construction
        </p>
      </div>

      {Object.entries(groupedByProject).map(([projectName, projectUpdates]) => {
        const avgProgress =
          projectUpdates.length > 0
            ? Math.round(
                projectUpdates.reduce((sum, u) => sum + (u.progressPercent || 0), 0) /
                  projectUpdates.length
              )
            : 0;

        return (
          <div key={projectName} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Poppins',sans-serif] text-base sm:text-lg font-bold text-slate-900">
                {projectName}
              </h2>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                {avgProgress}% Complete
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6 overflow-hidden">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${avgProgress}%` }}
              />
            </div>

            <div className="relative">
              {projectUpdates.map((u, i) => {
                const bStyle =
                  stageBadgeStyle[u.stage] || 'bg-indigo-50 text-indigo-700 border-indigo-200';
                const dStyle = stageDotStyle[u.stage] || 'bg-indigo-600';

                return (
                  <motion.div
                    key={u._id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative pl-8 pb-6 last:pb-0"
                  >
                    <div
                      className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${dStyle}`}
                    />
                    {i < projectUpdates.length - 1 && (
                      <div className="absolute left-[6px] top-4 bottom-0 w-0.5 bg-slate-200" />
                    )}

                    <div
                      className="bg-slate-50 rounded-xl p-4 cursor-pointer hover:bg-slate-100/80 transition-colors border border-slate-200/60"
                      onClick={() => setExpanded(expanded === u._id ? null : u._id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">
                            {u.title || 'Progress Update'}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {u.stage && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border capitalize ${bStyle}`}
                              >
                                {u.stage}
                              </span>
                            )}
                            <span className="text-[11px] font-semibold text-slate-500">
                              {u.progressPercent || 0}%
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(u.createdAt || u.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {expanded === u._id ? (
                            <LuChevronUp className="text-slate-400 text-base" />
                          ) : (
                            <LuChevronDown className="text-slate-400 text-base" />
                          )}
                        </div>
                      </div>

                      {u.description && (
                        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                          {u.description}
                        </p>
                      )}

                      {expanded === u._id && u.engineerReport && (
                        <div className="mt-3 pt-3 border-t border-slate-200/80">
                          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100">
                            <p className="text-xs font-bold text-blue-800 mb-1">
                              Engineer Report
                            </p>
                            <p className="text-xs text-blue-700 leading-relaxed">
                              {u.engineerReport}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
