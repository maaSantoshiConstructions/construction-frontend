import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaEnvelope, FaWhatsapp, FaSms, FaUsers, FaChartLine, FaClock, FaCheckCircle } from 'react-icons/fa';

const sequences = [
  {
    id: 1, name: 'New Lead Nurture', trigger: 'Form Submission',
    steps: [
      { time: 'Instant', channel: 'WhatsApp', message: 'Thank you for your interest! Here\'s our project brochure.' },
      { time: '1 hour', channel: 'Email', message: 'Detailed project PDF with pricing & payment plans.' },
      { time: '24 hours', channel: 'WhatsApp', message: 'Would you like to schedule a site visit this weekend?' },
      { time: '3 days', channel: 'SMS', message: 'Special launch offer: Get 5% discount on booking this week!' },
    ],
  },
  {
    id: 2, name: 'Site Visit Follow-up', trigger: 'Visit Booked',
    steps: [
      { time: 'Instant', channel: 'WhatsApp', message: 'Visit confirmed! Google Maps link & executive details shared.' },
      { time: '1 day before', channel: 'WhatsApp', message: 'Reminder: Your site visit is tomorrow at 11 AM.' },
      { time: 'Post visit', channel: 'Email', message: 'Thank you for visiting! Here\'s the property summary.' },
      { time: '3 days after', channel: 'WhatsApp', message: 'Still thinking? We have special discounts for first 10 bookings.' },
    ],
  },
  {
    id: 3, name: 'Post-Booking Engagement', trigger: 'Booking Confirmed',
    steps: [
      { time: 'Instant', channel: 'WhatsApp', message: 'Congratulations! Booking confirmed. Welcome to the JSM family!' },
      { time: 'Weekly', channel: 'WhatsApp', message: 'Construction progress update with photos & videos.' },
      { time: 'Monthly', channel: 'Email', message: 'Monthly construction report & payment schedule.' },
      { time: 'Quarterly', channel: 'SMS', message: 'Quarterly project newsletter & community events.' },
    ],
  },
];

export default function AIFollowupAutomation() {
  const [active, setActive] = useState(sequences[0]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FaRobot className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">AI Follow-up Automation</h1>
            <p className="text-indigo-200">Intelligent nurturing sequences that convert leads into customers</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-6 pb-16 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-wrap gap-3 mb-8">
            {sequences.map((seq) => (
              <button
                key={seq.id}
                onClick={() => setActive(seq)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active.id === seq.id ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-indigo-300'
                }`}
              >
                {seq.name}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Trigger: </span>
            <span className="text-sm font-semibold text-slate-700">{active.trigger}</span>
          </div>

          <div className="space-y-4">
            {active.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    {step.channel === 'WhatsApp' ? <FaWhatsapp className="text-green-600" /> :
                     step.channel === 'Email' ? <FaEnvelope className="text-blue-600" /> :
                     <FaSms className="text-purple-600" />}
                  </div>
                  {i < active.steps.length - 1 && <div className="w-0.5 h-full bg-indigo-200 mt-1" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-medium rounded">{step.time}</span>
                    <span className="text-xs font-medium text-slate-500">{step.channel}</span>
                  </div>
                  <p className="text-sm text-slate-600">{step.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: FaUsers, label: 'Lead Capture', value: '100%', sub: 'No lead leakage' },
            { icon: FaChartLine, label: 'Conversion Rate', value: '35%', sub: 'Industry avg: 12%' },
            { icon: FaClock, label: 'Response Time', value: '<2 min', sub: 'Auto-reply enabled' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100 text-center"
            >
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-indigo-600">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
