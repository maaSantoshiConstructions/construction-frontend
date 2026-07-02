import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { verifyEmail } from '../../api/auth';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowLeft } from 'react-icons/fa';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await verifyEmail(token);
        setStatus('success');
        setMessage(data?.message || 'Email verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err?.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center"
      >
        {status === 'loading' && (
          <>
            <FaSpinner className="text-blue-600 text-5xl mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold text-slate-800">Verifying your email...</h2>
            <p className="text-slate-500 text-sm mt-2">Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800">Email Verified!</h2>
            <p className="text-slate-600 text-sm mt-2">{message}</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              <FaArrowLeft /> Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800">Verification Failed</h2>
            <p className="text-slate-600 text-sm mt-2">{message}</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              <FaArrowLeft /> Go to Login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
