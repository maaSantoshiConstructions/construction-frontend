import React from 'react';

export default function ScrollToTop() {
  return (
    <button
      type="button"
      className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-green-700 hover:bg-green-600 text-white flex items-center justify-center text-lg shadow-lg shadow-green-700/40 z-[200] cursor-pointer border-0 transition-all hover:scale-105"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top of page"
    >
      ↑
    </button>
  );
}
