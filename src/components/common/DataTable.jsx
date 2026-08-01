import { motion } from 'framer-motion';
import { FaSort } from 'react-icons/fa';
import EmptyState from './EmptyState';

function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '16px 20px' }}>
          <div className="h-4 bg-slate-100 rounded-lg animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

function MobileSkeletonCard({ cols }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {cols.map((col, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <div className="h-3 bg-slate-100 rounded animate-pulse" style={{ width: '30%' }} />
          <div className="h-3 bg-slate-100 rounded animate-pulse" style={{ width: '45%' }} />
        </div>
      ))}
    </div>
  );
}

export default function DataTable({ columns = [], data = [], loading = false }) {
  // Columns to hide on mobile (show only the most important ones in the card header area)
  // All columns are shown in mobile card layout, just stacked vertically

  if (loading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden sm:block" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ overflowX: 'auto', minHeight: '280px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  {columns.map(col => (
                    <th key={col.key} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
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
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {columns.map(col => (
              <span key={col.key} style={{ flex: 1 }}>{col.label}</span>
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
      <div className="hidden sm:block" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto', minHeight: '260px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {columns.map(col => (
                  <th key={col.key} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {col.label}
                      <FaSort style={{ color: '#cbd5e1', fontSize: '10px', flexShrink: 0 }} />
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
                  style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#fafbfc'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  {columns.map(col => (
                    <td key={col.key} style={{ padding: '16px 20px', fontSize: '14px', color: '#334155', verticalAlign: 'middle' }}>
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
          // Split columns: first col as "header", actions as footer, rest as key-value rows
          const [headerCol, ...rest] = columns;
          const actionsCol = rest.find(c => c.key === 'actions');
          const bodyColumns = rest.filter(c => c.key !== 'actions');

          return (
            <motion.div
              key={row._id || row.id || i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {/* Card Header */}
              <div style={{
                background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}>
                <div style={{ fontSize: '14px' }}>
                  {headerCol?.render ? headerCol.render(row, i) : row[headerCol?.key]}
                </div>
                {actionsCol && (
                  <div>{actionsCol.render ? actionsCol.render(row, i) : null}</div>
                )}
              </div>

              {/* Card Body: key-value pairs in a 2-col grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0',
              }}>
                {bodyColumns.map((col, idx) => (
                  <div
                    key={col.key}
                    style={{
                      padding: '10px 14px',
                      borderBottom: idx < bodyColumns.length - 2 ? '1px solid #f1f5f9' : 'none',
                      borderRight: idx % 2 === 0 ? '1px solid #f1f5f9' : 'none',
                    }}
                  >
                    <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                      {col.label}
                    </p>
                    <div style={{ fontSize: '13px', color: '#334155' }}>
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
