import DataTable from '../common/DataTable';
import { fmtDate } from '../../utils/formatters';

export default function CustomerSiteVisits({ siteVisits = [] }) {
  const siteVisitColumns = [
    {
      key: 'visitDate',
      label: 'Visit Date',
      render: (r) => <span className="text-xs text-slate-700 font-medium">{fmtDate(r.visitDate || r.date || r.createdAt)}</span>,
    },
    {
      key: 'project',
      label: 'Project',
      render: (r) => <span className="text-xs text-slate-800 font-semibold">{r.project?.name || '—'}</span>,
    },
    {
      key: 'plot',
      label: 'Plot Number',
      render: (r) => <span className="text-xs text-slate-800 font-bold">{r.plot?.plotNumber ? `Plot #${r.plot.plotNumber}` : '—'}</span>,
    },
    {
      key: 'status',
      label: 'Visit Status',
      render: (r) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700 capitalize">
          {r.status || 'Scheduled'}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
        Site Visits
      </h3>

      {siteVisits.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
          No site visits recorded for this customer.
        </div>
      ) : (
        <DataTable columns={siteVisitColumns} data={siteVisits} loading={false} />
      )}
    </div>
  );
}
