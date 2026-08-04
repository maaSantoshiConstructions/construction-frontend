import React from 'react';
import { LuPhone, LuCheck, LuSparkles } from 'react-icons/lu';

export default function ProjectBottomDetails({
  project,
  finalAmenities = [],
  finalHighlights = [],
  getImageUrl,
}) {
  return (
    <div className="wrap">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Amenities */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="font-['Poppins',sans-serif] text-xl font-extrabold text-slate-900 mb-5">
            Project Amenities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {finalAmenities.map((amenity, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm shrink-0">
                  <LuSparkles />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Location Highlights & Contact */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Highlights */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
            <h2 className="font-['Poppins',sans-serif] text-lg font-extrabold text-slate-900 mb-4">
              Location Highlights
            </h2>
            <div className="flex flex-col gap-2.5">
              {finalHighlights.map((item, i) => (
                <div key={i} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2.5">
                  <LuCheck className="text-emerald-600 text-base font-bold shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium CTA box */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-6 sm:p-7 text-white shadow-lg">
            <h3 className="font-['Poppins',sans-serif] text-lg font-extrabold mb-2">
              Interested in this project?
            </h3>
            <p className="text-xs sm:text-sm text-indigo-100 mb-5 leading-relaxed font-normal">
              Our dedicated relationship managers will guide you through site visits, layout maps, and plot bookings.
            </p>
            <a
              href="tel:+917000012345"
              className="cta-btn flex items-center justify-center gap-2 w-full py-3.5 text-xs font-bold rounded-xl no-underline border-0 shadow-md"
            >
              <LuPhone className="text-sm shrink-0" />
              <span>Call +91 70000 12345</span>
            </a>
          </div>
        </div>
      </div>

      {/* Layout Plan Map Section */}
      {project?.layoutImage && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mt-8">
          <h2 className="font-['Poppins',sans-serif] text-xl font-extrabold text-slate-900 mb-2">
            Master Layout Plan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-5">
            Official layout map configuration and boundary divisions for {project.name}.
          </p>
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-[500px] flex items-center justify-center p-4">
            <img
              src={getImageUrl(project.layoutImage)}
              alt="Master Layout Plan"
              className="max-w-full max-h-[468px] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
