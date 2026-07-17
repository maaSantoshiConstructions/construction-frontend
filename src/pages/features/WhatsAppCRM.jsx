import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaCheckCircle, FaRobot, FaBell, FaUsers, FaArrowRight } from 'react-icons/fa';
import { getPlots } from '../../api/plots';

export default function WhatsAppCRM() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [template, setTemplate] = useState('property_alert');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedPlotId, setSelectedPlotId] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        setLoading(true);
        const response = await getPlots({ limit: 100 });
        const plotsList = response.data?.data || [];
        
        const mappedProperties = plotsList.map((plot) => ({
          id: plot._id,
          plotNumber: plot.plotNumber,
          project: plot.project?.name || 'N/A',
          size: plot.size || 1800,
          price: plot.price ? (plot.price / 100000).toFixed(1) : '35.0',
          facing: plot.facing || 'East',
          status: plot.status || 'available'
        }));
        
        setProperties(mappedProperties);
        
        if (mappedProperties.length > 0) {
          setSelectedProject(mappedProperties[0].project);
          setSelectedPlotId(mappedProperties[0].id);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlots();
  }, []);

  const uniqueProjects = Array.from(new Set(properties.map((p) => p.project))).filter(Boolean);
  const filteredPlots = properties.filter((p) => p.project === selectedProject);

  useEffect(() => {
    if (filteredPlots.length > 0) {
      const exists = filteredPlots.some((p) => p.id === selectedPlotId);
      if (!exists) {
        setSelectedPlotId(filteredPlots[0].id);
      }
    } else {
      setSelectedPlotId('');
    }
  }, [selectedProject, properties]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const activePlot = properties.find((p) => p.id === selectedPlotId);
    const greetingName = customerName.trim() || 'Valued Customer';
    let messageText = '';
    
    if (template === 'property_alert') {
      const projName = activePlot?.project || selectedProject || 'Green City Phase II';
      const plotNum = activePlot?.plotNumber || 'GC-01';
      const plotSize = activePlot?.size || 1800;
      const plotFacing = activePlot?.facing || 'East';
      const plotPrice = activePlot?.price || '35.0';
      
      messageText = `Maa Santoshi Constructions - Property Alert\n\n` +
        `Hi ${greetingName}!\n\n` +
        `Here are the details of a premium property matching your preference:\n` +
        `Project: ${projName}\n` +
        `Unit: Plot ${plotNum}\n` +
        `Size: ${plotSize} sq.ft\n` +
        `Facing: ${plotFacing}\n` +
        `Price: ₹${plotPrice} Lakh\n\n` +
        `Reply to this chat to connect with our sales executive and schedule a visit!`;
    } else if (template === 'site_visit') {
      const projName = activePlot?.project || selectedProject || 'Green City Phase II';
      
      messageText = `Maa Santoshi Constructions - Guided Site Visit\n\n` +
        `Hi ${greetingName}!\n\n` +
        `We invite you to join us for a guided tour of our premium project: ${projName}.\n\n` +
        `Transportation: Complementary pickup and drop-off service is available.\n` +
        `Please reply with your preferred date and time slot to confirm your booking.`;
    } else if (template === 'payment_reminder') {
      const projName = activePlot?.project || selectedProject || 'Green City Phase II';
      const plotNum = activePlot?.plotNumber || 'GC-01';
      
      messageText = `Maa Santoshi Constructions - Installment Update\n\n` +
        `Dear ${greetingName},\n\n` +
        `This is a friendly update regarding your booking at ${projName}.\n` +
        `Unit: Plot ${plotNum}\n` +
        `Status: Next installment is due shortly.\n\n` +
        `Please contact your relationship manager for online payment links or receipt updates. Thank you!`;
    }
    
    setCustomMessage(messageText);
  }, [template, selectedPlotId, selectedProject, customerName, properties]);

  const handleSendDemo = () => {
    if (!phone) {
      alert('Please enter a phone number.');
      return;
    }
    
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    
    if (!cleaned) {
      alert('Please enter a valid phone number.');
      return;
    }
    
    const whatsappUrl = `https://wa.me/${cleaned}?text=${encodeURIComponent(customMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      
      {/* ===== PAGE HEADER ===== */}
      <div className="relative overflow-hidden text-center py-16 px-4 bg-gradient-to-br from-slate-900 to-indigo-950">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/10" />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <span className="inline-block bg-white/10 text-[#e8b355] font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3.5">
            CRM INTEGRATIONS
          </span>
          <h1 className="font-poppins text-white text-3xl md:text-4xl font-extrabold mt-2 mb-3">
            WhatsApp CRM Integration
          </h1>
          <p className="text-indigo-200 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Never lose a lead. Automated project alerts and routing sent instantly to your phone.
          </p>
        </div>
      </div>

      {/* ===== CONTENT WRAPPER ===== */}
      <div className="max-w-4xl mx-auto px-6 -mt-7 relative z-10">
        
        {/* Main Features & Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 mb-8"
        >
          {/* Key pillars grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {[
              { icon: FaRobot, label: 'Auto Replies', desc: 'Instant WhatsApp responses for user queries 24/7' },
              { icon: FaBell, label: 'Instant Alerts', desc: 'Every booking & inquiry notified instantly to you' },
              { icon: FaUsers, label: 'Shared Team Inbox', desc: 'Collaborative inbox for sales team assignments' },
            ].map((item, i) => (
              <div
                key={i}
                className="p-5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="text-lg" />
                </div>
                <h3 className="text-slate-800 text-sm font-bold mb-1.5 font-poppins">
                  {item.label}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed m-0">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Try WhatsApp Demo Box */}
          <div className="bg-slate-50 border border-dashed border-indigo-200 rounded-2xl p-6 md:p-8">
            <h3 className="text-base font-bold text-slate-800 mb-1.5 font-poppins">
              Smart Message Composer (WhatsApp CRM)
            </h3>
            <p className="text-slate-500 text-xs md:text-sm font-medium mb-5">
              Test and customize dynamic templates powered by actual property records before opening WhatsApp:
            </p>

            {/* Step 1: Template Toggles */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-poppins">
                1. Select Communication Template:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'property_alert', label: '🏡 Property Alert' },
                  { id: 'site_visit', label: '📅 Site Visit Invitation' },
                  { id: 'payment_reminder', label: '💰 Payment Reminder' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition duration-200 outline-none ${
                      template === t.id
                        ? 'bg-indigo-50 border border-indigo-600 text-indigo-600'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Property Filter Dropdowns */}
            {(template === 'property_alert' || template === 'payment_reminder') && (
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-poppins">
                  2. Select Property Details:
                </label>
                <div className="flex flex-wrap gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      disabled={loading || uniqueProjects.length === 0}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 outline-none cursor-pointer focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                    >
                      {uniqueProjects.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <select
                      value={selectedPlotId}
                      onChange={(e) => setSelectedPlotId(e.target.value)}
                      disabled={loading || filteredPlots.length === 0}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 outline-none cursor-pointer focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                    >
                      {filteredPlots.map((p) => (
                        <option key={p.id} value={p.id}>
                          Plot {p.plotNumber} — {p.size} sq.ft (₹{p.price} L)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Recipient Personalization */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-poppins">
                {template === 'property_alert' || template === 'payment_reminder' ? '3.' : '2.'} Customer Personalization & Recipient:
              </label>
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Customer Name (e.g. Rahul)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Recipient Phone (+91 XXXXX XXXXX)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Editable Message Preview Area */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-poppins">
                Message Preview (Directly editable text):
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full h-44 px-4 py-3.5 rounded-xl border border-indigo-600 text-xs md:text-sm font-sans leading-relaxed outline-none bg-slate-50 text-slate-800 resize-y focus:bg-white transition"
              />
            </div>

            {/* Step 5: Send Redirection */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleSendDemo}
                disabled={loading || !phone}
                className="px-6 py-3 rounded-lg text-white font-bold text-xs md:text-sm flex items-center gap-2 transition duration-200 bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <FaWhatsapp className="text-base md:text-lg" /> Send Custom Alert on WhatsApp
              </button>

              {sent && (
                <div className="flex items-center gap-2 text-xs md:text-sm text-emerald-500 font-semibold">
                  <FaCheckCircle /> WhatsApp redirect triggered!
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Detailed Guidelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <h3 className="text-sm font-bold text-slate-800 mb-5 font-poppins">
              How It Works
            </h3>
            <ol className="flex flex-col gap-4">
              {[
                'Visitor submits a booking form or inquiries on website.',
                'The system auto-records details directly in CRM dashboard.',
                'Instant alerts are sent straight to coordinates via WhatsApp.',
                'Immediate brochures are sent to the visitor via automation.',
                'Team can instantly chat with customers via single interface.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-poppins">
                    {i + 1}
                  </span>
                  <span className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <h3 className="text-sm font-bold text-slate-800 mb-5 font-poppins">
              CRM Key Benefits
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Unchecked Lead Leakage', before: '35% Loss', after: '< 2% Loss' },
                { label: 'Average Response Time', before: '5 Hours', after: '< 2 Mins' },
                { label: 'Conversion Performance', before: '10% Avg', after: '32% High' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <div>
                    <span className="block text-xs font-bold text-slate-800 font-poppins">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] md:text-xs font-semibold">
                    <span className="text-slate-400 line-through">{item.before}</span>
                    <FaArrowRight className="text-slate-300 text-[9px]" />
                    <span className="text-emerald-500 font-extrabold text-xs md:text-sm">{item.after}</span>
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
