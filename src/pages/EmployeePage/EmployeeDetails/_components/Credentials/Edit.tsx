import { MyInput } from 'components/Atoms/Form';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KEYS } from 'constants/key';
import { usePutQuery } from 'hooks/api';
import { toast } from 'react-toastify';
import { URLS } from 'constants/url';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { get } from 'lodash';

const EditForm = ({ onClose, refetch, data, credentialId, employeeId }: any) => {
    const { t } = useTranslation()

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: useMemo(() => {
            return {
                code: get(data, 'data.code'),
                type: get(data, 'data.type'),
                additionalDetails: get(data, 'data.additionalDetails'),
            };
        }, [data]),
        mode: 'onChange'
    });

    useEffect(() => {
        reset({
            code: get(data, 'data.code'),
            type: get(data, 'data.type'),
            additionalDetails: get(data, 'data.additionalDetails'),
        });
    }, [data]);

    const { mutate: update } = usePutQuery({
        listKeyId: KEYS.credentials,
        hideSuccessToast: true
    });

    const onSubmit = (data: any) => {
        const submitData = {
            employeeId: employeeId,
            ...data
        }
        update(
            {
                url: `${URLS.credentials}/${credentialId}`,
                attributes: submitData
            },
            {
                onSuccess: () => {
                    toast.success(t('Edit successfully!'));
                    reset();
                    refetch()
                    onClose()
                },
                onError: (e: any) => {
                    console.log(e);
                    toast.error(e?.response?.data?.error?.message)
                }
            }
        );
    };

    return (
        <div className='p-4'>
            <form onSubmit={handleSubmit(onSubmit)} action="">
                <div className='grid grid-cols-2 gap-4'>
                    <MyInput
                        {...register("type")}
                        error={Boolean(errors?.type?.message)}
                        helperText={t(`${errors?.type?.message}`)}
                        label={t('Credential type')}
                    />
                    <MyInput
                        {...register("code")}
                        error={Boolean(errors?.code?.message)}
                        helperText={t(`${errors?.code?.message}`)}
                        label={t('Credential code')}
                    />
                    <MyInput
                        {...register("additionalDetails")}
                        error={Boolean(errors?.additionalDetails?.message)}
                        helperText={t(`${errors?.additionalDetails?.message}`)}
                        label={t('Details...')}
                    />
                </div>
                <div className="mt-2 flex w-full justify-end gap-4">
                    <MyButton
                        type='submit'
                        variant="primary">{t("Submit")}</MyButton>
                    <MyButton
                        onClick={() => {
                            onClose();
                            reset();
                        }}
                        variant="secondary">
                        {' '}
                        {t('Close')}
                    </MyButton>
                </div>
            </form>
        </div>
    );
}

export default React.memo(EditForm);
