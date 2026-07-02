import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaPlus, FaEye, FaTimes, FaReply } from 'react-icons/fa';
import DataTable from '../../../components/common/DataTable';
import ErrorMessage from '../../../components/common/ErrorMessage';

const ticketStatusColors = {
  open: 'bg-orange-100 text-orange-700',
  in_progress: 'bg-amber-100 text-amber-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-slate-100 text-slate-600',
};

const priorityColors = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-orange-100 text-orange-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export default function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [form, setForm] = useState({ subject: '', message: '', priority: 'medium' });

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const { default: ticketsApi } = await import('../../../api/notifications');
      const { data: res } = await ticketsApi.getNotifications({ type: 'ticket', limit: 100 });
      const items = res?.data || res || [];
      setTickets(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) {
      toast.error('Subject and message are required');
      return;
    }
    try {
      toast.success('Ticket created successfully');
      setShowCreate(false);
      setForm({ subject: '', message: '', priority: 'medium' });
      fetchTickets();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create ticket');
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    toast.success('Reply sent');
    setReplyText('');
  };

  const columns = [
    { key: 'subject', label: 'Subject', render: r => <span className="font-medium text-slate-800">{r.subject || r.title || '-'}</span> },
    { key: 'status', label: 'Status', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ticketStatusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status?.replace(/_/g, ' ')}</span> },
    { key: 'priority', label: 'Priority', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[r.priority] || 'bg-slate-100 text-slate-600'}`}>{r.priority}</span> },
    { key: 'date', label: 'Date', render: r => new Date(r.createdAt || r.date).toLocaleDateString() },
    { key: 'actions', label: 'Actions', render: r => (
      <button
        onClick={() => { setSelectedTicket(r); setShowConversation(true); }}
        className="flex items-center gap-1.5 px-3 py-1.5 text-orange-600 hover:bg-orange-50 rounded-lg text-xs font-medium transition-colors"
      >
        <FaEye /> View
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Support Tickets</h1>
          <p className="text-slate-500 text-sm">Get help and track your requests</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <FaPlus /> New Ticket
        </button>
      </div>

      {error ? <ErrorMessage message={error} onRetry={fetchTickets} /> : (
        <DataTable columns={columns} data={tickets} loading={loading} />
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowCreate(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Create Ticket</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
            </div>
            <form onSubmit={handleCreateTicket} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
                <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" placeholder="Brief subject" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" placeholder="Describe your issue..." required />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg">Submit Ticket</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showConversation && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowConversation(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">{selectedTicket.subject || selectedTicket.title}</h2>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${ticketStatusColors[selectedTicket.status] || 'bg-slate-100 text-slate-600'}`}>
                  {selectedTicket.status?.replace(/_/g, ' ')}
                </span>
              </div>
              <button onClick={() => setShowConversation(false)} className="p-1 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="bg-orange-50 rounded-xl p-4">
                <p className="text-xs text-orange-500 mb-1">You</p>
                <p className="text-sm text-slate-700">{selectedTicket.message || selectedTicket.description || 'No description'}</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(selectedTicket.createdAt || selectedTicket.date).toLocaleString()}</p>
              </div>
              {selectedTicket.conversation?.map((msg, i) => (
                <div key={i} className={`rounded-xl p-4 ${msg.isAdmin ? 'bg-slate-100 ml-8' : 'bg-orange-50 mr-8'}`}>
                  <p className="text-xs text-slate-500 mb-1">{msg.isAdmin ? 'Support Team' : 'You'}</p>
                  <p className="text-sm text-slate-700">{msg.text || msg.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(msg.createdAt || msg.date).toLocaleString()}</p>
                </div>
              )) || (
                <p className="text-sm text-slate-400 text-center py-4">No replies yet</p>
              )}
            </div>
            <div className="border-t border-slate-200 p-4 flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button onClick={handleSendReply} disabled={!replyText.trim()} className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white text-sm font-medium rounded-lg">
                <FaReply /> Send
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
