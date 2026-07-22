import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProject } from '../../api/projects';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import config, { getAssetUrl } from '../../config';

// Import modular subcomponents
import ProjectBreadcrumb from '../../components/project-details/ProjectBreadcrumb';
import ProjectMainInfo from '../../components/project-details/ProjectMainInfo';
import ProjectBottomDetails from '../../components/project-details/ProjectBottomDetails';

const statusColors = {
  upcoming: { bg: '#fff2e6', text: '#d99f36' },
  ongoing: { bg: '#efeafe', text: '#5b4fe0' },
  completed: { bg: '#eefcf3', text: '#2f9e5c' },
};

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

  const images = project.images?.length > 0 
    ? project.images.map(img => getAssetUrl(img)) 
    : [config.fallbackImageUrl];
  const rera = project.reraNumber || 'Applied / Pending';

  // Format price
  const formattedPrice = project.pricePerSqft
    ? `₹${project.pricePerSqft} / Sq.ft`
    : 'Contact for Price';

  // Location string helper
  const locationStr = typeof project.location === 'object'
    ? `${project.location.address || ''}, ${project.location.city || ''}, ${project.location.state || ''}`.replace(/(^,\s*)|(,\s*$)/g, '')
    : project.location || 'Bhubaneswar, Odisha';

  const finalAmenities = project.amenities?.length > 0
    ? project.amenities
    : ['Landscaped Gardens', '24/7 Security', 'Electricity Connection', 'Water Supply', 'Concrete Roads', 'Street Lights'];

  const finalHighlights = project.highlights?.length > 0
    ? project.highlights
    : [
        'Direct access to National Highway',
        '15 minutes from nearest Railway Station',
        'Close proximity to top schools & engineering colleges',
        '5 km from upcoming IT parks & shopping centers',
        'Quiet residential area with high growth prospects',
      ];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Project link copied to clipboard!');
  };

  return (
    <div style={{ background: '#f7f7fb', minHeight: '100vh', paddingBottom: '90px' }}>
      
      {/* ===== BREADCRUMB ===== */}
      <ProjectBreadcrumb projectName={project.name} />

      {/* ===== MAIN INFO ===== */}
      <ProjectMainInfo
        project={project}
        images={images}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        statusColors={statusColors}
        locationStr={locationStr}
        formattedPrice={formattedPrice}
        rera={rera}
        handleShare={handleShare}
      />

      {/* ===== BOTTOM DETAILS ===== */}
      <ProjectBottomDetails
        project={project}
        finalAmenities={finalAmenities}
        finalHighlights={finalHighlights}
        getImageUrl={getAssetUrl}
      />

      <style>{`
        @media(max-width:991px){
          .project-detail-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </div>
  );
}
