import React from 'react';
import { Link } from 'react-router-dom';
import { LuMapPin, LuMap, LuCalendar, LuShare2 } from 'react-icons/lu';

export default function ProjectMainInfo({
  project,
  images = [],
  selectedImage = 0,
  setSelectedImage,
  statusColors = {},
  locationStr,
  formattedPrice,
  rera,
  handleShare,
}) {
  const stColor = statusColors[project?.status] || {
    bg: '#e0e7ff',
    text: '#3730a3',
  };

  return (
    <div className="wrap">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        {/* Left: Photos */}
        <div className="lg:col-span-6">
          <div className="rounded-xl overflow-hidden h-[300px] sm:h-[380px] mb-3 border border-slate-200 bg-slate-50">
            <img
              src={images[selectedImage]}
              alt={project.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={`w-[74px] h-[56px] rounded-lg overflow-hidden border-2 p-0 bg-none shrink-0 cursor-pointer transition-all ${selectedImage === i ? 'border-indigo-600 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-6">
          {project.status && (
            <span
              className="inline-block px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider mb-3 border border-indigo-100"
              style={{
                background: stColor.bg,
                color: stColor.text,
              }}
            >
              {project.status}
            </span>
          )}

          <h1 className="font-['Poppins',sans-serif] text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
            {project.name}
          </h1>

          <div className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mb-5 font-medium">
            <LuMapPin className="text-amber-600 text-base shrink-0" />
            <span>{locationStr}</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
            {project.description ||
              'Premium residential plotting development featuring beautiful parks, clear titles, boundary walls, street lighting, and wide concrete roads.'}
          </p>

          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 mb-6">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Starting Price
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-['Poppins',sans-serif]">
              {formattedPrice}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
            <div className="border border-slate-200 rounded-xl p-3 bg-white">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                RERA Status
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 block truncate">
                {rera}
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-white">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Property Type
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 block capitalize truncate">
                {project.type?.replace(/_/g, ' ') || 'Plotted Development'}
              </span>
            </div>

            {project.totalPlots && (
              <div className="border border-slate-200 rounded-xl p-3 bg-white">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Plots
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 block truncate">
                  {project.totalPlots} Units
                </span>
              </div>
            )}

            {project.totalArea && (
              <div className="border border-slate-200 rounded-xl p-3 bg-white">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Area
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 block truncate">
                  {project.totalArea}
                </span>
              </div>
            )}

            {project.possessionDate && (
              <div className="border border-slate-200 rounded-xl p-3 bg-white">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Possession
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 block truncate">
                  {new Date(project.possessionDate).toLocaleDateString(undefined, {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/plot-map?project=${project.slug}`}
              className="cta-btn flex items-center gap-2 text-xs font-bold px-5 py-3 rounded-xl border-0 shadow-md no-underline"
            >
              <LuMap className="text-sm shrink-0" />
              <span>View Live Plot Map</span>
            </Link>

            <Link
              to="/book-visit"
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors text-xs font-bold no-underline"
            >
              <LuCalendar className="text-sm shrink-0 text-slate-500" />
              <span>Schedule Site Visit</span>
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="w-11 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center text-base cursor-pointer transition-colors"
              title="Share project"
              aria-label="Share project"
            >
              <LuShare2 />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
