import React from 'react';
import {
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaCompass,
  FaRoad
} from 'react-icons/fa';
import DataTable from '../common/DataTable';
import Pagination from '../common/Pagination';

export default function PlotsTable({
  plots,
  loading,
  openEdit,
  handleDelete,
  page,
  totalPages,
  onPageChange
}) {
  const columns = [
    {
      key: 'plotNumber',
      label: 'Plot #',
      render: r => (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-[14px] tracking-tight">#{r.plotNumber}</span>
            {r.corner && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-full uppercase tracking-wide">
                Corner
              </span>
            )}
          </div>
          {r.coordinates?.lat && r.coordinates?.lng && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${r.coordinates.lat},${r.coordinates.lng}`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-amber-600 hover:text-amber-700 flex items-center gap-1 font-semibold transition-colors duration-200"
            >
              <FaMapMarkerAlt className="text-[10px]" /> View Map
            </a>
          )}
        </div>
      )
    },
    {
      key: 'project',
      label: 'Project Details',
      render: r => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-slate-900 text-[14px] leading-snug">{r.project?.name || '-'}</span>
          {r.project?.type && (
            <span className="text-[12px] text-slate-400 capitalize font-medium">
              {r.project.type.replace(/_/g, ' ')}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'size',
      label: 'Dimensions & Size',
      render: r => (
        <div className="flex flex-col gap-0.5">
          <div className="font-semibold text-slate-900 text-[14px] flex items-center gap-1.5">
            <FaRulerCombined className="text-[11px] text-slate-400 shrink-0" />
            <span>{r.size ? `${r.size.toLocaleString('en-IN')} sq.ft` : '-'}</span>
          </div>
          {r.length && r.width && (
            <span className="text-[12px] text-slate-400 font-medium pl-5">
              {r.length} × {r.width} ft
            </span>
          )}
        </div>
      )
    },
    {
      key: 'facing',
      label: 'Facing & Road',
      render: r => (
        <div className="flex flex-col gap-0.5">
          <div className="font-semibold text-slate-900 text-[14px] flex items-center gap-1.5">
            <FaCompass className="text-[11px] text-slate-400 shrink-0" />
            <span>{r.facing || '-'}</span>
          </div>
          {r.roadWidth && (
            <span className="text-[12px] text-slate-400 font-medium pl-5 flex items-center gap-1">
              <FaRoad className="text-[10px]" /> {r.roadWidth} ft road
            </span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Inventory Status',
      render: r => {
        const config = {
          available: {
            bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            dot: 'bg-emerald-500',
            label: 'AVAILABLE'
          },
          reserved: {
            bg: 'bg-amber-50 text-amber-700 border-amber-200',
            dot: 'bg-amber-500',
            label: 'RESERVED'
          },
          sold: {
            bg: 'bg-rose-50 text-rose-700 border-rose-200',
            dot: 'bg-rose-500',
            label: 'SOLD'
          },
          blocked: {
            bg: 'bg-slate-100 text-slate-600 border-slate-200',
            dot: 'bg-slate-400',
            label: 'BLOCKED'
          },
        };
        const st = config[r.status] || config.available;
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border ${st.bg}`}>
            <span className={`w-2 h-2 rounded-full ${st.dot}`} />
            {st.label}
          </span>
        );
      }
    },
    {
      key: 'price',
      label: 'Pricing Details',
      render: r => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-900 text-[14px]">
            {r.price ? `₹${r.price.toLocaleString('en-IN')}` : '-'}
          </span>
          {r.price && r.size && (
            <span className="text-[12px] text-slate-400 font-medium">
              ₹{Math.round(r.price / r.size).toLocaleString('en-IN')}/sq.ft
            </span>
          )}
        </div>
      )
    },
    {
      key: 'owner',
      label: 'Owner / Booking',
      render: r => r.owner ? (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-slate-900 text-[14px]">{r.owner.name}</span>
          <span className="text-[12px] text-slate-400 font-medium">{r.owner.phone || r.owner.email}</span>
        </div>
      ) : (
        <span className="inline-flex items-center px-2.5 py-1 bg-slate-50 text-slate-400 text-[12px] font-semibold rounded-lg border border-slate-100">Not Assigned</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: r => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(r)}
            className="w-8 h-8 flex items-center justify-center text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-full border border-transparent hover:border-amber-200 transition-all duration-200"
            title="Edit Plot"
          >
            <FaEdit className="text-[13px]" />
          </button>
          <button
            onClick={() => handleDelete(r._id)}
            className="w-8 h-8 flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-full border border-transparent hover:border-rose-200 transition-all duration-200"
            title="Delete Plot"
          >
            <FaTrash className="text-[12px]" />
          </button>
        </div>
      )
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={plots} loading={loading} />
      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
}
