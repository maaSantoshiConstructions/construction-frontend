import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuPlay,
  LuCamera,
  LuNavigation,
  LuSmartphone,
  LuX,
  LuArrowLeft,
  LuArrowRight,
  LuCompass,
} from 'react-icons/lu';

const hotspots = [
  {
    id: 1,
    x: '25%',
    y: '40%',
    name: 'JSM Club & Swimming Pool',
    desc: 'Premium community centre featuring an indoor games room, kids play zone, gym & lounge area.',
  },
  {
    id: 2,
    x: '52%',
    y: '55%',
    name: 'Sector A Premium Plots',
    desc: 'North and East facing residential plots, fully demarcated with 30ft blacktop approach roads.',
  },
  {
    id: 3,
    x: '78%',
    y: '35%',
    name: 'Water Reservoir Promenade',
    desc: 'Lakeside jogging tracks, seating pavilions, and beautifully landscaped green lawns.',
  },
];

export default function VirtualSiteTour() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [panOffset, setPanOffset] = useState(0); // in percent (0 to -50)
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handlePanLeft = () => {
    setPanOffset((prev) => Math.min(prev + 12.5, 0));
  };

  const handlePanRight = () => {
    setPanOffset((prev) => Math.max(prev - 12.5, -50));
  };

  return (
    <div className="bg-[#f7f7fb] min-h-screen pb-24">
      {/* Dynamic Keyframe Style */}
      <style>{`
        @keyframes hotspot-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7); }
          70% { transform: scale(1.15); box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
        }
      `}</style>

      {/* ===== PAGE HEADER ===== */}
      <div className="relative overflow-hidden text-center py-16 px-4 bg-gradient-to-r from-[#0d1f0d] via-[#1a3a1a] to-[#162b16]">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-green-500/10 pointer-events-none" />
        <div className="wrap max-w-4xl mx-auto">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-amber-400 text-xs font-bold tracking-wider uppercase mb-3">
            IMMERSIVE VISIT
          </span>
          <h1 className="font-['Poppins',sans-serif] text-white text-3xl sm:text-4xl font-extrabold mt-2 mb-3">
            360° Virtual Site Visit
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Experience our premium project layouts in immersive details from the comfort of your home.
          </p>
        </div>
      </div>

      {/* ===== CONTENT WRAPPER ===== */}
      <div className="wrap max-w-5xl mx-auto px-4 sm:px-6 -mt-7 relative z-10">
        {/* Immersive 360 Tour Panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden mb-8"
        >
          {!isPlaying ? (
            /* Poster Intro Panel */
            <div
              onClick={() => setIsPlaying(true)}
              className="relative aspect-video bg-[#0d1f0d] flex items-center justify-center cursor-pointer group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950/80 z-10" />
              <img
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80"
                alt="Virtual Tour Preview"
                className="w-full h-full object-cover opacity-75 absolute inset-0 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-20 text-center px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/95 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform">
                  <LuPlay className="text-green-700 text-2xl sm:text-3xl ml-1" />
                </div>
                <h3 className="text-lg sm:text-2xl font-extrabold text-white font-['Poppins',sans-serif] m-0">
                  Start Panoramic Site Visit
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-medium">
                  Interactive 360° drone walkthrough with project hotspots
                </p>
              </div>
            </div>
          ) : (
            /* Interactive Simulated 360 Viewer */
            <div className="relative aspect-video bg-[#090c24] overflow-hidden">
              {/* Wide Panoramic Image Container */}
              <div
                className="flex w-[200%] h-full relative transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(${panOffset}%)`,
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80"
                  alt="Panoramic Project View"
                  className="w-full h-full object-cover block brightness-95"
                />

                {/* Hotspot Markers */}
                {hotspots.map((spot) => (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => setActiveHotspot(spot)}
                    className="absolute bg-green-700 border-2 border-white rounded-full w-9 h-9 flex items-center justify-center text-white cursor-pointer shadow-lg z-15 outline-none -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: spot.x,
                      top: spot.y,
                      animation: 'hotspot-pulse 2s infinite',
                    }}
                  >
                    <LuCompass className="text-base" />
                  </button>
                ))}
              </div>

              {/* Panorama Navigation Overlays */}
              {/* Pan Left */}
              <button
                type="button"
                onClick={handlePanLeft}
                disabled={panOffset === 0}
                className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 border-0 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer z-20 shadow-md transition-opacity ${
                  panOffset === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-white'
                }`}
              >
                <LuArrowLeft className="text-slate-800 text-base" />
              </button>

              {/* Pan Right */}
              <button
                type="button"
                onClick={handlePanRight}
                disabled={panOffset === -50}
                className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 border-0 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer z-20 shadow-md transition-opacity ${
                  panOffset === -50
                    ? 'opacity-30 cursor-not-allowed'
                    : 'opacity-100 hover:bg-white'
                }`}
              >
                <LuArrowRight className="text-slate-800 text-base" />
              </button>

              {/* Close Panorama Viewer */}
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setActiveHotspot(null);
                }}
                className="absolute top-4 right-4 bg-white/90 border-0 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer z-20 shadow-md hover:bg-white transition-colors"
              >
                <LuX className="text-slate-800 text-sm" />
              </button>

              {/* Top Banner Guide */}
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-xs rounded-lg px-4 py-2 text-white text-xs font-semibold z-20 pointer-events-none">
                ↔ Use Side Arrows to Pan Site Layout (360° Scope)
              </div>

              {/* Hotspot details glassmorphic popup */}
              <AnimatePresence>
                {activeHotspot && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 sm:p-5 shadow-2xl z-30 border border-slate-200/80"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveHotspot(null)}
                      className="absolute top-3 right-3 bg-transparent border-0 text-slate-500 hover:text-slate-800 cursor-pointer p-1"
                    >
                      <LuX className="text-sm" />
                    </button>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1 flex items-center gap-2 font-['Poppins',sans-serif]">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-700" />
                      {activeHotspot.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pr-6">
                      {activeHotspot.desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
          {[
            {
              icon: LuCamera,
              title: 'Drone Overview',
              desc: 'High-definition aerial views covering the township layouts, road networks, and key green sectors.',
            },
            {
              icon: LuNavigation,
              title: 'Immersive Street View',
              desc: 'Take a virtual walk along the approach pathways, viewing layout landscaping and plot divisions.',
            },
            {
              icon: LuSmartphone,
              title: 'Responsive Support',
              desc: 'Designed to deliver zero-lag visual site tours across tablets, smartphones, and VR lenses.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs"
            >
              <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center text-green-700 text-lg mb-4">
                <item.icon />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-['Poppins',sans-serif]">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Project Photo Gallery Block */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8"
        >
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-['Poppins',sans-serif]">
              Project Photo Gallery
            </h2>
            <span className="text-xs text-slate-500 mt-0.5 block">
              Actual pictures captured at our layout coordinates in Bhubaneswar &amp; Cuttack
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600',
              'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600',
              'https://images.unsplash.com/photo-1600585154340-be6161a56a08?w=600',
              'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600',
              'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600',
              'https://images.unsplash.com/photo-1600566753086-00f18f6b7d0a?w=600',
              'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600',
              'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600',
            ].map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedImage(img)}
                className="aspect-[16/10] rounded-xl overflow-hidden cursor-pointer border border-slate-200 hover:scale-102 transition-transform duration-200"
              >
                <img
                  src={img}
                  alt={`Project Scene ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lightbox full screen modal viewer */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[1000] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-full max-h-[90%]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Enlarged Gallery Site View"
                className="max-w-full max-h-[85vh] rounded-xl shadow-2xl block"
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute -top-11 right-0 bg-white/10 hover:bg-white/20 border-0 rounded-full w-8 h-8 flex items-center justify-center text-white cursor-pointer text-sm outline-none transition-colors"
              >
                <LuX />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
