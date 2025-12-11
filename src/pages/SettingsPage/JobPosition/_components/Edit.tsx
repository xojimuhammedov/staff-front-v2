import { MyInput, MySelect, MyTextarea } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, useGetOneQuery, usePutQuery } from 'hooks/api';
import { ISelect } from 'interfaces/select.interface';
import { get } from 'lodash';
import { Organization } from 'pages/OrganizationPage/interface/organization.interface';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const Edit = ({ refetch, setOpen, typeId }: any) => {
    const { t } = useTranslation()
    const { mutate: create } = usePutQuery({
        listKeyId: KEYS.employeeJobPosition,
        hideSuccessToast: true
    });
    const { data: getOne } = useGetOneQuery({
        id: typeId,
        url: URLS.employeeJobPosition,
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
                eng: get(getOne, 'data.eng'),
                ru: get(getOne, 'data.ru'),
                uz: get(getOne, 'data.uz'),
                organizationId: get(getOne, 'data.organizationId'),
            };
        }, [getOne?.data]),
        mode: 'onChange',
    });

    useEffect(() => {
        reset({
            eng: get(getOne, 'data.eng'),
            ru: get(getOne, 'data.ru'),
            uz: get(getOne, 'data.uz'),
            organizationId: get(getOne, 'data.organizationId'),
        });
    }, [getOne?.data]);

    const onSubmit = (data: any) => {
        create(
            {
                url: `${URLS.employeeJobPosition}/${typeId}`,
                attributes: data
            },
            {
                onSuccess: () => {
                    toast.success(t('Your job name has been sent!'));
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
                <MyInput label={t('Job uz')}  {...register('uz')} />
                <MyInput label={t('Job en')}  {...register('eng')} />
                <MyInput label={t('Job ru')}  {...register('ru')} />
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
