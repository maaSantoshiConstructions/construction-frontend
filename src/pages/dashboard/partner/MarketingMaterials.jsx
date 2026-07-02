import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaDownload, FaFilePdf, FaImage, FaShareAlt } from 'react-icons/fa';

const brochures = [
  { id: 1, name: 'Project Brochure - Luxury Villas', file: '/brochures/luxury-villas.pdf', size: '2.4 MB' },
  { id: 2, name: 'Project Brochure - Premium Apartments', file: '/brochures/premium-apartments.pdf', size: '1.8 MB' },
  { id: 3, name: 'Company Overview', file: '/brochures/company-overview.pdf', size: '3.1 MB' },
  { id: 4, name: 'Investment Guide', file: '/brochures/investment-guide.pdf', size: '1.2 MB' },
];

const logos = [
  { id: 1, name: 'Company Logo - Full Color', file: '/logos/logo-full.png', type: 'PNG' },
  { id: 2, name: 'Company Logo - White', file: '/logos/logo-white.png', type: 'PNG' },
  { id: 3, name: 'Company Logo - Icon Only', file: '/logos/logo-icon.png', type: 'PNG' },
];

const socialTemplates = [
  { id: 1, name: 'Instagram Post - New Launch', file: '/social/ig-new-launch.jpg', platform: 'Instagram' },
  { id: 2, name: 'Facebook Post - Testimonial', file: '/social/fb-testimonial.jpg', platform: 'Facebook' },
  { id: 3, name: 'WhatsApp Status - Offer', file: '/social/wa-offer.jpg', platform: 'WhatsApp' },
  { id: 4, name: 'LinkedIn Post - Milestone', file: '/social/li-milestone.jpg', platform: 'LinkedIn' },
];

function MaterialCard({ icon: Icon, title, subtitle, onDownload }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start justify-between hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <Icon className="text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <button
        onClick={onDownload}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <FaDownload /> Download
      </button>
    </motion.div>
  );
}

export default function MarketingMaterials() {
  const handleDownload = (item) => {
    toast.success(`Downloading ${item.name}...`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Marketing Materials</h1>
        <p className="text-slate-500 text-sm mt-1">Download brochures, logos, and social media templates</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <FaFilePdf className="text-red-500" /> Brochures
        </h2>
        <div className="grid gap-3">
          {brochures.map(b => (
            <MaterialCard key={b.id} icon={FaFilePdf} title={b.name} subtitle={`PDF • ${b.size}`} onDownload={() => handleDownload(b)} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <FaImage className="text-purple-500" /> Company Logos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {logos.map(l => (
            <MaterialCard key={l.id} icon={FaImage} title={l.name} subtitle={l.type} onDownload={() => handleDownload(l)} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <FaShareAlt className="text-green-500" /> Social Media Templates
        </h2>
        <div className="grid gap-3">
          {socialTemplates.map(s => (
            <MaterialCard key={s.id} icon={FaShareAlt} title={s.name} subtitle={s.platform} onDownload={() => handleDownload(s)} />
          ))}
        </div>
      </section>
    </div>
  );
}
