/**
 * Currency & Date Formatting Utilities
 */

/**
 * Formats a number into Indian currency format (e.g. 1,50,000)
 * @param {number|string} n 
 * @param {string} fallback 
 * @returns {string}
 */
export const formatCurrency = (n, fallback = '—') => {
  if (typeof n === 'number' && !isNaN(n)) {
    return n.toLocaleString('en-IN');
  }
  if (typeof n === 'string' && n.trim() !== '' && !isNaN(Number(n))) {
    return Number(n).toLocaleString('en-IN');
  }
  return fallback;
};

// Convenient alias matching legacy local component helper name
export const fmt = formatCurrency;

/**
 * Formats a date string into Indian standard date format (DD MMM YYYY)
 * @param {string|Date} d 
 * @param {string} fallback 
 * @returns {string}
 */
export const formatDate = (d, fallback = '—') => {
  if (!d) return fallback;
  const dateObj = new Date(d);
  if (isNaN(dateObj.getTime())) return fallback;
  return dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Convenient alias matching legacy local component helper name
export const fmtDate = formatDate;

/**
 * Formats a date string into Indian standard date & time format (DD MMM YYYY, HH:MM)
 * @param {string|Date} d 
 * @param {string} fallback 
 * @returns {string}
 */
export const formatDateTime = (d, fallback = '—') => {
  if (!d) return fallback;
  const dateObj = new Date(d);
  if (isNaN(dateObj.getTime())) return fallback;
  return dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Safely formats location objects or string addresses
 * @param {string|object} loc 
 * @returns {string}
 */
export const formatLocation = (loc) => {
  if (!loc) return '—';
  if (typeof loc === 'string') return loc;
  if (typeof loc === 'object') {
    const parts = [loc.address, loc.city, loc.state].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : '—';
  }
  return '—';
};
