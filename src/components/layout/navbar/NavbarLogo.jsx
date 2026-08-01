import React from 'react';
import { Link } from 'react-router-dom';

export default function NavbarLogo({ onClick }) {
  return (
    <Link to="/" className="brand" onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '0px', textDecoration: 'none' }}>
      <img
        src="/construction logo.png"
        alt="JSMIL – Jai Santoshi Maa Infrastructure"
        style={{ height: '52px', width: 'auto', objectFit: 'contain' }}
      />
    </Link>
  );
}
