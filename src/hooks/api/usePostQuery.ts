import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { request } from 'services/request';

type PostQueryProps = {
  hideSuccessToast?: boolean;
  listKeyId?: string | null;
};

type PostRequestAttributes = {
  // Post so'rovi uchun kerak bo'lgan atributlar turlari
};

type PostRequestConfig = {
  // Post so'rovi uchun kerak bo'lgan konfiquratsiya turlari
};

const postRequest: (
  url: string,
  attributes: PostRequestAttributes,
  config?: PostRequestConfig
) => Promise<any> = (url, attributes, config = {}) => request.post(url, attributes, config);

const usePostQuery = ({ hideSuccessToast = false, listKeyId = null }: PostQueryProps) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, error, } = useMutation<
    any,
    AxiosError,
    { url: string; attributes: PostRequestAttributes; config?: PostRequestConfig }
  >(({ url, attributes, config = {} }) => postRequest(url, attributes, config), {
    onSuccess: (data) => {
      if (!hideSuccessToast) {
        toast.success(data?.data?.message || 'SUCCESS');
      }
      // if (listKeyId) {
      //   queryClient.invalidateQueries(listKeyId);
      // }
    },
    onError: (error) => {
      console.log(error);
      // toast.error('ERROR');
    }
  });

  return {
    postRequest,
    mutate,
    isLoading,
    isError,
    error
  };
};

export default usePostQuery;
