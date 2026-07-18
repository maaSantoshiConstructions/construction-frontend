import React from 'react';
import { FaRobot } from 'react-icons/fa';

export default function ChatWindowHeader() {
  return (
    <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--line)', background: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: '#f0effc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <FaRobot style={{ color: 'var(--indigo)', fontSize: '20px' }} />
      </div>
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>JSM Support Bot</h3>
        <span style={{ fontSize: '11px', color: '#2ecc71', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#2ecc71' }} />
          Online • Active Multilingual Support
        </span>
      </div>
    </div>
  );
}
