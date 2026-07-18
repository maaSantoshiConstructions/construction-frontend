import React from 'react';

export default function ScrollToTop() {
  return (
    <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
  );
}
