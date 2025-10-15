import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { request } from 'services/request';

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

const useGetAllQuery = <T = unknown> ({
  key = 'get-all',
  url = '/',
  params = {},
  hideErrorMsg = false,
  enabled = true,
  headers = {},
  cb = {
    success: () => {},
    fail: () => {}
  },
  staleTime = 0 // Default bo‘yicha 5 minut
}: UseGetAllQueryOptions<T>) => {
  return useQuery<T>({
    queryKey: [key, JSON.stringify(params)],
    queryFn: async () => {
      const res = await request.get<T>(url, { params, headers });
      return res.data;
    },
    enabled,
    staleTime,
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
