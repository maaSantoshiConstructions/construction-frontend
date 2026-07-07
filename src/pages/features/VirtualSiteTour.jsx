import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaVrCardboard, FaCamera, FaStreetView, FaMobileAlt, FaTimes, FaArrowLeft, FaArrowRight, FaCompass } from 'react-icons/fa';

const hotspots = [
  { id: 1, x: '25%', y: '40%', name: 'JSM Club & Swimming Pool', desc: 'Premium community centre featuring an indoor games room, kids play zone, gym & lounge area.' },
  { id: 2, x: '52%', y: '55%', name: 'Sector A Premium Plots', desc: 'North and East facing residential plots, fully demarcated with 30ft blacktop approach roads.' },
  { id: 3, x: '78%', y: '35%', name: 'Water Reservoir Promenade', desc: 'Lakeside jogging tracks, seating pavilions, and beautifully landscaped green lawns.' },
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
    <div style={{ background: '#f7f7fb', minHeight: '100vh', paddingBottom: '90px' }}>

      {/* Dynamic Keyframe Style */}
      <style>{`
        @keyframes hotspot-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(58, 47, 184, 0.7); }
          70% { transform: scale(1.15); box-shadow: 0 0 0 10px rgba(58, 47, 184, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(58, 47, 184, 0); }
        }
      `}</style>

      {/* ===== PAGE HEADER ===== */}
      <div style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(91,79,224,.35), transparent 55%), linear-gradient(120deg,#0b0f2e 0%,#161b45 55%,#1c1450 100%)',
        padding: '64px 0 60px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(91,79,224,.1)' }} />
        <div className="wrap">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>IMMERSIVE VISIT</span>
          <h1 style={{ fontFamily: 'Poppins, Inter, sans-serif', fontSize: '40px', fontWeight: 800, color: '#fff', marginTop: '8px', marginBottom: '14px' }}>
            360° Virtual Site Visit
          </h1>
          <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Experience our premium project layouts in immersive details from the comfort of your home.
          </p>
        </div>
      </div>

      {/* ===== CONTENT WRAPPER ===== */}
      <div className="wrap" style={{ marginTop: '-28px', position: 'relative', zIndex: 10 }}>

        {/* Immersive 360 Tour Panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid var(--line)',
            boxShadow: '0 15px 40px rgba(20,20,60,.1)',
            overflow: 'hidden',
            marginBottom: '32px',
          }}
        >
          {!isPlaying ? (
            /* Poster Intro Panel */
            <div
              onClick={() => setIsPlaying(true)}
              style={{
                position: 'relative',
                aspectRatio: '16/9',
                background: '#0b0f2e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,10,32,0.1) 40%, rgba(8,10,32,0.7) 100%)', zIndex: 2 }} />
              <img
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80"
                alt="Virtual Tour Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75, position: 'absolute', inset: 0 }}
              />
              <div style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
                <div style={{
                  width: '76px',
                  height: '76px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s ease',
                }}>
                  <FaPlay style={{ color: 'var(--indigo)', fontSize: '24px', marginLeft: '4px' }} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                  Start Panoramic Site Visit
                </h3>
                <p style={{ fontSize: '13.5px', color: '#cbd5e1', marginTop: '6px' }}>
                  Interactive 360° drone walkthrough with project hotspots
                </p>
              </div>
            </div>
          ) : (
            /* Interactive Simulated 360 Viewer */
            <div style={{ position: 'relative', aspectRatio: '16/9', background: '#090c24', overflow: 'hidden' }}>

              {/* Wide Panoramic Image Container */}
              <div style={{
                display: 'flex',
                width: '200%',
                height: '100%',
                transform: `translateX(${panOffset}%)`,
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
              }}>
                <img
                  src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80"
                  alt="Panoramic Project View"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.95)' }}
                />

                {/* Hotspot Markers */}
                {hotspots.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => setActiveHotspot(spot)}
                    style={{
                      position: 'absolute',
                      left: spot.x,
                      top: spot.y,
                      background: 'var(--indigo)',
                      border: '2px solid #fff',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                      animation: 'hotspot-pulse 2s infinite',
                      zIndex: 15,
                      outline: 'none',
                    }}
                  >
                    <FaCompass style={{ fontSize: '16px' }} />
                  </button>
                ))}
              </div>

              {/* Panorama Navigation Overlays */}
              {/* Pan Left */}
              <button
                onClick={handlePanLeft}
                disabled={panOffset === 0}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 20,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  opacity: panOffset === 0 ? 0.3 : 1,
                  outline: 'none',
                }}
              >
                <FaArrowLeft style={{ color: 'var(--text)' }} />
              </button>

              {/* Pan Right */}
              <button
                onClick={handlePanRight}
                disabled={panOffset === -50}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 20,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  opacity: panOffset === -50 ? 0.3 : 1,
                  outline: 'none',
                }}
              >
                <FaArrowRight style={{ color: 'var(--text)' }} />
              </button>

              {/* Close Panorama Viewer */}
              <button
                onClick={() => { setIsPlaying(false); setActiveHotspot(null); }}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 20,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  outline: 'none',
                }}
              >
                <FaTimes style={{ color: 'var(--text)', fontSize: '13px' }} />
              </button>

              {/* Top Banner Guide */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'rgba(9, 12, 36, 0.8)',
                backdropFilter: 'blur(6px)',
                borderRadius: '8px',
                padding: '8px 16px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                zIndex: 20,
                pointerEvents: 'none',
              }}>
                ↔ Use Side Arrows to Pan Site Layout (360° Scope)
              </div>

              {/* Hotspot details glassmorphic popup */}
              <AnimatePresence>
                {activeHotspot && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '20px',
                      right: '20px',
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      zIndex: 30,
                    }}
                  >
                    <button
                      onClick={() => setActiveHotspot(null)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                    >
                      <FaTimes />
                    </button>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--indigo)' }} />
                      {activeHotspot.name}
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: 1.5, margin: 0, paddingRight: '16px' }}>
                      {activeHotspot.desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}
        </motion.div>

        {/* Feature Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[
            { icon: FaCamera, title: 'Drone Overview', desc: 'High-definition aerial views covering the township layouts, road networks, and key green sectors.' },
            { icon: FaStreetView, title: 'Immersive Street View', desc: 'Take a virtual walk along the approach pathways, viewing layout landscaping and plot divisions.' },
            { icon: FaMobileAlt, title: 'Responsive Support', desc: 'Designed to deliver zero-lag visual site tours across tablets, smartphones, and VR lenses.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid var(--line)',
                padding: '24px',
                boxShadow: '0 4px 15px rgba(20,20,60,0.02)',
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                background: '#efeafe',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <item.icon style={{ color: 'var(--indigo)', fontSize: '18px' }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px', fontFamily: 'Poppins, sans-serif' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--gray)', lineHeight: 1.6, margin: 0 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Project Photo Gallery Block */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid var(--line)',
            boxShadow: '0 4px 20px rgba(20,20,60,0.02)',
            padding: '28px 32px',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', fontFamily: 'Poppins, sans-serif', margin: 0 }}>
              Project Photo Gallery
            </h2>
            <span style={{ fontSize: '12.5px', color: 'var(--gray)', marginTop: '2px', display: 'block' }}>
              Actual pictures captured at our layout coordinates in Bhubaneswar &amp; Cuttack
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
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
                style={{
                  aspectRatio: '16/10',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid var(--line)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <img
                  src={img}
                  alt={`Project Scene ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(9, 12, 36, 0.95)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ position: 'relative', maxWidth: '100%', maxHeight: '90%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Enlarged Gallery Site View"
                style={{
                  maxWidth: '100%',
                  maxHeight: '85vh',
                  borderRadius: '12px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  display: 'block',
                }}
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                style={{
                  position: 'absolute',
                  top: '-44px',
                  right: 0,
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  outline: 'none',
                }}
              >
                <FaTimes />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
