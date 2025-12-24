import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePutQuery } from 'hooks/api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAttendance } from './useAttendance';

export const useFormAttendance = ({ row }: any) => {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false);
    const { refetch } = useAttendance()
    const { data }: any = useGetAllQuery({
        key: KEYS.attendancesReason,
        url: URLS.attendancesReason,
        params: {}
    })

    const { mutate: create } = usePutQuery({
        listKeyId: KEYS.attendacesForEmployee,
        hideSuccessToast: true
    });

    const { handleSubmit, register, control, watch } = useForm()

    const onSubmit = (data: any) => {
        create(
            {
                url: `${URLS.attendacesForEmployee}/${row?.id}`,
                attributes: data
            },
            {
                onSuccess: () => {
                    toast.success(t('Your reason has been sent!'));
                    setOpen(false)
                    refetch()
                },
                onError: (e) => {
                    console.log(e);
                    toast.error(t('An error occurred!'));
                }
            }
        );
    };

    return {
        open,
        setOpen,
        reasonData: data,
        onSubmit, 
        handleSubmit,
        register,
        control,
        watch
    }
}

