import { MyTextarea } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyModal from 'components/Atoms/MyModal';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { usePutQuery } from 'hooks/api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

function ReasonModal({ row, refetch }: any) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const { mutate: create } = usePutQuery({
        listKeyId: KEYS.attendacesForEmployee,
        hideSuccessToast: true
    });

    const { handleSubmit, register } = useForm()

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

    return (
        <>
            {row?.arrivalStatus === "LATE" && (
                <MyButton variant="secondary" onClick={() => setOpen(true)} >
                    {t('Sababli')}
                </MyButton>
            )}

            <MyModal
                modalProps={{
                    show: Boolean(open),
                    onClose: () => setOpen(false),
                    size: 'md'
                }}
                headerProps={{
                    children: <h2 className="text-gray-800">{t('Reasonably')}</h2>
                }}
                bodyProps={{
                    children: (
                        <>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" action="">
                                <MyTextarea label={t('Note')}  {...register('reason')} />
                                <div className="mt-2 flex items-center justify-end gap-4">
                                    <MyButton variant="primary" type="submit">
                                        {t('Save changes')}
                                    </MyButton>
                                    <MyButton
                                        onClick={() => setOpen(false)}
                                        
                                        variant="secondary">
                                        {t('Close')}
                                    </MyButton>
                                </div>
                            </form>
                        </>
                    ),
                    className: 'py-[10px]'
                }}
            />
        </>
    );
}

export default ReasonModal;
