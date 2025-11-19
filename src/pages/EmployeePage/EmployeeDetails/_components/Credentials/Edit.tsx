import { MyInput, MySelect } from 'components/Atoms/Form';
import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KEYS } from 'constants/key';
import { useGetAllQuery, usePutQuery } from 'hooks/api';
import { toast } from 'react-toastify';
import { URLS } from 'constants/url';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { get } from 'lodash';
import { ISelect } from 'interfaces/select.interface';
import credentialTypeData from 'configs/type';

const EditForm = ({ onClose, refetch, data, credentialId, employeeId }: any) => {
    const { t } = useTranslation()

    const { data: getOrganization } = useGetAllQuery<any>({
        key: KEYS.getListOrganizationSelf,
        url: URLS.getListOrganizationSelf,
        params: {}
    })

    const {
        handleSubmit,
        register,
        reset,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: useMemo(() => {
            return {
                code: get(data, 'data.code'),
                type: get(data, 'data.type'),
                additionalDetails: get(data, 'data.additionalDetails'),
                organizationId: get(data, 'data.organizationId'),
            };
        }, [data]),
        mode: 'onChange'
    });

    useEffect(() => {
        reset({
            code: get(data, 'data.code'),
            type: get(data, 'data.type'),
            additionalDetails: get(data, 'data.additionalDetails'),
            organizationId: get(data, 'data.organizationId'),
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
                            />
                        )}
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
                    <Controller
                        name="organizationId"
                        control={control}
                        render={({ field, fieldState }) => (
                            <MySelect
                                label={t("Select organization")}
                                options={getOrganization?.map((evt: any) => ({
                                    label: evt.fullName,
                                    value: evt.id,
                                }))}
                                value={field.value as any}  // 👈 cast to any
                                onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                                onBlur={field.onBlur}
                                error={!!fieldState.error}
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

export default React.memo(EditForm);
