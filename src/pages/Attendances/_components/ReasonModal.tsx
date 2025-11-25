import { MyTextarea } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import MyModal from 'components/Atoms/MyModal';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { usePutQuery } from 'hooks/api';
import React, { useState } from 'react';
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
            {
                row?.reason ?
                    <MyButton onClick={() => setOpen(true)} variant="secondary">
                        {t('Sababli')}
                    </MyButton> :
                    <MyButton variant="secondary"
                        disabled={!(row?.arrivalStatus === "ABSENT" || row?.arrivalStatus === "LATE")}
                        onClick={() => setOpen(true)}>
                        {t('Reason')}
                    </MyButton>
            }

            <MyModal
                modalProps={{
                    show: Boolean(open),
                    onClose: () => setOpen(false),
                    size: 'md'
                }}
                headerProps={{
                    children: <h2 className="dark:text-text-title-dark">{t('Reasonably')}</h2>
                }}
                bodyProps={{
                    children: (
                        <>
                            {
                                row?.reason ? (
                                    <>
                                        <p>{t('Reason')}</p>
                                        <h2 className="mt-2 text-base font-medium leading-7">
                                            {row?.reason}
                                        </h2>
                                        <MyDivider />
                                        <div className="mt-6 flex items-center justify-end gap-4">
                                            <MyButton
                                                onClick={() => setOpen(false)}
                                                className={'w-[98px]'}
                                                variant="secondary">
                                                {t('Close')}
                                            </MyButton>
                                        </div>

                                    </>
                                ) : (
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
                                )
                            }
                        </>
                    ),
                    className: 'py-[10px]'
                }}
            />
        </>
    );
}

export default React.memo(ReasonModal);
