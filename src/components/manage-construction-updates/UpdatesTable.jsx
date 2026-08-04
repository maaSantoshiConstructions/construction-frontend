import React from 'react';
import ErrorMessage from '../common/ErrorMessage';

const stageColorMap = {
  planning: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  foundation: 'bg-amber-50 text-amber-700 border-amber-100',
  structure: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  roofing: 'bg-purple-50 text-purple-700 border-purple-100',
  finishing: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

export default function UpdatesTable({
  updates = [],
  loading = false,
  error = null,
  page = 1,
  totalPages = 1,
  setPage,
  openEdit,
  handleDelete,
  openCreate,
  fetchUpdates,
}) {
  return (
    <>
      {error ? (
        <ErrorMessage message={error} onRetry={fetchUpdates} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-400 text-xs font-semibold">
              Loading updates...
            </div>
          ) : updates.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-4xl mb-3">👷</div>
              <p className="text-slate-500 text-sm mb-4 font-medium">
                No construction updates yet.
              </p>
              <button
                onClick={openCreate}
                className="cta-btn text-xs font-bold px-5 py-2.5 rounded-xl border-0 cursor-pointer shadow-md transition-all inline-block"
              >
                + Add First Update
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {['Title', 'Project', 'Stage', 'Progress', 'Date', 'Actions'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {updates.map((r) => (
                    <tr
                      key={r._id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-xs font-bold text-slate-900">
                        {r.title}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 font-medium">
                        {r.project?.name || '-'}
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        {r.stage ? (
                          <span
                            className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                              stageColorMap[r.stage?.toLowerCase()] ||
                              'bg-indigo-50 text-indigo-700 border-indigo-100'
                            }`}
                          >
                            {r.stage.charAt(0).toUpperCase() + r.stage.slice(1)}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                (r.progressPercent || 0) >= 80 ? 'bg-emerald-600' : 'bg-indigo-600'
                              }`}
                              style={{ width: `${r.progressPercent || 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-900">
                            {r.progressPercent || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 font-medium">
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString('en-IN')
                          : '-'}
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(r)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-indigo-600 text-xs font-semibold hover:bg-indigo-50 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(r._id)}
                            className="px-3 py-1.5 rounded-lg border border-red-100 bg-red-50/50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-slate-100">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8.5 h-8.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                    p === page
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
