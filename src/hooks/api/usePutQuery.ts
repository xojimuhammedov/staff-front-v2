import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { request } from 'services/request';

type PutQueryProps = {
  hideSuccessToast?: boolean;
  listKeyId?: string | null;
};

type PutRequestAttributes = {
  // Post so'rovi uchun kerak bo'lgan atributlar turlari
};

type PutRequestConfig = {
  // Post so'rovi uchun kerak bo'lgan konfiquratsiya turlari
};

const postRequest: (
  url: string,
  attributes: PutRequestAttributes,
  config?: PutRequestConfig
) => Promise<any> = (url, attributes, config = {}) => request.put(url, attributes, config);

const usePutQuery = ({ hideSuccessToast = false, listKeyId = null }: PutQueryProps) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, error } = useMutation<
    any,
    AxiosError,
    { url: string; attributes: PutRequestAttributes; config?: PutRequestConfig }
  >(({ url, attributes, config = {} }) => postRequest(url, attributes, config), {
    onSuccess: (data) => {
      if (!hideSuccessToast) {
        toast.success(data?.data?.message || 'SUCCESS');
      }
      // if (listKeyId) {
      //   queryClient.invalidateQueries(listKeyId);
      // }
    },
    onError: (data) => {
      console.log(data);
      //   toast.error(data?.data?.message || "ERROR");
    }
  });

  return {
    mutate,
    isLoading,
    isError,
    error
  };
};

export default usePutQuery;
