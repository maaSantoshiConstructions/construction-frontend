import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBlog } from '../../api/blogs';
import { FaCalendarAlt, FaUser, FaArrowLeft, FaShareAlt, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlog = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getBlog(slug);
      setBlog(data?.data || data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={fetchBlog} />;
  if (!blog) return <ErrorMessage message="Blog not found" />;

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const shareUrl = window.location.href;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">
            <FaArrowLeft /> Back to Blogs
          </Link>
        </div>
      </div>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags?.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">{tag}</span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 leading-tight mb-4">{blog.title}</h1>
          <div className="flex items-center gap-5 text-sm text-slate-500">
            <span className="flex items-center gap-2"><FaUser className="text-slate-400" /> {blog.author}</span>
            <span className="flex items-center gap-2"><FaCalendarAlt className="text-slate-400" /> {formatDate(blog.date)}</span>
          </div>
        </div>

        <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-8">
          <img src={blog.image || 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200'} alt={blog.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
          {blog.content?.split('\n').map((para, i) => (
            <p key={i} className="mb-4">{para}</p>
          )) || (
            <>
              <p className="text-lg">In the ever-evolving landscape of Indian real estate, making informed decisions is more critical than ever. Whether you are a first-time buyer or a seasoned investor, understanding the market dynamics can significantly impact your returns.</p>
              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Why This Matters</h2>
              <p>The real estate sector has shown remarkable resilience and growth over the past decade. With urbanization accelerating and infrastructure improving across Tier-2 and Tier-3 cities, the opportunities for plot investment have expanded dramatically.</p>
              <p>Experts predict that the coming years will see a surge in demand for well-located residential plots, driven by the work-from-home culture and the desire for larger living spaces.</p>
              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Key Considerations</h2>
              <p>When evaluating a plot investment, several factors come into play — location accessibility, legal clearances, future development plans, and price trends. Doing thorough due diligence can save you from costly mistakes.</p>
              <p>At Maa Santoshi Constructions, we ensure complete transparency in every transaction, giving you peace of mind and a solid investment.</p>
            </>
          )}
        </div>

        <div className="border-t border-slate-100 mt-12 pt-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">Share this article:</span>
              <div className="flex gap-2">
                {[
                  { icon: FaFacebook, href: `https://facebook.com/sharer.php?u=${shareUrl}`, color: 'hover:bg-blue-100 hover:text-blue-600' },
                  { icon: FaTwitter, href: `https://twitter.com/intent/tweet?url=${shareUrl}`, color: 'hover:bg-sky-100 hover:text-sky-500' },
                  { icon: FaLinkedin, href: `https://linkedin.com/sharing/share-offsite/?url=${shareUrl}`, color: 'hover:bg-blue-100 hover:text-blue-700' },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className={`w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 ${s.color} transition-colors`}>
                    <s.icon />
                  </a>
                ))}
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <FaShareAlt /> Copy Link
            </button>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
