import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sendChatMessage } from '../../api/chatbot';

import ChatHeader from '../../components/ai-chatbot/ChatHeader';
import ChatWindowHeader from '../../components/ai-chatbot/ChatWindowHeader';
import ChatMessageList from '../../components/ai-chatbot/ChatMessageList';
import ChatInput from '../../components/ai-chatbot/ChatInput';

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hello! I'm your AI Sales Assistant for Jai Santoshi Maa Infrastructure. How can I help you today?" },
    { role: 'bot', content: 'I can answer questions about plots, pricing, RERA certifications, loan eligibility, site visits & more.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('chatSessionId');
    if (stored) setSessionId(stored);
  }, []);

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
      const botReply = data?.data?.botMessage?.content || data?.data?.botResponse || "Thank you! A relationship manager will contact you within 10 minutes.";
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
      <ChatHeader />

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
          <ChatWindowHeader />

          {/* Chat Window Message History */}
          <ChatMessageList
            messages={messages}
            loading={loading}
            showQuickReplies={showQuickReplies}
            handleQuickReply={handleQuickReply}
          />

          {/* Form message input panel */}
          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            loading={loading}
          />

        </motion.div>

      </div>
    </div>
  );
}
