import { MyInput, MySelect, MyTextarea } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, useGetOneQuery, usePutQuery } from 'hooks/api';
import { ISelect } from 'interfaces/select.interface';
import { get } from 'lodash';
import { Organization } from 'pages/OrganizationPage/interface/organization.interface';
import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const Edit = ({ refetch, setOpen, typeId }: any) => {
    const { t } = useTranslation()
    const { mutate: create } = usePutQuery({
        listKeyId: KEYS.attendancesReason,
        hideSuccessToast: true
    });
    const { data: getOne } = useGetOneQuery({
        id: typeId,
        url: URLS.attendancesReason,
        params: {},
        enabled: !!typeId
    })
    const { data } = useGetAllQuery<any>({
        key: KEYS.getAllListOrganization,
        url: URLS.getAllListOrganization,
        hideErrorMsg: true,
        params: {},
    })
    const {
        handleSubmit,
        register,
        control,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: useMemo(() => {
            return {
                key: get(getOne, 'data.key'),
                value: get(getOne, 'data.value'),
                organizationId: get(getOne, 'data.organizationId'),
            };
        }, [getOne]),
        mode: 'onChange',
    });

    useEffect(() => {
        reset({
            key: get(getOne, 'data.key'),
            value: get(getOne, 'data.value'),
            organizationId: get(getOne, 'data.organizationId'),
        });
    }, [getOne]);

    const onSubmit = (data: any) => {
        create(
            {
                url: `${URLS.attendancesReason}/${typeId}`,
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

    console.log(getOne)
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" action="">
                <Controller
                    name="organizationId"
                    control={control}
                    render={({ field, fieldState }) => (
                        <MySelect
                            label={t("Select organization")}
                            options={data?.data?.map((evt: Organization) => ({
                                label: evt.fullName,
                                value: evt.id,
                            }))}
                            value={field.value as any}  // 👈 cast to any
                            onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                            onBlur={field.onBlur}
                            error={!!fieldState.error}
                            allowedRoles={['ADMIN']}
                            required
                        />
                    )}
                />
                <MyInput label={t('Key')}  {...register('key')} />
                <MyTextarea label={t('Value')}  {...register('value')} />
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
    );
}

export default Edit;
