import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTimes, FaArrowRight, FaMapMarkerAlt, FaCheck, FaTimesCircle } from 'react-icons/fa';

const allProperties = [
  { id: 1, name: 'Plot A-42', project: 'Santoshi Enclave Phase 1', location: 'Patia, Bhubaneswar', size: 2400, price: 5880000, facing: 'North', road: 40, status: 'available', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400' },
  { id: 2, name: 'Plot C-19', project: 'Santoshi Greens', location: 'Khandagiri, Bhubaneswar', size: 1800, price: 3510000, facing: 'South-East', road: 30, status: 'available', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56b08?w=400' },
  { id: 3, name: 'Villa B-07', project: 'Santoshi Villas', location: 'Chandrasekharpur, Bhubaneswar', size: 3200, price: 15520000, facing: 'East', road: 50, status: 'reserved', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400' },
  { id: 4, name: 'Plot B-12', project: 'Santoshi Enclave Phase 1', location: 'Patia, Bhubaneswar', size: 1500, price: 3675000, facing: 'West', road: 30, status: 'sold', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400' },
  { id: 5, name: 'Plot D-05', project: 'Santoshi Greens', location: 'Khandagiri, Bhubaneswar', size: 2100, price: 4095000, facing: 'North-East', road: 40, status: 'available', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56b08?w=400' },
  { id: 6, name: 'Villa A-03', project: 'Santoshi Villas', location: 'Chandrasekharpur, Bhubaneswar', size: 2800, price: 13580000, facing: 'North', road: 60, status: 'available', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400' },
];

const attributes = [
  { key: 'project', label: 'Project' },
  { key: 'location', label: 'Location' },
  { key: 'size', label: 'Size (sq.ft)', format: (v) => `${v} sq.ft` },
  { key: 'price', label: 'Price', format: (v) => `₹${(v / 100000).toFixed(1)} Lakh` },
  { key: 'facing', label: 'Facing' },
  { key: 'road', label: 'Road Width', format: (v) => `${v} ft` },
  { key: 'status', label: 'Status', format: (v) => v.charAt(0).toUpperCase() + v.slice(1) },
];

export default function PropertyComparison() {
  const [selected, setSelected] = useState([]);

  const addProperty = (prop) => {
    if (selected.length < 4 && !selected.find((s) => s.id === prop.id)) {
      setSelected([...selected, prop]);
    }
  };

  const removeProperty = (id) => {
    setSelected(selected.filter((s) => s.id !== id));
  };

  const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-orange-600 to-amber-700 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Property Comparison</h1>
            <p className="text-orange-100">Compare up to 4 properties side-by-side</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Select Properties to Compare ({selected.length}/4)</h2>
          {selected.length > 0 && (
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `repeat(${Math.max(selected.length, 1)}, 1fr)` }}>
              {selected.map((prop) => (
                <div key={prop.id} className="relative border border-orange-200 bg-orange-50 rounded-xl p-3">
                  <button onClick={() => removeProperty(prop.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"><FaTimes /></button>
                  <p className="font-semibold text-slate-800 text-sm">{prop.name}</p>
                  <p className="text-xs text-slate-500">{prop.project}</p>
                </div>
              ))}
            </div>
          )}

          {selected.length < 4 && (
            <div>
              <p className="text-sm text-slate-500 mb-3">Add properties to compare:</p>
              <div className="flex flex-wrap gap-2">
                {allProperties.filter((p) => !selected.find((s) => s.id === p.id)).map((prop) => (
                  <button
                    key={prop.id}
                    onClick={() => addProperty(prop)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs border border-slate-200 rounded-full hover:border-orange-300 hover:text-orange-600 transition-colors"
                  >
                    <FaPlus className="text-[10px]" /> {prop.name} - {prop.project}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {selected.length >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b">
                    <th className="text-left p-4 font-medium text-slate-500 w-40">Attribute</th>
                    {selected.map((prop) => (
                      <th key={prop.id} className="p-4 text-center font-semibold text-slate-800 min-w-[180px]">
                        {prop.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attributes.map((attr, i) => (
                    <tr key={attr.key} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                      <td className="p-4 font-medium text-slate-600">{attr.label}</td>
                      {selected.map((prop) => {
                        const values = selected.map((s) => s[attr.key]);
                        const best = attr.key === 'price' ? Math.min(...values) : attr.key === 'size' ? Math.max(...values) : null;
                        const isBest = best !== null && prop[attr.key] === best;
                        return (
                          <td key={prop.id} className={`p-4 text-center ${isBest ? 'bg-green-50' : ''}`}>
                            <span className={isBest ? 'text-green-700 font-semibold' : 'text-slate-700'}>
                              {attr.format ? attr.format(prop[attr.key]) : prop[attr.key]}
                            </span>
                            {isBest && attr.key === 'price' && <span className="block text-[10px] text-green-600 font-medium">Best Price</span>}
                            {isBest && attr.key === 'size' && <span className="block text-[10px] text-green-600 font-medium">Largest</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-400">Compare up to 4 properties to make an informed decision</p>
            </div>
          </motion.div>
        )}

        {selected.length < 2 && selected.length > 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <FaArrowRight className="text-3xl text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Add at least one more property to see comparison</p>
          </div>
        )}

        {selected.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <FaPlus className="text-4xl text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Properties Selected</h3>
            <p className="text-sm text-slate-500">Select 2-4 properties above to compare them side-by-side</p>
          </div>
        )}
      </div>
    </div>
  );
}
