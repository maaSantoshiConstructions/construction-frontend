import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl sm:text-9xl font-bold text-orange-600/20 mb-4 select-none"
        >
          404
        </motion.div>

        <div className="relative inline-block mb-8">
          <div className="w-40 h-40 mx-auto bg-orange-50 rounded-full flex items-center justify-center">
            <FaHome className="text-6xl text-orange-300" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-400 font-bold text-lg">?</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">Page Not Found</h1>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-full transition-colors shadow-sm"
          >
            <FaArrowLeft /> Back to Home
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-600 hover:bg-white font-medium rounded-full transition-colors"
          >
            Browse Projects
          </Link>
        </div>

        <div className="mt-10 text-sm text-slate-400">
          <p>Looking for something? Try these pages:</p>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            {[
              { to: '/projects', label: 'Projects' },
              { to: '/blogs', label: 'Blogs' },
              { to: '/contact', label: 'Contact' },
              { to: '/faq', label: 'FAQ' },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="text-orange-600 hover:text-orange-700 underline underline-offset-2">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
