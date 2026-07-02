import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaCheckCircle, FaRobot, FaBell, FaUsers, FaChartBar, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function WhatsAppCRM() {
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendDemo = () => {
    if (!phone) return;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-green-700 to-emerald-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FaWhatsapp className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">WhatsApp CRM Integration</h1>
            <p className="text-green-100">Never lose a lead. Every inquiry routed instantly.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-6 pb-16 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: FaRobot, label: 'Auto Replies', desc: 'Instant WhatsApp responses for common queries 24/7' },
              { icon: FaBell, label: 'Instant Alerts', desc: 'Every lead, booking & inquiry notified instantly on WhatsApp' },
              { icon: FaUsers, label: 'Team Inbox', desc: 'Shared inbox for sales team with assignment & tracking' },
            ].map((item, i) => (
              <div key={i} className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3"><item.icon className="text-green-600" /></div>
                <h3 className="font-semibold text-slate-800 text-sm mb-1">{item.label}</h3>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
            <h3 className="font-bold text-slate-800 mb-4">Try WhatsApp Demo</h3>
            <p className="text-sm text-slate-600 mb-4">Enter your phone number to receive a sample property alert via WhatsApp:</p>
            <div className="flex gap-3 max-w-md">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
              />
              <button
                onClick={handleSendDemo}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors text-sm flex items-center gap-2"
              >
                <FaWhatsapp /> {sent ? 'Sent!' : 'Send Demo'}
              </button>
            </div>
            {sent && (
              <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                <FaCheckCircle /> Demo WhatsApp message sent! Check your phone.
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">How It Works</h3>
            <ol className="space-y-3 text-sm">
              {[
                'Visitor submits inquiry on website',
                'Lead auto-created in CRM with full details',
                'Instant WhatsApp notification sent to sales team',
                'Auto-reply sent to visitor with property info',
                'Sales executive responds via WhatsApp dashboard',
                'Follow-up reminders automated via WhatsApp',
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                  <span className="text-slate-600">{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Key Benefits</h3>
            <div className="space-y-4">
              {[
                { label: 'Lead Leakage', before: '30-40%', after: '<2%', color: 'text-emerald-600' },
                { label: 'Response Time', before: '4-6 hours', after: '<2 min', color: 'text-emerald-600' },
                { label: 'Conversion Rate', before: '8-12%', after: '25-35%', color: 'text-blue-600' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400 line-through">{item.before}</span>
                    <FaArrowRight className="text-slate-300" />
                    <span className={`font-bold ${item.color}`}>{item.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
