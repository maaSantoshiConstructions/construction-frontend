import { useState, useEffect } from 'react';
import { getLeads, updateLead, sendLeadEmail } from '../../api/leads';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import FollowupHeader from '../../components/ai-followup/FollowupHeader';
import LeadSelector from '../../components/ai-followup/LeadSelector';
import SequenceCard from '../../components/ai-followup/SequenceCard';
import FollowupStats from '../../components/ai-followup/FollowupStats';
import SendEmailModal from '../../components/ai-followup/SendEmailModal';

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
  const { user } = useAuth();

  // Restrict customer role from accessing AI Follow-up Lead Automation
  if (user?.role === 'customer') {
    return <Navigate to="/" replace />;
  }

  const [active, setActive] = useState(sequences[0]);
  const [leads, setLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [triggeringIndex, setTriggeringIndex] = useState(null);

  // Email Modal state
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);


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

    if (step.channel === 'Email') {
      if (!lead.email) {
        toast.error(`Cannot send Email: No email address registered for ${lead.name}`);
        return;
      }
      setSelectedStep({ ...step, index });
      setEmailModalOpen(true);
      return;
    }

    try {
      setTriggeringIndex(index);
      
      let nextStatus = lead.status;
      if (active.id === 1) {
        nextStatus = 'contacted';
      } else if (active.id === 2) {
        nextStatus = 'site_visit_done';
      } else if (active.id === 3) {
        nextStatus = 'booking_done';
      }

      const nextScore = Math.min((lead.score || 0) + 15, 100);

      const updatedNotes = [...(lead.notes || [])];
      updatedNotes.push(`[AI Follow-up: ${step.channel}] Triggered "${step.time}" step: "${step.message}"`);
      
      const updatedLog = [...(lead.conversationLog || [])];
      updatedLog.push({
        message: `[AI Follow-up: ${step.channel}] Sent: "${step.message}"`,
        date: new Date()
      });

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

      toast.success(`Successfully triggered ${step.channel} follow-up for ${lead.name}!`);

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
      toast.error(err.response?.data?.message || 'Failed to trigger follow-up step.');
    } finally {
      setTriggeringIndex(null);
    }
  };

  const handleConfirmSendEmail = async ({ subject, message, selectedFile, presetFile }) => {
    if (!selectedLeadId) return;

    const lead = leads.find((l) => l._id === selectedLeadId);
    if (!lead) return;

    try {
      if (selectedStep) {
        setTriggeringIndex(selectedStep.index);
      }

      let nextStatus = lead.status;
      if (active.id === 1) {
        nextStatus = 'contacted';
      } else if (active.id === 2) {
        nextStatus = 'site_visit_done';
      } else if (active.id === 3) {
        nextStatus = 'booking_done';
      }

      const nextScore = Math.min((lead.score || 0) + 15, 100);

      let payload;
      if (selectedFile) {
        payload = new FormData();
        payload.append('subject', subject);
        payload.append('message', message);
        payload.append('channel', 'Email');
        payload.append('file', selectedFile);
      } else {
        payload = {
          subject,
          message,
          channel: 'Email',
          presetFile,
        };
      }

      const emailRes = await sendLeadEmail(selectedLeadId, payload);

      await updateLead(selectedLeadId, {
        status: nextStatus,
        score: nextScore,
      });

      const updatedLead = emailRes.data?.data || lead;
      setLeads(leads.map((l) => 
        l._id === selectedLeadId 
          ? { ...l, ...updatedLead, status: nextStatus, score: nextScore } 
          : l
      ));

      const attachedName = emailRes.data?.attachedFileName;
      toast.success(
        attachedName
          ? `Email with attached "${attachedName}" sent via Nodemailer to ${lead.email}!`
          : `Email sent via Nodemailer to ${lead.email}!`
      );
    } catch (err) {
      console.error('Error sending email:', err);
      toast.error(err.response?.data?.message || 'Failed to send email.');
    } finally {
      setTriggeringIndex(null);
    }
  };

  const selectedLead = leads.find((l) => l._id === selectedLeadId);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* ===== PAGE HEADER ===== */}
      <FollowupHeader />

      {/* ===== CONTENT WRAPPER ===== */}
      <div className="max-w-3xl mx-auto px-6 -mt-7 relative z-10">
        
        {/* Lead Selector Card */}
        <LeadSelector
          loadingLeads={loadingLeads}
          leads={leads}
          selectedLeadId={selectedLeadId}
          setSelectedLeadId={setSelectedLeadId}
        />

        {/* Main Workflows Card */}
        <SequenceCard
          sequences={sequences}
          active={active}
          setActive={setActive}
          selectedLeadId={selectedLeadId}
          triggeringIndex={triggeringIndex}
          handleTriggerStep={handleTriggerStep}
        />

        {/* Stats Summary Panel */}
        <FollowupStats />

      </div>

      {/* Send Email Attachment Modal */}
      <SendEmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        lead={selectedLead}
        step={selectedStep}
        sequenceName={active.name}
        onSendEmail={handleConfirmSendEmail}
      />
    </div>
  );
}

