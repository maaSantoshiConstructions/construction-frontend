import React from 'react';
import { FaPaperPlane } from 'react-icons/fa';

export default function ChatInput({
  input = '',
  setInput,
  handleSend,
  loading = false
}) {
  return (
    <div style={{ padding: '20px 24px', borderTop: '1px solid var(--line)', background: '#fff' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about project prices, RERA approval, amenities..."
          style={{
            flex: 1,
            padding: '12px 20px',
            border: '1px solid var(--line)',
            borderRadius: '30px',
            fontSize: '14px',
            outline: 'none',
            background: '#fff',
            fontFamily: 'Inter, sans-serif',
            boxSizing: 'border-box',
          }}
        />
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          style={{
            width: '44px',
            height: '44px',
            background: 'var(--indigo)',
            color: '#fff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.6 : 1,
            transition: 'background 0.2s',
            outline: 'none',
          }}
        >
          <FaPaperPlane style={{ fontSize: '14px' }} />
        </button>
      </div>
      <p style={{ fontSize: '10.5px', textAlign: 'center', color: 'var(--gray)', marginTop: '10px', margin: '10px 0 0' }}>
        Multilingual Assistant • English, Hindi (हिंदी) &amp; Odia (ଓଡ଼ିଆ) Supported
      </p>
    </div>
  );
}
