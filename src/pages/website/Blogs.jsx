import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBlogs } from '../../api/blogs';
import { FaCalendarAlt, FaUser, FaArrowRight, FaSearch, FaTimes } from 'react-icons/fa';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      const { data } = await getBlogs(params);
      setBlogs(data?.data || []);
      setTotalPages(data?.totalPages || data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load blogs');
      setBlogs([
        { _id: '1', title: 'Why Real Estate is the Best Investment in 2026', slug: 'real-estate-best-investment-2026', excerpt: 'Discover why property investment continues to outperform other asset classes with insights from industry experts.', image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600', author: 'Rahul Sharma', date: '2026-06-15', tags: ['investment'] },
        { _id: '2', title: 'Complete Guide to Buying Your First Plot', slug: 'complete-guide-buying-first-plot', excerpt: 'Everything you need to know before making your first land purchase — from budgeting to legal checks.', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600', author: 'Priya Patel', date: '2026-06-10', tags: ['guide'] },
        { _id: '3', title: 'Top 5 Locations for Plot Investment in 2026', slug: 'top-5-locations-plot-investment-2026', excerpt: 'Our experts reveal the most promising areas for plot investment based on growth, connectivity, and ROI.', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600', author: 'Amit Verma', date: '2026-06-05', tags: ['investment', 'locations'] },
        { _id: '4', title: 'Understanding RERA and Its Benefits', slug: 'understanding-rera-benefits', excerpt: 'A comprehensive overview of RERA regulations and how they protect plot buyers in India.', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600', author: 'Neha Gupta', date: '2026-05-28', tags: ['legal'] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs();
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) return <Loader />;
  if (error && blogs.length === 0) return <ErrorMessage message={error} onRetry={fetchBlogs} />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-orange-600 to-amber-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Our Blogs</h1>
            <p className="text-orange-100">Insights, guides, and news about real estate</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm p-4 mb-8">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search blogs..."
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
              />
            </div>
          </form>
        </motion.div>

        {blogs.length === 0 ? (
          <EmptyState title="No blogs found" description="Try a different search term." />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
              {blogs.map((blog, i) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                >
                  <Link to={`/blogs/${blog.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img src={blog.image || 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600'} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  </Link>
                  <div className="p-5">
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1"><FaUser /> {blog.author}</span>
                      <span className="flex items-center gap-1"><FaCalendarAlt /> {formatDate(blog.date)}</span>
                    </div>
                    <Link to={`/blogs/${blog.slug}`}>
                      <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 hover:text-orange-600 transition-colors">{blog.title}</h3>
                    </Link>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{blog.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags?.map((tag, ti) => (
                        <span key={ti} className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">{tag}</span>
                      ))}
                    </div>
                    <Link to={`/blogs/${blog.slug}`} className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1">
                      Read More <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pb-16">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-orange-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
