import { MyInput } from 'components/Atoms/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { useTranslation } from 'react-i18next';
import { KEYS } from 'constants/key';
import { usePostQuery } from 'hooks/api';
import { toast } from 'react-toastify';
import { URLS } from 'constants/url';
import MyButton from 'components/Atoms/MyButton/MyButton';
import React from 'react';

const Form = ({ refetch, onClose, employeeId }: any) => {
    const { t } = useTranslation()
    const schema = object().shape({
        code: string().required(),
        type: string().required(),
        additionalDetails: string(),
    });

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {},
        mode: 'onChange',
        resolver: yupResolver(schema)
    });

    const { mutate: create } = usePostQuery({
        listKeyId: KEYS.credentials,
        hideSuccessToast: true
    });

    const onSubmit = (data: any) => {
        const submitData = {
            employeeId: Number(employeeId),
            ...data
        }
        create(
            {
                url: URLS.credentials,
                attributes: submitData
            },
            {
                onSuccess: () => {
                    toast.success(t('Successfully created!'));
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
                        label={t('Type')}
                    />
                    <MyInput
                        {...register("code")}
                        error={Boolean(errors?.code?.message)}
                        helperText={t(`${errors?.code?.message}`)}
                        label={t('Code')}
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

export default React.memo(Form);
