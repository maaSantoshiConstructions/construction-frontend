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
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: '620px', animation: 'modalPopIn 0.3s ease forwards' }}>
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-700 to-slate-900 text-white">
          <div className="flex items-center gap-x-3">
            <FaRobot className="text-2xl" />
            <div>
              <div className="font-bold">JSM AI Sales Assistant</div>
              <div className="text-[10px] opacity-75">Online • English • हिंदी • ଓଡ଼ିଆ</div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">&times;</button>
        </div>

        <div ref={chatRef} className="flex-1 p-5 overflow-y-auto bg-slate-50 text-sm space-y-1">
          {messages.map((msg, i) => (
            <div key={i}
              className={`max-w-[75%] px-4 py-3 rounded-[18px] mb-2 leading-relaxed ${msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-[4px] ml-auto'
                : 'bg-slate-100 text-slate-800 rounded-bl-[4px]'} ${msg.small ? 'text-xs opacity-75' : ''}`}
              dangerouslySetInnerHTML={msg.text ? undefined : undefined}
            >
              {msg.text}
            </div>
          ))}

          {showQuickReplies && messages.length <= 2 && (
            <div className="flex flex-wrap gap-2 mt-2">
              <button onClick={() => quickReply('What is the price of Plot A-42?')}
                className="text-xs px-3 py-1.5 bg-white border rounded-2xl hover:bg-slate-50 transition">
                Price of Plot A-42?
              </button>
              <button onClick={() => quickReply('Is the project RERA approved?')}
                className="text-xs px-3 py-1.5 bg-white border rounded-2xl hover:bg-slate-50 transition">
                RERA status?
              </button>
              <button onClick={() => quickReply('Book a site visit')}
                className="text-xs px-3 py-1.5 bg-white border rounded-2xl hover:bg-slate-50 transition">
                Book site visit
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex gap-x-2">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
              type="text" placeholder="Ask about plots, pricing, RERA..."
              className="flex-1 border rounded-3xl px-5 py-3 text-sm focus:outline-none focus:border-blue-400"
            />
            <button onClick={sendMessage}
              className="px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl transition">
              <FaPaperPlane />
            </button>
          </div>
          <div className="text-[10px] text-center text-slate-400 mt-2">Multilingual support enabled • Powered by Briskode AI</div>
        </div>
      </div>
    </div>
  );
}
