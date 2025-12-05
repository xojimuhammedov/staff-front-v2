import { MyInput, MySelect } from 'components/Atoms/Form';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import * as yup from "yup";
import { useTranslation } from 'react-i18next';
import { KEYS } from 'constants/key';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { toast } from 'react-toastify';
import { URLS } from 'constants/url';
import MyButton from 'components/Atoms/MyButton/MyButton';
import React from 'react';
import { ISelect } from 'interfaces/select.interface';
import { credentialTypeData } from 'configs/type';

const Form = ({ refetch, onClose, employeeId }: any) => {
    const { t } = useTranslation()
    const schema = object().shape({
        code: string().required(),
        type: string().required(),
        additionalDetails: string(),
        organizationId: yup.number().required(),
    });

    const { data } = useGetAllQuery<any>({
        key: KEYS.getAllListOrganization,
        url: URLS.getAllListOrganization,
        params: {}
    })
    const {
        handleSubmit,
        register,
        reset,
        control,
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
                    <Controller
                        name="type"
                        control={control}
                        render={({ field, fieldState }) => (
                            <MySelect
                                label={t("Select type")}
                                options={credentialTypeData?.map((evt: any) => ({
                                    label: evt.label,
                                    value: evt.value,
                                }))}
                                value={field.value as any}  // 👈 cast to any
                                onChange={(val) => field.onChange((val as ISelect)?.value ?? val)}
                                onBlur={field.onBlur}
                                error={!!fieldState.error}
                                allowedRoles={["ADMIN", "HR"]}
                            />
                        )}
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
                    <Controller
                        name="organizationId"
                        control={control}
                        render={({ field, fieldState }) => (
                            <MySelect
                                label={t("Select organization")}
                                options={data?.data?.map((evt: any) => ({
                                    label: evt.fullName,
                                    value: evt.id,
                                }))}
                                value={field.value as any}  // 👈 cast to any
                                onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                                onBlur={field.onBlur}
                                error={!!fieldState.error}
                                allowedRoles={["ADMIN"]}
                            />
                        )}
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
