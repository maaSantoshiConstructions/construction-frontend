import React, { useRef, useEffect } from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';

const quickReplies = [
  'What is the price of plots?',
  'Is the project RERA approved?',
  'How does loan financing work?',
  'Book a site visit',
  'Are plots still available?',
];

export default function ChatMessageList({
  messages = [],
  loading = false,
  showQuickReplies = true,
  handleQuickReply
}) {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, loading]);

  return (
    <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {messages.map((msg, i) => {
        const isUser = msg.role === 'user';
        return (
          <div key={i} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '80%', display: 'flex', gap: '12px', flexDirection: isUser ? 'row-reverse' : 'row' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '4px',
                background: isUser ? 'var(--indigo)' : '#12173f',
              }}>
                {isUser ? <FaUser style={{ color: '#fff', fontSize: '12px' }} /> : <FaRobot style={{ color: '#fff', fontSize: '13px' }} />}
              </div>
              <div style={{
                padding: '12px 18px',
                borderRadius: '16px',
                fontSize: '14px',
                lineHeight: 1.5,
                color: isUser ? '#fff' : 'var(--text)',
                background: isUser ? 'var(--indigo)' : '#fff',
                border: isUser ? 'none' : '1px solid var(--line)',
                borderBottomRightRadius: isUser ? '4px' : '16px',
                borderBottomLeftRadius: isUser ? '16px' : '4px',
                boxShadow: isUser ? 'none' : '0 2px 8px rgba(0,0,0,0.02)',
              }}>
                {msg.content}
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing Loader dots */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#12173f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FaRobot style={{ color: '#fff', fontSize: '13px' }} />
            </div>
            <div style={{
              padding: '12px 20px',
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              borderBottomLeftRadius: '4px',
            }}>
              <div style={{ display: 'flex', gap: '5px', padding: '4px 0' }}>
                <span style={{ width: '6px', height: '6px', bg: 'var(--gray)', background: 'var(--gray)', borderRadius: '50%', display: 'inline-block', animation: 'chat-dot-bounce 0.8s infinite', animationDelay: '0ms' }} />
                <span style={{ width: '6px', height: '6px', bg: 'var(--gray)', background: 'var(--gray)', borderRadius: '50%', display: 'inline-block', animation: 'chat-dot-bounce 0.8s infinite', animationDelay: '150ms' }} />
                <span style={{ width: '6px', height: '6px', bg: 'var(--gray)', background: 'var(--gray)', borderRadius: '50%', display: 'inline-block', animation: 'chat-dot-bounce 0.8s infinite', animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick replies blocks */}
      {showQuickReplies && messages.length <= 2 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', paddingLeft: '46px' }}>
          {quickReplies.map((qr, i) => (
            <button
              key={i}
              onClick={() => handleQuickReply(qr)}
              style={{
                fontSize: '12.5px',
                padding: '8px 16px',
                background: '#fff',
                border: '1px solid var(--line)',
                color: 'var(--text)',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                outline: 'none',
                fontWeight: 500,
                boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--indigo)';
                e.target.style.color = 'var(--indigo)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--line)';
                e.target.style.color = 'var(--text)';
              }}
            >
              {qr}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
