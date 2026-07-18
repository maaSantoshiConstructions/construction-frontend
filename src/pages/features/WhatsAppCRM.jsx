import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPlots } from '../../api/plots';

// Import sub-components
import CRMFeatures from '../../components/crm/CRMFeatures';
import CRMComposer from '../../components/crm/CRMComposer';
import CRMWorkflow from '../../components/crm/CRMWorkflow';

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
          <CRMFeatures />

          {/* Try WhatsApp Demo Box */}
          <CRMComposer
            phone={phone}
            setPhone={setPhone}
            customerName={customerName}
            setCustomerName={setCustomerName}
            template={template}
            setTemplate={setTemplate}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            selectedPlotId={selectedPlotId}
            setSelectedPlotId={setSelectedPlotId}
            customMessage={customMessage}
            setCustomMessage={setCustomMessage}
            loading={loading}
            uniqueProjects={uniqueProjects}
            filteredPlots={filteredPlots}
            onSend={handleSendDemo}
            sent={sent}
          />
        </motion.div>

        {/* Detailed Guidelines Grid */}
        <CRMWorkflow />

      </div>
    </div>
  );
}
