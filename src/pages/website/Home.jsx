import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjects } from '../../api/projects';
import { FaArrowRight, FaMapMarkerAlt, FaShieldAlt, FaRobot, FaSatelliteDish, FaCheckCircle, FaHome, FaHandshake, FaChartLine, FaBuilding, FaClock, FaStar } from 'react-icons/fa';

const features = [
  { icon: FaShieldAlt, title: 'RERA Registered', description: 'All projects are RERA approved for complete transparency' },
  { icon: FaRobot, title: '24x7 AI Support', description: 'Get instant answers anytime with our AI assistant' },
  { icon: FaSatelliteDish, title: 'Live Plot Tracking', description: 'Track construction progress in real-time' },
  { icon: FaCheckCircle, title: 'Legal Clearance', description: '100% clear titles and hassle-free documentation' },
  { icon: FaHome, title: 'Prime Locations', description: 'Handpicked plots in the fastest-growing areas' },
  { icon: FaHandshake, title: 'Easy Financing', description: 'Tie-ups with all major banks for easy loans' },
  { icon: FaChartLine, title: 'High ROI', description: 'Proven track record of excellent investment returns' },
  { icon: FaBuilding, title: 'Modern Amenities', description: 'Wide roads, parks, drainage & streetlights included' },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await getProjects({ limit: 3 });
        setProjects(data?.data || []);
      } catch {
        setProjects([
          { _id: '1', name: 'Green Valley Estate', slug: 'green-valley-estate', location: 'Sector 45, Gurugram', price: '₹35 Lakhs', status: 'available', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600' },
          { _id: '2', name: 'Lakeview Residency', slug: 'lakeview-residency', location: 'Whitefield, Bangalore', price: '₹52 Lakhs', status: 'reserved', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600' },
          { _id: '3', name: 'Golden Palm Enclave', slug: 'golden-palm-enclave', location: 'Gachibowli, Hyderabad', price: '₹28 Lakhs', status: 'sold', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const statusColors = { available: 'bg-green-100 text-green-700', reserved: 'bg-yellow-100 text-yellow-700', sold: 'bg-red-100 text-red-700' };

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-blue-900/70 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your Dream Plot.
              <span className="block text-blue-400">Intelligent Buying.</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-lg">
              AI-powered platform to find, compare, and book the perfect plot — with complete transparency.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/projects" className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all flex items-center gap-2 text-sm sm:text-base shadow-lg hover:shadow-blue-500/25">
                Explore Projects <FaArrowRight />
              </Link>
              <Link to="/ai-recommendation" className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full backdrop-blur-sm transition-all border border-white/20 text-sm sm:text-base">
                AI Recommendation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FaShieldAlt, label: 'RERA Registered', sub: '100% Compliant' },
              { icon: FaRobot, label: '24x7 AI Support', sub: 'Instant Assistance' },
              { icon: FaSatelliteDish, label: 'Live Plot Tracking', sub: 'Real-time Updates' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-blue-600 text-lg" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <motion.section {...fadeUp} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Executive Summary</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">Why Choose Maa Santoshi Constructions?</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">We combine cutting-edge technology with decades of real estate expertise to deliver the best plot buying experience.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '500+', label: 'Plots Sold' },
              { value: '50+', label: 'Projects' },
              { value: '2000+', label: 'Happy Customers' },
              { value: '15+', label: 'Years Experience' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-gradient-to-b from-blue-50 to-white border border-blue-100">
                <p className="text-3xl sm:text-4xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-slate-600 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Featured Projects</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">Explore Top Projects</h2>
            </div>
            <Link to="/projects" className="hidden sm:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All <FaArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[project.status] || 'bg-slate-100 text-slate-600'}`}>
                    {project.status}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{project.name}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mb-3"><FaMapMarkerAlt /> {project.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-bold text-lg">{project.price}</span>
                    <Link to={`/projects/${project.slug}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                      Details <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/projects" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All Projects <FaArrowRight />
            </Link>
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Why Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">Everything You Need</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <feat.icon className="text-blue-600 text-xl" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{feat.title}</h3>
                <p className="text-sm text-slate-500">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Find Your Dream Plot?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">Get personalized plot recommendations based on your budget and preferences — powered by AI.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/ai-recommendation" className="px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-full hover:bg-blue-50 transition-all shadow-lg">
              Get AI Recommendation
            </Link>
            <Link to="/contact" className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all">
              Contact Sales
            </Link>
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-50">
            {['Times of India', 'Hindustan Times', 'Economic Times', 'Moneycontrol', 'NDTV Profit'].map((pub, i) => (
              <p key={i} className="text-slate-400 font-bold text-lg text-center tracking-tight">{pub}</p>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
