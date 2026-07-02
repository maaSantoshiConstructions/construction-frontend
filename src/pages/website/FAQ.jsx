import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFAQs } from '../../api/faqs';
import { FaChevronDown, FaQuestionCircle, FaSearch } from 'react-icons/fa';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const fetchFAQs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getFAQs();
      setFaqs(data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load FAQs');
      setFaqs([
        { _id: '1', question: 'What documents do I need to buy a plot?', answer: 'You need identity proof (Aadhaar/PAN), address proof, income documents for loan (if applicable), and the property documents for verification.', category: 'Buying Process' },
        { _id: '2', question: 'Is the property RERA registered?', answer: 'Yes, all our projects are RERA registered and compliant with all regulatory requirements. You can verify the RERA number on the project page.', category: 'Legal' },
        { _id: '3', question: 'What is the payment process?', answer: 'We offer flexible payment plans including lump sum, construction-linked plans, and bank financing with all major banks.', category: 'Payments' },
        { _id: '4', question: 'Can I visit the site before booking?', answer: 'Absolutely! We encourage site visits. You can book a visit through our website or call us to schedule a convenient time.', category: 'Buying Process' },
        { _id: '5', question: 'Do you provide home loan assistance?', answer: 'Yes, we have tie-ups with all major banks and NBFCs. Our team will help you with the loan application process.', category: 'Payments' },
        { _id: '6', question: 'What is the cancellation policy?', answer: 'Cancellation terms are mentioned in the buyer agreement. Generally, a cancellation fee applies as per RERA guidelines.', category: 'Legal' },
        { _id: '7', question: 'How does the AI recommendation work?', answer: 'Our AI analyzes your budget, location preference, and requirements to suggest the best-matching plots from our inventory.', category: 'Technology' },
        { _id: '8', question: 'Is there a warranty on the plot?', answer: 'We provide clear title warranty and ensure all legal compliances. The plot comes with all necessary approvals and clearances.', category: 'Legal' },
        { _id: '9', question: 'What amenities are included?', answer: 'Amenities vary by project but typically include wide roads, parks, streetlights, drainage, water supply, and security.', category: 'Projects' },
        { _id: '10', question: 'Can I resell my plot?', answer: 'Yes, you can resell your plot at any time. We also offer resale assistance through our platform.', category: 'Buying Process' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const categories = ['all', ...new Set(faqs.map((f) => f.category).filter(Boolean))];

  const filteredFaqs = faqs.filter((faq) => {
    if (activeCategory !== 'all' && faq.category !== activeCategory) return false;
    if (search && !faq.question.toLowerCase().includes(search.toLowerCase()) && !faq.answer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <Loader />;
  if (error && faqs.length === 0) return <ErrorMessage message={error} onRetry={fetchFAQs} />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-orange-600 to-amber-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FaQuestionCircle className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Frequently Asked Questions</h1>
            <p className="text-orange-100">Find answers to common questions about our services</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
            />
          </div>
        </motion.div>

        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeCategory === cat ? 'bg-orange-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredFaqs.length === 0 ? (
          <EmptyState title="No FAQs found" description="Try a different search or category." />
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => (
              <motion.div
                key={faq._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100"
              >
                <button
                  onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-medium text-slate-800 text-sm sm:text-base pr-4">{faq.question}</span>
                  <motion.div animate={{ rotate: openId === faq._id ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
                    <FaChevronDown className="text-slate-400 text-sm" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openId === faq._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                        <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                        {faq.category && (
                          <span className="inline-block mt-3 px-2.5 py-0.5 bg-orange-50 text-orange-600 rounded-full text-xs capitalize">
                            {faq.category}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
