import { FaMapMarkerAlt } from 'react-icons/fa';

export default function PlotInfoCard({ project, plot }) {
  const fields = [
    ['Project', project?.name || '—'],
    ['Plot Number', plot?.plotNumber ? `#${plot.plotNumber}` : '—'],
    ['Size', plot?.size ? `${plot.size} sq.ft` : '—'],
    ['Facing', plot?.facing || '—'],
    ['Road Width', plot?.roadWidth ? `${plot.roadWidth} ft` : '—'],
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
          <FaMapMarkerAlt />
        </div>
        <h3 className="font-bold text-slate-800 text-sm">Plot Details</h3>
      </div>
      <div className="space-y-3 text-sm">
        {fields.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3">
            <span className="text-slate-500 shrink-0">{label}</span>
            <span className="text-slate-800 font-medium text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
