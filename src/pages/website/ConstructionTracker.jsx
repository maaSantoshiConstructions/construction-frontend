import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  LuHardHat,
  LuCircleCheck,
  LuClipboardList,
  LuWrench,
  LuBuilding2,
  LuHouse,
} from 'react-icons/lu';
import { getUpdates } from '../../api/constructionUpdates';
import { getProjects } from '../../api/projects';
import Loader from '../../components/common/Loader';

// Import modular subcomponents
import TrackerHeader from '../../components/construction-tracker/TrackerHeader';
import TrackerStats from '../../components/construction-tracker/TrackerStats';
import TrackerTimeline from '../../components/construction-tracker/TrackerTimeline';

const stages = [
  { key: 'planning', label: 'Planning', icon: <LuClipboardList />, color: '#3a2fb8' },
  { key: 'foundation', label: 'Foundation', icon: <LuWrench />, color: '#d99f36' },
  { key: 'structure', label: 'Structure', icon: <LuBuilding2 />, color: '#5b4fe0' },
  { key: 'roofing', label: 'Roofing', icon: <LuHouse />, color: '#7a3fd6' },
  { key: 'finishing', label: 'Finishing', icon: <LuHardHat />, color: '#2f9e5c' },
  { key: 'completed', label: 'Completed', icon: <LuCircleCheck />, color: '#2f9e5c' },
];

const stageMap = {};
stages.forEach((s, i) => {
  stageMap[s.key] = { ...s, order: i };
});

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
    return updates.filter(
      (u) => u.project?._id === selectedProject || u.project?.slug === selectedProject
    );
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
    stages.forEach((s) => {
      stageCounts[s.key] = 0;
    });
    filteredUpdates.forEach((u) => {
      if (stageCounts[u.stage] !== undefined) stageCounts[u.stage]++;
    });
    const avgProgress = Math.round(
      filteredUpdates.reduce((sum, u) => sum + (u.progressPercent || 0), 0) /
        filteredUpdates.length
    );
    return { stageCounts, avgProgress, total: filteredUpdates.length };
  }, [filteredUpdates]);

  const currentProjectObj = useMemo(() => {
    if (!selectedProject) return null;
    return projects.find((p) => p._id === selectedProject) || null;
  }, [selectedProject, projects]);

  if (loading) return <Loader />;

  return (
    <div className="bg-[#f0f2f5] min-h-screen pb-16">
      {/* HEADER */}
      <TrackerHeader
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        projects={projects}
        setSearchParams={setSearchParams}
        isMobile={isMobile}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
        {/* OVERALL PROGRESS BAR */}
        <TrackerStats
          projectStats={projectStats}
          currentProjectObj={currentProjectObj}
          stages={stages}
          isMobile={isMobile}
        />

        {/* TIMELINE */}
        <TrackerTimeline
          filteredUpdates={filteredUpdates}
          groupedByProject={groupedByProject}
          stages={stages}
          stageMap={stageMap}
          expandedUpdate={expandedUpdate}
          setExpandedUpdate={setExpandedUpdate}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}
