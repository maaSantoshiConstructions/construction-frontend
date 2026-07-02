import { motion } from 'framer-motion';
import { FaPlay, FaVrCardboard, FaCamera, FaStreetView, FaMobileAlt } from 'react-icons/fa';

export default function VirtualSiteTour() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 via-orange-900 to-amber-900 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FaVrCardboard className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">360° Virtual Site Visit</h1>
            <p className="text-orange-200">Experience the site from anywhere, anytime</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-6 pb-16 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="relative aspect-video bg-slate-800 flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <img
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80"
              alt="Virtual Tour"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <FaPlay className="text-orange-600 text-3xl ml-1" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-lg font-bold">Santoshi Enclave - Full Project Tour</p>
              <p className="text-sm text-white/70">2:34 min • Drone + Walkthrough</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: FaCamera, title: 'Drone Overview', desc: 'Aerial view of the entire township, surrounding infrastructure and connectivity.' },
            { icon: FaStreetView, title: 'Street View', desc: 'Walk through the roads, see the landscaping, approach roads and neighborhood.' },
            { icon: FaMobileAlt, title: 'Mobile Ready', desc: 'Experience the tour on any device. No app installation required.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100"
            >
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                <item.icon className="text-orange-600 text-xl" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Project Photo Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400',
              'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400',
              'https://images.unsplash.com/photo-1600585154340-be6161a56b08?w=400',
              'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400',
              'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
              'https://images.unsplash.com/photo-1600566753086-00f18f6b7d0a?w=400',
              'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400',
              'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400',
            ].map((img, i) => (
              <div key={i} className="aspect-video rounded-xl overflow-hidden">
                <img src={img} alt={`Project ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
