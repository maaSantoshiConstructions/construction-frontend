import React from 'react';
import { Link } from 'react-router-dom';

export default function NavbarLogo({ onClick }) {
  return (
    <Link to="/" className="brand" onClick={onClick}>
      <div className="brand-icon">JS</div>
      <div className="brand-text">
        <div className="l1">JAI SANTOSHI MAA</div>
        <div className="l2">INFRASTRUCTURE PVT. LTD.</div>
      </div>
    </Link>
  );
}
