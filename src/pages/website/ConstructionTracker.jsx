import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getUpdates } from '../../api/constructionUpdates';
import { getProjects } from '../../api/projects';
import {
  FaHardHat, FaCalendarAlt, FaImage, FaChevronDown, FaChevronUp,
  FaCheckCircle, FaClipboardList, FaTools, FaBuilding, FaHome,
} from 'react-icons/fa';
import Loader from '../../components/common/Loader';

const stages = [
  { key: 'planning', label: 'Planning', icon: <FaClipboardList />, color: '#3a2fb8' },
  { key: 'foundation', label: 'Foundation', icon: <FaTools />, color: '#d99f36' },
  { key: 'structure', label: 'Structure', icon: <FaBuilding />, color: '#5b4fe0' },
  { key: 'roofing', label: 'Roofing', icon: <FaHome />, color: '#7a3fd6' },
  { key: 'finishing', label: 'Finishing', icon: <FaHardHat />, color: '#2f9e5c' },
  { key: 'completed', label: 'Completed', icon: <FaCheckCircle />, color: '#2f9e5c' },
];

const stageMap = {};
stages.forEach((s, i) => { stageMap[s.key] = { ...s, order: i }; });

export default function ConstructionTracker() {
  const [searchParams, setSearchParams] = useSearchParams();
  const projectFilter = searchParams.get('project');
  const [updates, setUpdates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('');
  const [expandedUpdate, setExpandedUpdate] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [updatesRes, projectsRes] = await Promise.all([
          getUpdates({ sort: '-date', limit: 100 }),
          getProjects({ limit: 50 }),
        ]);
        setUpdates(updatesRes?.data?.data || []);
        setProjects(projectsRes?.data?.data || []);
      } catch {
        setUpdates([]);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (projectFilter) setSelectedProject(projectFilter);
  }, [projectFilter]);

  const filteredUpdates = useMemo(() => {
    if (!selectedProject) return updates;
    return updates.filter((u) => u.project?._id === selectedProject || u.project?.slug === selectedProject);
  }, [updates, selectedProject]);

  const groupedByProject = useMemo(() => {
    const groups = {};
    filteredUpdates.forEach((u) => {
      const key = u.project?.name || 'General';
      if (!groups[key]) groups[key] = [];
      groups[key].push(u);
    });
    return Object.entries(groups);
  }, [filteredUpdates]);

  const projectStats = useMemo(() => {
    if (filteredUpdates.length === 0) return null;
    const stageCounts = {};
    stages.forEach((s) => { stageCounts[s.key] = 0; });
    filteredUpdates.forEach((u) => { if (stageCounts[u.stage] !== undefined) stageCounts[u.stage]++; });
    const avgProgress = Math.round(filteredUpdates.reduce((sum, u) => sum + (u.progressPercent || 0), 0) / filteredUpdates.length);
    return { stageCounts, avgProgress, total: filteredUpdates.length };
  }, [filteredUpdates]);

  const currentProjectObj = useMemo(() => {
    if (!selectedProject) return null;
    return projects.find((p) => p._id === selectedProject) || null;
  }, [selectedProject, projects]);

  if (loading) return <Loader />;

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '16px' : '24px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #d99f36, #b8860b)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(217,159,54,0.3)' }}>
                <FaHardHat style={{ color: '#fff', fontSize: '22px' }} />
              </div>
              <div>
                <h1 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                  Construction Tracker
                </h1>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>
                  Real-time progress across all projects
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Filter:</label>
              <select
                value={selectedProject}
                onChange={(e) => {
                  setSelectedProject(e.target.value);
                  if (e.target.value) setSearchParams({ project: e.target.value });
                  else setSearchParams({});
                }}
                style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '13px', fontWeight: 500, color: '#1e293b', background: '#fff', cursor: 'pointer', outline: 'none', fontFamily: 'Inter, sans-serif', minWidth: '180px' }}
              >
                <option value="">All Projects</option>
                {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '16px' : '24px 32px' }}>

        {/* OVERALL PROGRESS BAR */}
        {projectStats && (
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: isMobile ? '20px' : '24px 28px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                  {currentProjectObj?.name || 'Overall Progress'}
                </h3>
                {currentProjectObj?.location?.city && (
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>{currentProjectObj.location.city}, {currentProjectObj.location.state}</p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#d99f36', fontFamily: 'Poppins, sans-serif' }}>{projectStats.avgProgress}%</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>{projectStats.total} Updates</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ height: '100%', width: `${projectStats.avgProgress}%`, background: 'linear-gradient(90deg, #3a2fb8, #5b4fe0)', borderRadius: '5px', transition: 'width 0.6s ease' }} />
            </div>

            {/* Stage Indicators */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)', gap: '8px' }}>
              {stages.map((s) => {
                const count = projectStats.stageCounts[s.key] || 0;
                const active = count > 0;
                return (
                  <div key={s.key} style={{ padding: '10px 8px', borderRadius: '10px', background: active ? s.color + '10' : '#f8fafc', border: `1.5px solid ${active ? s.color + '30' : '#e5e7eb'}`, textAlign: 'center', transition: 'all 0.2s' }}>
                    <div style={{ color: active ? s.color : '#94a3b8', fontSize: '16px', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: active ? s.color : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{s.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: active ? '#0f172a' : '#cbd5e1', marginTop: '2px' }}>{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TIMELINE */}
        {filteredUpdates.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '80px 24px', textAlign: 'center' }}>
            <FaHardHat style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px' }} />
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>No construction updates found</p>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Check back later for progress reports.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {groupedByProject.map(([projectName, projectUpdates]) => {
              const sortedUpdates = [...projectUpdates].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              const latestProgress = sortedUpdates[0]?.progressPercent || 0;
              const stageOrder = {};
              stages.forEach((s, i) => { stageOrder[s.key] = i; });
              const stageGroups = {};
              sortedUpdates.forEach((u) => {
                const sk = u.stage || 'planning';
                if (!stageGroups[sk]) stageGroups[sk] = [];
                stageGroups[sk].push(u);
              });
              const sortedStages = Object.keys(stageGroups).sort((a, b) => (stageOrder[a] || 0) - (stageOrder[b] || 0));

              return (
                <div key={projectName} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>

                  {/* Project Header */}
                  <div style={{ padding: isMobile ? '16px 20px' : '20px 28px', background: 'linear-gradient(135deg, #1e293b, #334155)', color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FaHome style={{ fontSize: '18px', opacity: 0.8 }} />
                        <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>{projectName}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', opacity: 0.7 }}>{sortedUpdates.length} updates</span>
                        <div style={{ padding: '4px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', fontSize: '13px', fontWeight: 700 }}>{latestProgress}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Stage Pipeline */}
                  <div style={{ padding: '16px 28px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '4px', overflowX: 'auto' }}>
                    {stages.map((s, i) => {
                      const hasUpdate = stageGroups[s.key]?.length > 0;
                      return (
                        <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: '80px' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: hasUpdate ? s.color : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', flexShrink: 0 }}>
                            {hasUpdate ? <FaCheckCircle /> : <span style={{ fontSize: '10px', fontWeight: 700 }}>{i + 1}</span>}
                          </div>
                          {i < stages.length - 1 && (
                            <div style={{ flex: 1, height: '2px', background: hasUpdate ? s.color : '#e5e7eb', minWidth: '20px' }} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Updates Timeline */}
                  <div style={{ padding: isMobile ? '20px' : '24px 28px' }}>
                    {sortedStages.map((stageKey) => {
                      const stageInfo = stageMap[stageKey] || stages[0];
                      const stageUpdates = stageGroups[stageKey];
                      return (
                        <div key={stageKey} style={{ marginBottom: '24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: stageInfo.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stageInfo.color, fontSize: '14px' }}>
                              {stageInfo.icon}
                            </div>
                            <div>
                              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', fontFamily: 'Poppins, sans-serif' }}>{stageInfo.label}</span>
                              <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '8px' }}>{stageUpdates.length} update{stageUpdates.length > 1 ? 's' : ''}</span>
                            </div>
                          </div>

                          <div style={{ marginLeft: '16px', borderLeft: `2px solid ${stageInfo.color}30`, paddingLeft: '20px' }}>
                            {stageUpdates.map((update, ui) => {
                              const isExpanded = expandedUpdate === update._id;
                              return (
                                <motion.div
                                  key={update._id}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: ui * 0.04 }}
                                  style={{ marginBottom: ui < stageUpdates.length - 1 ? '12px' : 0 }}
                                >
                                  {/* Timeline dot */}
                                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: stageInfo.color, border: '2px solid #fff', boxShadow: `0 0 0 2px ${stageInfo.color}30`, flexShrink: 0, marginTop: '14px' }} />
                                    <div
                                      style={{ flex: 1, padding: '14px 18px', background: '#f8fafc', borderRadius: '12px', border: `1px solid ${isExpanded ? stageInfo.color + '30' : '#e5e7eb'}`, cursor: 'pointer', transition: 'all 0.2s' }}
                                      onClick={() => setExpandedUpdate(isExpanded ? null : update._id)}
                                    >
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{update.title}</span>
                                            {update.progressPercent > 0 && (
                                              <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: stageInfo.color + '15', color: stageInfo.color }}>{update.progressPercent}%</span>
                                            )}
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
                                            {update.plot?.plotNumber && (
                                              <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <FaBuilding style={{ fontSize: '9px' }} /> Plot {update.plot.plotNumber}
                                              </span>
                                            )}
                                            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                              <FaCalendarAlt style={{ fontSize: '9px' }} />
                                              {new Date(update.createdAt || update.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            {update.images?.length > 0 && (
                                              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <FaImage style={{ fontSize: '9px' }} /> {update.images.length} photo{update.images.length > 1 ? 's' : ''}
                                              </span>
                                            )}
                                            {update.engineerReport && (
                                              <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>Has Report</span>
                                            )}
                                          </div>
                                        </div>
                                        <div style={{ color: '#94a3b8', fontSize: '12px', padding: '4px', flexShrink: 0 }}>
                                          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                        </div>
                                      </div>

                                      <AnimatePresence>
                                        {isExpanded && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{ overflow: 'hidden' }}
                                          >
                                            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '12px', paddingTop: '12px' }}>
                                              {update.description && (
                                                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '12px' }}>{update.description}</p>
                                              )}

                                              {update.engineerReport && (
                                                <div style={{ padding: '12px 14px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe', marginBottom: '12px' }}>
                                                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', marginBottom: '4px' }}>Engineer Report</div>
                                                  <p style={{ fontSize: '13px', color: '#1e3a5f', lineHeight: 1.5, margin: 0 }}>{update.engineerReport}</p>
                                                </div>
                                              )}

                                              {update.images?.length > 0 && (
                                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '8px' }}>
                                                  {update.images.map((img, j) => (
                                                    <img key={j} src={img} alt={`Update ${j + 1}`}
                                                      style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
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
