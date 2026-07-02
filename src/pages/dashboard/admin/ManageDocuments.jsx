import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaUpload, FaCheckCircle, FaTrash, FaTimes } from 'react-icons/fa';
import { getDocuments, uploadDocument, verifyDocument, deleteDocument } from '../../../api/documents';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';

export default function ManageDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('other');
  const fileRef = useRef(null);

  const fetchDocuments = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getDocuments({ page: p, limit: 10 });
      setDocuments(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, [page]);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file || !title.trim()) {
      toast.error('Please provide a title and select a file');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('type', docType);
      await uploadDocument(formData);
      toast.success('Document uploaded');
      setShowUpload(false);
      setTitle('');
      setDocType('other');
      fileRef.current.value = '';
      fetchDocuments();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await verifyDocument(id);
      toast.success('Document verified');
      fetchDocuments();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Verification failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await deleteDocument(id);
      toast.success('Document deleted');
      fetchDocuments();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { key: 'title', label: 'Title', render: r => <span className="font-medium text-slate-800">{r.title}</span> },
    { key: 'type', label: 'Type', render: r => <span className="capitalize">{r.type || 'Other'}</span> },
    { key: 'customer', label: 'Customer', render: r => r.customer?.name || '-' },
    { key: 'plot', label: 'Plot', render: r => r.plot?.plotNumber ? `#${r.plot.plotNumber}` : '-' },
    { key: 'verified', label: 'Verified', render: r => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {r.verified ? 'Verified' : 'Pending'}
      </span>
    )},
    { key: 'actions', label: 'Actions', render: r => (
      <div className="flex items-center gap-2">
        {!r.verified && <button onClick={() => handleVerify(r._id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><FaCheckCircle /></button>}
        <button onClick={() => handleDelete(r._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><FaTrash /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Documents</h1>
          <p className="text-slate-500 text-sm">Upload and verify customer documents</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-xl transition-colors">
          <FaUpload /> Upload Document
        </button>
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => fetchDocuments()} /> : (
        <>
          <DataTable columns={columns} data={documents} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowUpload(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Upload Document</h2>
              <button onClick={() => setShowUpload(false)} className="p-1 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" placeholder="Document title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select value={docType} onChange={e => setDocType(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="other">Other</option>
                  <option value="aadhar">Aadhar Card</option>
                  <option value="pan">PAN Card</option>
                  <option value="agreement">Agreement</option>
                  <option value="receipt">Receipt</option>
                  <option value="identity">Identity Proof</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">File</label>
                <input ref={fileRef} type="file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowUpload(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={handleUpload} disabled={uploading} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white text-sm font-medium rounded-lg flex items-center gap-2">
                  {uploading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  Upload
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
