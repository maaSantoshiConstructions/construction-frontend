import { useState, useCallback } from 'react';

/**
 * Custom hook for managing table filter states
 * @param {object} [initialFilters={}] 
 */
export function useTableFilters(initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    toggleFilters,
    updateFilter,
    resetFilters,
  };
}

export default useTableFilters;
