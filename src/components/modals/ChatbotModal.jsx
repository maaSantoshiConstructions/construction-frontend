import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';

const replies = {
  price: "Plot A-42 is 2400 sq.ft North facing and priced at ₹58.8 Lakh (₹2,450/sq.ft). Price increases in 12 days. Would you like to book a site visit?",
  cost: "Plot A-42 is 2400 sq.ft North facing and priced at ₹58.8 Lakh (₹2,450/sq.ft). Price increases in 12 days. Would you like to book a site visit?",
  rera: "Yes! Santoshi Enclave is fully RERA registered (OR/06/2025/001234). All legal documents are available in the Legal Document Verification section.",
  loan: "We have a dedicated AI Loan Eligibility Checker. Most of our buyers get 75-85% financing from SBI, HDFC or Axis Bank. Shall I open the loan calculator for you?",
  finance: "We have a dedicated AI Loan Eligibility Checker. Most of our buyers get 75-85% financing from SBI, HDFC or Axis Bank. Shall I open the loan calculator for you?",
};

const defaultReply = "Thank you! A relationship manager will contact you within 10 minutes. Meanwhile, would you like me to recommend properties based on your requirements?";

export default function ChatbotModal({ onClose, onBookVisit }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm your AI Sales Assistant for Jai Santoshi Maa Infrastructure. How can I help you today?" },
    { role: 'bot', text: "I can answer questions about plots, pricing, RERA, loan eligibility, site visits & more.", small: true },
  ]);
  const [input, setInput] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const quickReply = (msg) => {
    setShowQuickReplies(false);
    addMessage('user', msg);
    setTimeout(() => processReply(msg), 850);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = input;
    setInput('');
    setShowQuickReplies(false);
    addMessage('user', msg);
    setTimeout(() => processReply(msg), 900);
  };

  const processReply = (msg) => {
    const lower = msg.toLowerCase();
    let reply = defaultReply;

    for (const [key, val] of Object.entries(replies)) {
      if (lower.includes(key)) {
        reply = val;
        break;
      }
    }

    if (lower.includes('visit')) {
      addMessage('bot', "Let me redirect you to the site visit booking page...");
      setTimeout(() => { onClose(); setTimeout(onBookVisit, 300); }, 500);
      return;
    }

    addMessage('bot', reply);
  };

  const addMessage = (role, text) => {
    setMessages(prev => [...prev, { role, text }]);
  };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()}
        className="modal bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col"
        style={{ height: '620px' }}>
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-blue-700 via-blue-600 to-purple-700 text-white">
          <div className="flex items-center gap-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <FaRobot className="text-xl" />
            </div>
            <div>
              <div className="font-bold">JSM AI Sales Assistant</div>
              <div className="text-[10px] opacity-75">Online • English • हिंदी • ଓଡ଼ିଆ</div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all text-xl leading-none">&times;</button>
        </div>
        <div ref={chatRef} className="flex-1 p-5 overflow-y-auto bg-slate-50 text-sm">
          {messages.map((msg, i) => (
            <div key={i}
              className={`chat-message ${msg.role === 'user' ? 'chat-user' : 'chat-bot'} ${msg.small ? 'text-xs opacity-75' : ''}`}>
              {msg.text}
            </div>
          ))}
          {showQuickReplies && messages.length <= 2 && (
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => quickReply('What is the price of Plot A-42?')}
                className="text-xs px-4 py-2 bg-white border border-slate-200 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all text-slate-600">
                Price of Plot A-42?
              </button>
              <button onClick={() => quickReply('Is the project RERA approved?')}
                className="text-xs px-4 py-2 bg-white border border-slate-200 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all text-slate-600">
                RERA status?
              </button>
              <button onClick={() => quickReply('Book a site visit')}
                className="text-xs px-4 py-2 bg-white border border-slate-200 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all text-slate-600">
                Book site visit
              </button>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex gap-x-2">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
              type="text" placeholder="Ask about plots, pricing, RERA..."
              className="flex-1 border border-slate-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
            />
            <button onClick={sendMessage}
              className="px-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <FaPaperPlane />
            </button>
          </div>
          <div className="text-[10px] text-center text-slate-400 mt-2">Multilingual support enabled • Powered by Briskode AI</div>
        </div>
      </div>
    </div>
  );
}
