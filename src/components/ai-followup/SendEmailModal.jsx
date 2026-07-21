import React, { useState } from 'react';
import { FaPaperclip, FaTimes, FaEnvelope, FaSpinner, FaFilePdf, FaTrash } from 'react-icons/fa';

export default function SendEmailModal({
  isOpen,
  onClose,
  lead,
  step,
  sequenceName,
  onSendEmail,
}) {
  const [subject, setSubject] = useState(
    step ? `[Follow-up] ${sequenceName} - ${step.time}` : 'Property Information & Updates'
  );
  const [message, setMessage] = useState(step ? step.message : '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [presetFile, setPresetFile] = useState('brochure');
  const [sending, setSending] = useState(false);

  if (!isOpen || !lead) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSending(true);
      await onSendEmail({
        subject,
        message,
        selectedFile,
        presetFile: selectedFile ? 'none' : presetFile,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 transform transition-all">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <FaEnvelope />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Compose & Attach Document</h3>
              <p className="text-xs text-slate-400">Send email directly to recipient via Nodemailer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg transition"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Recipient Details */}
          <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-800 font-medium">To: </span>
              <span className="text-sm font-bold text-slate-800">{lead.name}</span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-200/50 text-amber-900 rounded-lg">
              {lead.email}
            </span>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Subject Line
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
              placeholder="Email Subject..."
            />
          </div>

          {/* Message Body */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Message
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition resize-none"
              placeholder="Write your email message..."
            />
          </div>

          {/* Manual Attachment Section */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FaPaperclip className="text-slate-500" /> Manual File Attachment
              </label>
              <span className="text-[11px] text-slate-400 font-medium">PDF, DOC, PNG, JPG (Max 5MB)</span>
            </div>

            {/* If custom file selected */}
            {selectedFile ? (
              <div className="flex items-center justify-between bg-white border border-emerald-300 rounded-xl p-3 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg flex-shrink-0">
                    <FaFilePdf />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB • Custom Attached File</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition text-sm flex-shrink-0"
                  title="Remove attached file"
                >
                  <FaTrash />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* File Upload Button */}
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-amber-500 bg-white hover:bg-amber-50/40 py-3.5 px-4 rounded-xl cursor-pointer transition text-xs font-bold text-slate-700">
                  <FaPaperclip className="text-amber-600 text-sm" />
                  <span>Choose File from Computer</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Preset Document Option */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Or select system document:</span>
                  <select
                    value={presetFile}
                    onChange={(e) => setPresetFile(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none"
                  >
                    <option value="brochure">Project Brochure & Pricing PDF</option>
                    <option value="summary">Property Summary & Payment Plan PDF</option>
                    <option value="none">No Document Attachment</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition flex items-center gap-2 disabled:opacity-50"
            >
              {sending ? (
                <>
                  <FaSpinner className="animate-spin" /> Sending Email...
                </>
              ) : (
                <>
                  <FaEnvelope /> Send Email {selectedFile || presetFile !== 'none' ? 'With Attachment' : ''}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
