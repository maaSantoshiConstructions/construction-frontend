import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHardHat, FaImage, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getMyPlotUpdates } from '../../../api/constructionUpdates';
import ErrorMessage from '../../../components/common/ErrorMessage';

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

  useEffect(() => { fetchUpdates(); }, []);

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
          <h1 className="text-2xl font-bold text-slate-800">Construction Updates</h1>
          <p className="text-slate-500 text-sm">Track the progress of your property construction</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FaHardHat className="text-slate-300 text-4xl mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No updates yet</p>
          <p className="text-slate-400 text-sm mt-1">Updates will appear here once construction begins</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Construction Updates</h1>
        <p className="text-slate-500 text-sm">Track the progress of your property construction</p>
      </div>

      {Object.entries(groupedByProject).map(([projectName, projectUpdates]) => {
        const totalStages = projectUpdates.length;
        const completedStages = projectUpdates.filter(u => u.status === 'completed').length;
        const progressPct = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

        return (
          <div key={projectName} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">{projectName}</h2>
              <span className="text-sm text-slate-500">{progressPct}% Complete</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: progressPct + '%' }}
              />
            </div>

            <div className="relative">
              {projectUpdates.map((u, i) => (
                <motion.div
                  key={u._id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative pl-8 pb-6 last:pb-0"
                >
                  <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow" />
                  {i < projectUpdates.length - 1 && (
                    <div className="absolute left-[5px] top-4 bottom-0 w-0.5 bg-blue-200" />
                  )}

                  <div
                    className="bg-slate-50 rounded-xl p-4 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => setExpanded(expanded === u._id ? null : u._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{u.title || 'Progress Update'}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{new Date(u.createdAt || u.date).toLocaleDateString()}</p>
                      </div>
                      {u.images?.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <FaImage /> {u.images.length}
                        </div>
                      )}
                    </div>

                    {u.description && (
                      <p className="text-sm text-slate-600 mt-2">{u.description}</p>
                    )}

                    {expanded === u._id && u.images?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 grid grid-cols-3 gap-2"
                      >
                        {u.images.map((img, j) => (
                          <img
                            key={j}
                            src={img}
                            alt={`Update ${i + 1} - ${j + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
