import React from 'react';
import { Link } from 'react-router-dom';

export default function ProjectBreadcrumb({ projectName }) {
  return (
    <div className="wrap" style={{ paddingTop: '24px', paddingBottom: '16px' }}>
      <div style={{ fontSize: '13px', color: 'var(--gray)', display: 'flex', gap: '8px' }}>
        <Link to="/" style={{ color: 'var(--indigo)', fontWeight: 600 }}>Home</Link> /
        <Link to="/projects" style={{ color: 'var(--indigo)', fontWeight: 600 }}>Projects</Link> /
        <span style={{ color: 'var(--text)' }}>{projectName}</span>
      </div>
    </div>
  );
}
