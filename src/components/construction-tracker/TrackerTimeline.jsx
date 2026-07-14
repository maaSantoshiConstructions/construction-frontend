import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHardHat, FaCalendarAlt, FaImage, FaChevronDown, FaChevronUp,
  FaCheckCircle, FaBuilding, FaHome,
} from 'react-icons/fa';

export default function TrackerTimeline({
  filteredUpdates,
  groupedByProject,
  stages,
  stageMap,
  expandedUpdate,
  setExpandedUpdate,
  isMobile,
}) {
  if (filteredUpdates.length === 0) {
    return (
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '80px 24px', textAlign: 'center' }}>
        <FaHardHat style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px' }} />
        <p style={{ fontSize: '16px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>No construction updates found</p>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>Check back later for progress reports.</p>
      </div>
    );
  }

  return (
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
              <div style={{ display: 'flex', alignItems: 'center', justify_content: 'space-between' }}>
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
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: hasUpdate ? s.color : '#e5e7eb', display: 'flex', alignItems: 'center', justify_content: 'center', color: '#fff', fontSize: '10px', flexShrink: 0 }}>
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
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: stageInfo.color + '18', display: 'flex', alignItems: 'center', justify_content: 'center', color: stageInfo.color, fontSize: '14px' }}>
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
                                <div style={{ display: 'flex', justify_content: 'space-between', alignItems: 'flex-start' }}>
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
  );
}
