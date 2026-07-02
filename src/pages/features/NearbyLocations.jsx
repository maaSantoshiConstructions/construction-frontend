import { useState } from 'react';
import { motion } from 'framer-motion';
import React from 'react';
import { FaSchool, FaHospital, FaShoppingCart, FaBus, FaPlane, FaTrain, FaChurch, FaMapMarkerAlt } from 'react-icons/fa';

const categories = [
  { id: 'schools', icon: FaSchool, label: 'Schools', color: 'text-orange-600' },
  { id: 'hospitals', icon: FaHospital, label: 'Hospitals', color: 'text-red-600' },
  { id: 'shopping', icon: FaShoppingCart, label: 'Shopping', color: 'text-amber-600' },
  { id: 'transport', icon: FaBus, label: 'Transport', color: 'text-emerald-600' },
  { id: 'airport', icon: FaPlane, label: 'Airport', color: 'text-amber-600' },
  { id: 'railway', icon: FaTrain, label: 'Railway', color: 'text-cyan-600' },
  { id: 'temples', icon: FaChurch, label: 'Temples', color: 'text-orange-600' },
];

const nearbyData = {
  schools: [
    { name: 'DAV Public School', distance: '1.2 km', time: '4 min drive' },
    { name: 'St. Xavier\'s School', distance: '2.5 km', time: '8 min drive' },
    { name: 'KIIT International School', distance: '3.8 km', time: '10 min drive' },
    { name: 'Delhi Public School', distance: '4.2 km', time: '12 min drive' },
  ],
  hospitals: [
    { name: 'Apollo Hospital', distance: '2.8 km', time: '7 min drive' },
    { name: 'Kalinga Hospital', distance: '3.5 km', time: '9 min drive' },
    { name: 'SUM Hospital', distance: '4.0 km', time: '11 min drive' },
    { name: 'Care Hospital', distance: '5.2 km', time: '14 min drive' },
  ],
  shopping: [
    { name: 'Esplanade Mall', distance: '3.0 km', time: '8 min drive' },
    { name: 'Big Bazaar', distance: '1.8 km', time: '5 min drive' },
    { name: 'Reliance Mart', distance: '2.2 km', time: '6 min drive' },
    { name: 'Local Market', distance: '0.5 km', time: '2 min walk' },
  ],
  transport: [
    { name: 'Bus Stop (Patia)', distance: '0.3 km', time: '3 min walk' },
    { name: 'Auto Stand', distance: '0.5 km', time: '5 min walk' },
    { name: 'Cab Pickup Point', distance: '0.8 km', time: '2 min drive' },
  ],
  airport: [
    { name: 'Bhubaneswar International Airport', distance: '8.5 km', time: '18 min drive' },
  ],
  railway: [
    { name: 'Bhubaneswar Railway Station', distance: '12 km', time: '25 min drive' },
  ],
  temples: [
    { name: 'Lingaraj Temple', distance: '10 km', time: '22 min drive' },
    { name: 'ISKCON Temple', distance: '6.5 km', time: '15 min drive' },
    { name: 'Shiva Temple (Local)', distance: '0.8 km', time: '3 min drive' },
  ],
};

export default function NearbyLocations() {
  const [active, setActive] = useState('schools');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-teal-700 to-cyan-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FaMapMarkerAlt className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Nearby Location Explorer</h1>
            <p className="text-cyan-100">Discover what's around Santoshi Enclave, Patia</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-6 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  active === cat.id ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <cat.icon className={active === cat.id ? 'text-white' : cat.color} />
                {cat.label}
              </button>
            ))}
          </div>

          <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <h3 className="text-lg font-bold text-slate-800 capitalize mb-4 flex items-center gap-2">
              {categories.find((c) => c.id === active)?.icon && React.createElement(categories.find((c) => c.id === active).icon, { className: 'text-orange-600' })}
              {categories.find((c) => c.id === active)?.label}
            </h3>
            {nearbyData[active].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-orange-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <FaMapMarkerAlt className="text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.distance}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{item.time}</span>
              </div>
            ))}
          </motion.div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
            <strong>Commute Times from Santoshi Enclave:</strong>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-white rounded-lg p-2 text-center"><span className="font-semibold">15 min</span><p className="text-[10px] text-amber-600">To Airport</p></div>
              <div className="bg-white rounded-lg p-2 text-center"><span className="font-semibold">25 min</span><p className="text-[10px] text-amber-600">To Railway Station</p></div>
              <div className="bg-white rounded-lg p-2 text-center"><span className="font-semibold">5 min</span><p className="text-[10px] text-amber-600">To NH-16 Highway</p></div>
              <div className="bg-white rounded-lg p-2 text-center"><span className="font-semibold">20 min</span><p className="text-[10px] text-amber-600">To City Center</p></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
