import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaImage, FaMagic, FaPalette, FaChair, FaCouch } from 'react-icons/fa';

const styles = [
  { id: 'modern', label: 'Modern', color: 'bg-blue-500' },
  { id: 'luxury', label: 'Luxury', color: 'bg-amber-500' },
  { id: 'scandinavian', label: 'Scandinavian', color: 'bg-emerald-500' },
  { id: 'traditional', label: 'Traditional', color: 'bg-purple-500' },
  { id: 'minimalist', label: 'Minimalist', color: 'bg-slate-500' },
];

const sampleImages = {
  modern: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800',
  luxury: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
  scandinavian: 'https://images.unsplash.com/photo-1600573472591-ee6c8f38d5f6?w=800',
  traditional: 'https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=800',
  minimalist: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800',
};

export default function InteriorVisualizer() {
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [showResult, setShowResult] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FaPalette className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">AI Interior Visualizer</h1>
            <p className="text-purple-200">See your space transformed with different interior styles</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-6 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4">Upload Your Room Photo</h2>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <FaImage className="text-4xl text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500 mb-1">Drop an image here or click to browse</p>
                <p className="text-xs text-slate-400">Supports: JPG, PNG, WEBP (max 10MB)</p>
                <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition-colors">Choose Image</button>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Choose Interior Style</h3>
                <div className="grid grid-cols-5 gap-2">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => { setSelectedStyle(style.id); setShowResult(true); }}
                      className={`p-3 rounded-xl border text-center transition-all text-xs ${selectedStyle === style.id ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-300'}`}
                    >
                      <div className={`w-6 h-6 ${style.color} rounded-full mx-auto mb-1`} />
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowResult(true)}
                className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FaMagic /> Generate Interior Visualization
              </button>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4">Preview</h2>
              <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden">
                {showResult ? (
                  <img
                    src={sampleImages[selectedStyle]}
                    alt={`${selectedStyle} interior`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <FaCouch className="text-4xl text-slate-300 mx-auto mb-3" />
                      <p className="text-sm text-slate-400">Upload a photo and select a style</p>
                      <p className="text-xs text-slate-300">to see AI-generated preview</p>
                    </div>
                  </div>
                )}
              </div>
              {showResult && (
                <p className="text-xs text-slate-400 mt-2 text-center">
                  Showing <strong className="capitalize">{selectedStyle}</strong> style preview
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
