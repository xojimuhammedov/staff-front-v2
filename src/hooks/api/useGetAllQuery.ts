import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { request } from 'services/request';

// Stable stringify so queryKey doesn't change when params object is re-created with same values.
// Sorts object keys recursively to avoid accidental refetch loops.
const stableStringify = (value: unknown): string => {
  const seen = new WeakSet<object>();
  const normalize = (v: any): any => {
    if (v === null || v === undefined) return v;
    if (typeof v !== 'object') return v;

    // Dates -> ISO string for stability
    if (v instanceof Date) return v.toISOString();

    if (Array.isArray(v)) return v.map(normalize);

    // Avoid circular refs (shouldn't happen for query params, but guard anyway)
    if (seen.has(v)) return undefined;
    seen.add(v);

    return Object.keys(v)
      .sort()
      .reduce<Record<string, any>>((acc, key) => {
        const next = v[key];
        // Drop functions/symbols (non-serializable)
        if (typeof next === 'function' || typeof next === 'symbol') return acc;
        acc[key] = normalize(next);
        return acc;
      }, {});
  };

  return JSON.stringify(normalize(value));
};

interface Callbacks<T = unknown> {
  success?: (data: T) => void;
  fail?: () => void;
}

interface UseGetAllQueryOptions<T = unknown> {
  key?: string;
  url?: string;
  params?: Record<string, any>;
  hideErrorMsg?: boolean;
  enabled?: boolean;
  headers?: Record<string, any>;
  cb?: Callbacks<T>;
  staleTime?: number;
}

const useGetAllQuery = <T = unknown>({
  key = 'get-all',
  url = '/',
  params = {},
  hideErrorMsg = false,
  enabled = true,
  headers = {},
  cb = {
    success: () => { },
    fail: () => { }
  },
  staleTime = 0
}: UseGetAllQueryOptions<T>) => {
  return useQuery<T>({
    // Include url + params in the key, otherwise changing url/querystring won't refetch.
    queryKey: [key, url, stableStringify(params)],
    queryFn: async () => {
      const res = await request.get<T>(url, { params, headers });
      return res.data;
    },
    enabled,
    staleTime,
    // Only refetch when params/key changes or when refetch() is called.
    // These defaults often look like "duplicate requests" in apps.
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    onSuccess: (data) => {
      cb?.success?.(data);
    },
    onError: (error: any) => {
      cb?.fail?.();
      if (!hideErrorMsg) {
        const msg = error?.response?.data?.message || error.message || `${url} api not working`;
        toast.error(`ERROR!!! ${msg}`);
      }
    }
  });
};

export default useGetAllQuery;
