import { useState, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { getPlots } from '../../api/plots';

import ComparisonHeader from '../../components/property-comparison/ComparisonHeader';
import PropertySelector from '../../components/property-comparison/PropertySelector';
import ComparisonTable from '../../components/property-comparison/ComparisonTable';
import ComparisonFeedback from '../../components/property-comparison/ComparisonFeedback';

export default function PropertyComparison() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  const uniqueProjects = Array.from(new Set(properties.map((p) => p.project))).filter(Boolean);

  const filtered = properties.filter((p) => {
    const matchesProject = !projectFilter || p.project === projectFilter;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.facing.toLowerCase().includes(searchQuery.toLowerCase());
    const isNotSelected = !selected.find((s) => s.id === p.id);
    return matchesProject && matchesSearch && isNotSelected;
  });

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        setLoading(true);
        const response = await getPlots({ limit: 100 });
        const plotsList = response.data?.data || [];
        
        const mappedProperties = plotsList.map((plot) => ({
          id: plot._id,
          name: `Plot ${plot.plotNumber}`,
          project: plot.project?.name || 'N/A',
          location: [
            plot.project?.location?.city,
            plot.project?.location?.state
          ].filter(Boolean).join(', ') || plot.project?.location?.address || 'Bhubaneswar',
          size: plot.size || 0,
          price: plot.price || 0,
          facing: plot.facing || 'N/A',
          road: plot.roadWidth || 0,
          status: plot.status || 'available'
        }));
        
        setProperties(mappedProperties);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties for comparison. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlots();
  }, []);

  const addProperty = (prop) => {
    if (selected.length < 4 && !selected.find((s) => s.id === prop.id)) {
      setSelected([...selected, prop]);
    }
  };

  const removeProperty = (id) => {
    setSelected(selected.filter((s) => s.id !== id));
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      
      {/* ===== PAGE HEADER ===== */}
      <ComparisonHeader />

      {/* ===== MAIN CONTENT WRAPPER ===== */}
      <div className="max-w-6xl mx-auto px-6 -mt-7 relative z-10">
        
        {loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xl">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-400">Fetching live property listings...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16 bg-white rounded-2xl border border-red-200 shadow-xl px-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <FaTimes className="text-lg" />
            </div>
            <h3 className="text-base font-bold text-red-600 mb-1 font-poppins">Error Loading Properties</h3>
            <p className="text-xs text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-xl px-4">
            <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <FaPlus className="text-xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 font-poppins">
              No Properties Available
            </h3>
            <p className="text-sm text-slate-400">
              There are currently no active properties or plots available for comparison.
            </p>
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <>
            {/* Selection Controller Card */}
            <PropertySelector
              selected={selected}
              removeProperty={removeProperty}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              projectFilter={projectFilter}
              setProjectFilter={setProjectFilter}
              uniqueProjects={uniqueProjects}
              filtered={filtered}
              addProperty={addProperty}
            />

            {/* Side-by-side Table Comparison Board */}
            <ComparisonTable selected={selected} />

            {/* Dynamic Fallback views if less than 2 properties selected */}
            <ComparisonFeedback selectedCount={selected.length} />
          </>
        )}

      </div>
    </div>
  );
}
