import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center shadow-inner">
                <span className="text-white text-xl font-bold tracking-tighter">JSM</span>
              </div>
              <div>
                <div className="font-bold text-lg tracking-tight text-white">Jai Santoshi Maa</div>
                <div className="text-[8px] text-slate-400 -mt-0.5 font-medium tracking-widest">INFRASTRUCTURE PVT. LTD.</div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Building dreams with integrity and excellence. Your trusted partner in real estate and infrastructure development.
            </p>
            <div className="flex gap-3">
              {['facebook', 'instagram', 'youtube', 'whatsapp'].map((social) => (
                <a key={social} href="#" className="w-9 h-9 bg-slate-800 hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors text-sm capitalize">
                  {social.charAt(0).toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home', path: '/' },
                { label: 'Projects', path: '/projects' },
                { label: 'Plot Map', path: '/plot-map' },
                { label: 'Calculators', path: '/calculators' },
                { label: 'Blogs', path: '/blogs' },
                { label: 'Contact', path: '/contact' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Our Services</h3>
            <ul className="space-y-2.5 text-sm">
              {['Residential Plots', 'Commercial Spaces', 'Villa Projects', 'Construction Services', 'Property Consultation', 'Legal Assistance'].map(service => (
                <li key={service}>
                  <Link to="/projects" className="hover:text-white transition-colors">{service}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <FaMapMarkerAlt className="mt-0.5 text-orange-400 shrink-0" />
                <span>123, Sector 12, Vashi, Navi Mumbai, Maharashtra 400703</span>
              </li>
              <li className="flex gap-3 items-center">
                <FaPhoneAlt className="text-orange-400 shrink-0" />
                <a href="tel:+919999999999" className="hover:text-white transition-colors">+91 99999 99999</a>
              </li>
              <li className="flex gap-3 items-center">
                <FaEnvelope className="text-orange-400 shrink-0" />
                <a href="mailto:info@jaisantoshimaa.com" className="hover:text-white transition-colors">info@jaisantoshimaa.com</a>
              </li>
              <li className="flex gap-3">
                <FaClock className="mt-0.5 text-orange-400 shrink-0" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM<br />Sunday: By Appointment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Jai Santoshi Maa Infrastructure Pvt. Ltd. All rights reserved.</p>
          <p>
            Powered by{' '}
            <a href="https://briskode.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition-colors">
              Briskode Technology
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
