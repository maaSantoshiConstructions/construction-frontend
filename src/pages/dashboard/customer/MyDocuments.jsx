import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaDownload, FaEye, FaUpload, FaFileAlt, FaTimes } from 'react-icons/fa';
import { getMyDocuments, uploadDocument } from '../../../api/documents';
import ErrorMessage from '../../../components/common/ErrorMessage';

const docTypeColors = {
  agreement: 'bg-orange-100 text-orange-700',
  kyc: 'bg-amber-100 text-amber-700',
  payment_receipt: 'bg-green-100 text-green-700',
  identification: 'bg-amber-100 text-amber-700',
  other: 'bg-slate-100 text-slate-600',
};

const verificationColors = {
  pending: 'bg-amber-100 text-amber-700',
  verified: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function MyDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', type: 'other' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getMyDocuments();
      setDocuments(res?.data || res || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !uploadForm.title.trim()) {
      toast.error('Please provide a title and select a file');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', uploadForm.title);
      formData.append('type', uploadForm.type);
      await uploadDocument(formData);
      toast.success('Document uploaded successfully');
      setShowUpload(false);
      setUploadForm({ title: '', type: 'other' });
      setFile(null);
      fetchDocuments();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleView = (doc) => {
    if (doc.fileUrl || doc.url) {
      window.open(doc.fileUrl || doc.url, '_blank');
    } else {
      toast.error('File not available');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Documents</h1>
          <p className="text-slate-500 text-sm">Manage your property documents</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <FaUpload /> Upload Document
        </button>
      </div>

      {error ? <ErrorMessage message={error} onRetry={fetchDocuments} /> : loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
              <div className="h-5 w-48 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-32 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FaFileAlt className="text-slate-300 text-4xl mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No documents yet</p>
          <p className="text-slate-400 text-sm mt-1">Upload your documents to keep them organized</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc, i) => (
            <motion.div
              key={doc._id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <FaFileAlt className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{doc.title || doc.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${docTypeColors[doc.type] || 'bg-slate-100 text-slate-600'}`}>
                      {doc.type?.replace(/_/g, ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${verificationColors[doc.verificationStatus || doc.status] || 'bg-slate-100 text-slate-600'}`}>
                      {doc.verificationStatus || doc.status || 'unknown'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleView(doc)} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg" title="View"><FaEye /></button>
                <button onClick={() => handleView(doc)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Download"><FaDownload /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowUpload(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Upload Document</h2>
              <button onClick={() => setShowUpload(false)} className="p-1 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
            </div>
            <form onSubmit={handleUpload} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input type="text" value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" placeholder="Document title" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select value={uploadForm.type} onChange={e => setUploadForm({ ...uploadForm, type: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="agreement">Agreement</option>
                  <option value="kyc">KYC</option>
                  <option value="payment_receipt">Payment Receipt</option>
                  <option value="identification">Identification</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">File *</label>
                <input type="file" onChange={e => setFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" required />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowUpload(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={uploading} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white text-sm font-medium rounded-lg">{uploading ? 'Uploading...' : 'Upload'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
