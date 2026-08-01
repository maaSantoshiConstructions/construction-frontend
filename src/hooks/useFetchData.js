import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing paginated async data fetching
 * @param {Function} fetchApiFunc - API function returning Promise<{ data: { data, total, totalPages } }>
 * @param {object} [initialParams={}] - Initial query parameters (e.g. limit, filters)
 * @param {boolean} [autoFetch=true] - Whether to fetch automatically on mount/param change
 */
export function useFetchData(fetchApiFunc, initialParams = {}, autoFetch = true) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialParams.page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async (overridePage = page, overrideParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: overridePage, limit: 10, ...initialParams, ...overrideParams };
      const res = await fetchApiFunc(params);
      const resData = res?.data || res;
      
      setData(resData?.data || (Array.isArray(resData) ? resData : []));
      setTotalPages(resData?.totalPages || 1);
      setTotal(resData?.total || (resData?.data ? resData.data.length : 0));
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load data';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [fetchApiFunc, page, JSON.stringify(initialParams)]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return {
    data,
    setData,
    loading,
    error,
    page,
    setPage,
    totalPages,
    total,
    refetch: fetchData,
  };
}

export default useFetchData;
