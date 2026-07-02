import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const btnClass = (active = false) =>
    `w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
      active ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
    }`;

  const arrowBtnClass = (disabled) =>
    `w-9 h-9 flex items-center justify-center rounded-full text-sm transition-colors ${
      disabled ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div className="flex items-center justify-center gap-1.5 py-4">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={arrowBtnClass(page <= 1)}
      >
        <FaChevronLeft className="text-xs" />
      </button>

      {getPageNumbers().map(num => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={btnClass(num === page)}
        >
          {num}
        </button>
      ))}

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={arrowBtnClass(page >= totalPages)}
      >
        <FaChevronRight className="text-xs" />
      </button>
    </div>
  );
}
