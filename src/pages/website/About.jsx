import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaUsers, FaProjectDiagram, FaAward, FaHandshake, FaBullseye, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const stats = [
  { value: 500, suffix: '+', label: 'Plots Sold', icon: FaCheckCircle },
  { value: 50, suffix: '+', label: 'Projects Delivered', icon: FaProjectDiagram },
  { value: 2000, suffix: '+', label: 'Happy Customers', icon: FaUsers },
  { value: 15, suffix: '+', label: 'Years Experience', icon: FaAward },
];

const team = [
  { name: 'Mr. Suresh Kumar', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { name: 'Mrs. Anjali Sharma', role: 'Director of Operations', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
  { name: 'Mr. Rajesh Verma', role: 'Head of Sales', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
  { name: 'Mr. Vikram Patel', role: 'Chief Financial Officer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' },
];

function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

function StatCounter({ value, suffix, label, icon: Icon }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Icon className="text-blue-600 text-xl" />
      </div>
      <p className="text-3xl sm:text-4xl font-bold text-blue-600">{count}{suffix}</p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">About Us</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">Building trust, shaping communities, and helping you find the perfect piece of land for over a decade.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <StatCounter {...stat} />
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2 mb-4">A Legacy of Trust & Excellence</h2>
              <div className="space-y-4 text-slate-600">
                <p>Founded in 2010, Maa Santoshi Constructions started with a simple mission — to make plot buying transparent, simple, and rewarding for every Indian.</p>
                <p>Over the past 15+ years, we have delivered over 50 projects and helped more than 2000 families find their dream plots across prime locations in India.</p>
                <p>Our commitment to quality, legal transparency, and customer satisfaction has made us one of the most trusted names in the real estate industry.</p>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600" alt="Office" className="rounded-2xl w-full h-80 object-cover" />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 hidden sm:block">
                <p className="text-2xl font-bold text-blue-600">15+</p>
                <p className="text-xs text-slate-500">Years of Excellence</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            { icon: FaBullseye, title: 'Our Mission', desc: 'To provide every Indian with a hassle-free, transparent, and rewarding plot buying experience powered by technology and trust.' },
            { icon: FaEye, title: 'Our Vision', desc: 'To become India\'s most trusted real estate platform, enabling smart land investments for millions of families.' },
            { icon: FaHandshake, title: 'Our Values', desc: 'Integrity, transparency, customer-first approach, and innovation are at the core of everything we do.' },
            { icon: FaAward, title: 'Our Promise', desc: '100% clear titles, RERA compliance, timely delivery, and complete legal support for every transaction.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <item.icon className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 mb-8">
          <div className="text-center mb-10">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Leadership</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-3 shadow-sm" />
                <h4 className="font-semibold text-slate-800 text-sm">{member.name}</h4>
                <p className="text-xs text-slate-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">Let us help you find the perfect plot. Our team is just a call away.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-full hover:bg-blue-50 transition-all">
              Contact Us
            </Link>
            <Link to="/projects" className="px-8 py-3 bg-white/10 text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all">
              View Projects
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
