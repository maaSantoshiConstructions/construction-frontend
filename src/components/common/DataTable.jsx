import React from 'react';
import { motion } from 'framer-motion';
import { LuArrowUpDown } from 'react-icons/lu';
import EmptyState from './EmptyState';

function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div
            className="h-4 bg-slate-100 rounded-lg animate-pulse"
            style={{ width: `${60 + Math.random() * 40}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

function MobileSkeletonCard({ cols }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2.5">
      {cols.map((col, i) => (
        <div key={i} className="flex justify-between items-center gap-2">
          <div className="h-3 bg-slate-100 rounded animate-pulse w-[30%]" />
          <div className="h-3 bg-slate-100 rounded animate-pulse w-[45%]" />
        </div>
      ))}
    </div>
  );
}

export default function DataTable({ columns = [], data = [], loading = false }) {
  if (loading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="overflow-x-auto min-h-[280px]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} cols={columns.length} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Mobile skeleton */}
        <div className="flex sm:hidden flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <MobileSkeletonCard key={i} cols={columns} />
          ))}
        </div>
      </>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {columns.map((col) => (
              <span key={col.key} className="flex-1">{col.label}</span>
            ))}
          </div>
        </div>
        <EmptyState title="No records found" description="There are no entries to display in this table." />
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop Table (sm and above) ── */}
      <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="overflow-x-auto min-h-[260px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {col.label}
                      <LuArrowUpDown className="text-slate-300 text-xs shrink-0" />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <motion.tr
                  key={row._id || row.id || i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4 text-sm text-slate-700 align-middle">
                      {col.render ? col.render(row, i) : row[col.key]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Cards (below sm) ── */}
      <div className="flex sm:hidden flex-col gap-3">
        {data.map((row, i) => {
          const [headerCol, ...rest] = columns;
          const actionsCol = rest.find((c) => c.key === 'actions');
          const bodyColumns = rest.filter((c) => c.key !== 'actions');

          return (
            <motion.div
              key={row._id || row.id || i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs"
            >
              {/* Card Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-slate-800">
                  {headerCol?.render ? headerCol.render(row, i) : row[headerCol?.key]}
                </div>
                {actionsCol && (
                  <div>{actionsCol.render ? actionsCol.render(row, i) : null}</div>
                )}
              </div>

              {/* Card Body */}
              <div className="grid grid-cols-2">
                {bodyColumns.map((col, idx) => (
                  <div
                    key={col.key}
                    className={`p-3.5 ${
                      idx < bodyColumns.length - 2 ? 'border-b border-slate-100' : ''
                    } ${idx % 2 === 0 ? 'border-r border-slate-100' : ''}`}
                  >
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {col.label}
                    </p>
                    <div className="text-xs text-slate-700">
                      {col.render ? col.render(row, i) : (row[col.key] ?? '—')}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
