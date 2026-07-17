import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaWhatsapp, FaSms, FaUsers, FaChartLine, FaClock, FaSpinner } from 'react-icons/fa';
import { getLeads, updateLead } from '../../api/leads';
import toast from 'react-hot-toast';

const sequences = [
  {
    id: 1, name: 'New Lead Nurture', trigger: 'Form Submission',
    steps: [
      { time: 'Instant', channel: 'WhatsApp', message: "Thank you for your interest! Here's our project brochure." },
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
  const [leads, setLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [triggeringIndex, setTriggeringIndex] = useState(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoadingLeads(true);
        const response = await getLeads({ limit: 100 });
        const leadList = response.data?.data || [];
        setLeads(leadList);
        if (leadList.length > 0) {
          setSelectedLeadId(leadList[0]._id);
        }
      } catch (err) {
        console.error('Error fetching leads:', err);
        toast.error('Failed to load leads from database.');
      } finally {
        setLoadingLeads(false);
      }
    };

    fetchLeads();
  }, []);

  const handleTriggerStep = async (step, index) => {
    if (!selectedLeadId) {
      toast.error('Please select a lead first.');
      return;
    }
    
    const lead = leads.find((l) => l._id === selectedLeadId);
    if (!lead) return;

    try {
      setTriggeringIndex(index);
      
      const updatedNotes = [...(lead.notes || [])];
      updatedNotes.push(`[AI Follow-up: ${step.channel}] Triggered "${step.time}" step: "${step.message}"`);
      
      const updatedLog = [...(lead.conversationLog || [])];
      updatedLog.push({
        message: `[AI Follow-up: ${step.channel}] Sent: "${step.message}"`,
        date: new Date()
      });

      let nextStatus = lead.status;
      if (active.id === 1) {
        nextStatus = 'contacted';
      } else if (active.id === 2) {
        nextStatus = 'site_visit_done';
      } else if (active.id === 3) {
        nextStatus = 'booking_done';
      }

      const nextScore = Math.min((lead.score || 0) + 15, 100);

      await updateLead(selectedLeadId, {
        notes: updatedNotes,
        conversationLog: updatedLog,
        status: nextStatus,
        score: nextScore
      });

      setLeads(leads.map((l) => 
        l._id === selectedLeadId 
          ? { ...l, notes: updatedNotes, conversationLog: updatedLog, status: nextStatus, score: nextScore } 
          : l
      ));

      toast.success(`Successfully sent ${step.channel} follow-up to ${lead.name}!`);

      if (step.channel === 'WhatsApp') {
        if (!lead.phone) {
          toast.error(`Cannot launch WhatsApp: No phone number registered for ${lead.name}`);
        } else {
          let cleaned = lead.phone.replace(/\D/g, '');
          if (cleaned.length === 10) {
            cleaned = '91' + cleaned;
          }
          if (cleaned) {
            const whatsappUrl = `https://wa.me/${cleaned}?text=${encodeURIComponent(step.message)}`;
            window.open(whatsappUrl, '_blank');
          } else {
            toast.error(`Invalid phone number registered for ${lead.name}`);
          }
        }
      }
    } catch (err) {
      console.error('Error triggering follow-up:', err);
      toast.error('Failed to trigger follow-up step.');
    } finally {
      setTriggeringIndex(null);
    }
  };

  const selectedLead = leads.find((l) => l._id === selectedLeadId);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* ===== PAGE HEADER ===== */}
      <div className="relative overflow-hidden text-center py-16 px-4 bg-gradient-to-br from-slate-900 to-indigo-950">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/10" />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <span className="inline-block bg-white/10 text-[#e8b355] font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3.5">
            AI WORKFLOWS
          </span>
          <h1 className="font-poppins text-white text-3xl md:text-4xl font-extrabold mt-2 mb-3">
            AI Follow-up Automation
          </h1>
          <p className="text-indigo-200 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Intelligent multi-channel nurturing sequences that convert plot leads into bookings.
          </p>
        </div>
      </div>

      {/* ===== CONTENT WRAPPER ===== */}
      <div className="max-w-3xl mx-auto px-6 -mt-7 relative z-10">
        
        {/* Lead Selector Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 mb-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-poppins">
            1. Select Lead for Simulation
          </h3>
          {loadingLeads ? (
            <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
              <FaSpinner className="animate-spin text-indigo-600" />
              Loading active leads...
            </div>
          ) : leads.length === 0 ? (
            <div className="text-xs text-slate-500 py-2">
              No active leads found in the database. Please add a lead first.
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full md:w-2/3 px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer"
              >
                {leads.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.name} — {l.phone || 'No phone'} ({l.status.toUpperCase()})
                  </option>
                ))}
              </select>
              {selectedLead && (
                <div className="w-full md:w-1/3 text-xs bg-slate-50 border border-slate-100 rounded-lg p-3 text-slate-500">
                  <div><strong>Status:</strong> {selectedLead.status.toUpperCase()}</div>
                  <div className="mt-1"><strong>Score:</strong> {selectedLead.score || 0}%</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Workflows Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 mb-8"
        >
          {/* Workflow selection tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {sequences.map((seq) => {
              const isActive = active.id === seq.id;
              return (
                <button
                  key={seq.id}
                  onClick={() => setActive(seq)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition duration-200 outline-none ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600'
                  }`}
                >
                  {seq.name}
                </button>
              );
            })}
          </div>

          {/* Trigger Detail */}
          <div className="mb-6 border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-poppins">
                Sequence Trigger:
              </span>
              <span className="text-sm font-bold text-slate-800 ml-2">
                ⚡ {active.trigger}
              </span>
            </div>
          </div>

          {/* Steps Timeline Grid */}
          <div className="flex flex-col gap-4">
            {active.steps.map((step, i) => {
              const isWhatsApp = step.channel === 'WhatsApp';
              const isEmail = step.channel === 'Email';
              const isTriggering = triggeringIndex === i;
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl items-center"
                >
                  {/* Left Icon Panel */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                      isWhatsApp ? 'bg-emerald-50 text-emerald-500' : isEmail ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-500'
                    }`}>
                      {isWhatsApp ? <FaWhatsapp className="text-lg" /> :
                       isEmail ? <FaEnvelope className="text-base" /> :
                       <FaSms className="text-lg" />}
                    </div>
                  </div>

                  {/* Center Content Panel */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-extrabold rounded-full font-poppins">
                        {step.time}
                      </span>
                      <span className="text-slate-400 text-xs font-semibold">
                        via {step.channel}
                      </span>
                    </div>
                    <p className="text-slate-800 text-xs md:text-sm font-medium leading-relaxed truncate">
                      &ldquo;{step.message}&rdquo;
                    </p>
                  </div>

                  {/* Right Action Panel */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleTriggerStep(step, i)}
                      disabled={!selectedLeadId || triggeringIndex !== null}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition duration-200 ${
                        !selectedLeadId
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : isTriggering
                          ? 'bg-indigo-400 cursor-wait'
                          : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                      }`}
                    >
                      {isTriggering ? (
                        <span className="flex items-center gap-1">
                          <FaSpinner className="animate-spin" /> Sending
                        </span>
                      ) : (
                        'Trigger Step'
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Summary Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: FaUsers, label: 'Lead Capture Rate', value: '100%', sub: 'Zero lead leakage guaranteed' },
            { icon: FaChartLine, label: 'Conversion Rate', value: '35%', sub: 'vs Real estate avg: 12%' },
            { icon: FaClock, label: 'Average Response', value: '< 2 Mins', sub: 'Instant chatbot handover' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center"
            >
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="text-base" />
              </div>
              <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider m-0 font-poppins">
                {stat.label}
              </h4>
              <p className="text-2xl font-extrabold text-slate-800 my-1">
                {stat.value}
              </p>
              <p className="text-[10px] text-slate-400 font-medium m-0">
                {stat.sub}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
