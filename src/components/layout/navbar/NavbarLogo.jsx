import React from 'react';
import { Link } from 'react-router-dom';

export default function NavbarLogo({ onClick }) {
  return (
    <Link to="/" className="flex items-center gap-0 no-underline shrink-0" onClick={onClick}>
      <img
        src="/construction logo.png"
        alt="JSMIL – Jai Santoshi Maa Infrastructure"
        className="h-[52px] w-auto object-contain"
      />
    </Link>
  );
}
