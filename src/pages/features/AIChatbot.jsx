import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sendChatMessage } from '../../api/chatbot';
import { FaRobot, FaPaperPlane, FaUser } from 'react-icons/fa';

const quickReplies = [
  'What is the price of plots?',
  'Is the project RERA approved?',
  'How does loan financing work?',
  'Book a site visit',
  'Are plots still available?',
];

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hello! I'm your AI Sales Assistant for Jai Santoshi Maa Infrastructure. How can I help you today?" },
    { role: 'bot', content: 'I can answer questions about plots, pricing, RERA certifications, loan eligibility, site visits & more.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('chatSessionId');
    if (stored) setSessionId(stored);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const handleSend = async (text) => {
    const message = text || input;
    if (!message.trim() || loading) return;
    setInput('');
    setShowQuickReplies(false);
    addMessage('user', message);
    setLoading(true);

    try {
      const { data } = await sendChatMessage({
        sessionId: sessionId || undefined,
        message,
        userInfo: sessionId ? undefined : {},
      });
      if (data?.data?.sessionId) {
        setSessionId(data.data.sessionId);
        localStorage.setItem('chatSessionId', data.data.sessionId);
      }
      const botReply = data?.data?.botResponse || "Thank you! A relationship manager will contact you within 10 minutes.";
      setTimeout(() => {
        addMessage('bot', botReply);
        setLoading(false);
      }, 600);
    } catch {
      setTimeout(() => {
        addMessage('bot', "Thank you for your message! Our team will get back to you shortly.");
        setLoading(false);
      }, 600);
    }
  };

  const handleQuickReply = (text) => {
    handleSend(text);
  };

  return (
    <div style={{ background: '#f7f7fb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Dynamic Keyframe Style for Typing dots */}
      <style>{`
        @keyframes chat-dot-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>

      {/* ===== PAGE HEADER ===== */}
      <div style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(91,79,224,.35), transparent 55%), linear-gradient(120deg,#0b0f2e 0%,#161b45 55%,#1c1450 100%)',
        padding: '64px 0 60px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(91,79,224,.1)' }} />
        <div className="wrap">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>AI SALES REPRESENTATIVE</span>
          <h1 style={{ fontFamily: 'Poppins, Inter, sans-serif', fontSize: '40px', fontWeight: 800, color: '#fff', marginTop: '8px', marginBottom: '14px' }}>
            AI Sales Assistant
          </h1>
          <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            Instant multilingual assistant answering pricing, RERA, and land booking queries.
          </p>
        </div>
      </div>

      {/* ===== CHAT WINDOW WRAPPER ===== */}
      <div className="wrap" style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '760px', width: '100%', marginTop: '-28px', position: 'relative', zIndex: 10, paddingBottom: '40px' }}>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid var(--line)',
            boxShadow: '0 15px 40px rgba(20,20,60,.1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 280px)',
            minHeight: '520px',
          }}
        >
          {/* Chat header area */}
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

          {/* Chat Window Message History */}
          <div ref={chatWindowRef} style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
            <div ref={messagesEndRef} />
          </div>

          {/* Form message input panel */}
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

        </motion.div>

      </div>
    </div>
  );
}
