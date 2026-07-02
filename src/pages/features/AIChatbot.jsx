import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { sendChatMessage } from '../../api/chatbot';
import { FaRobot, FaPaperPlane, FaUser, FaTimes, FaWhatsapp } from 'react-icons/fa';

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
    { role: 'bot', content: 'I can answer questions about plots, pricing, RERA, loan eligibility, site visits & more.' },
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-gradient-to-r from-blue-700 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FaRobot className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Sales Assistant</h1>
            <p className="text-blue-200">24×7 multilingual support • English • हिंदी • ଓଡ଼ିଆ</p>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 -mt-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col"
          style={{ height: 'calc(100vh - 240px)', minHeight: 500 }}
        >
          <div ref={chatWindowRef} className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                    {msg.role === 'user' ? <FaUser className="text-white text-xs" /> : <FaRobot className="text-white text-xs" />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-md' : 'bg-white border border-slate-200 rounded-bl-md'}`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaRobot className="text-white text-xs" />
                  </div>
                  <div className="px-4 py-3 bg-white border border-slate-200 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showQuickReplies && messages.length <= 2 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {quickReplies.map((qr, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(qr)}
                    className="text-xs px-4 py-2 bg-white border border-slate-200 rounded-full hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about plots, pricing, RERA..."
                className="flex-1 px-5 py-3 border border-slate-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <FaPaperPlane />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Multilingual support enabled • Responses are AI-generated
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
