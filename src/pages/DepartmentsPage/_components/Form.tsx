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
import { get } from 'lodash';
import { ISelect } from 'interfaces/select.interface';
import { Department } from '../interface/department.interface';
import { Organization } from 'pages/OrganizationPage/interface/organization.interface';

const Form = ({ refetch, onClose }: any) => {
    const { t } = useTranslation()
    const { data } = useGetAllQuery<any>({
        key: KEYS.getAllListOrganization,
        url: URLS.getAllListOrganization,
        params: {}
    })

    const schema = object().shape({
        fullName: string().required(),
        shortName: string().required(),
        email: string(),
        address: string(),
        additionalDetails: string(),
        phone: string(),
        organizationId: yup.number().required(),
        parentId: yup.number()
    });

    const {
        handleSubmit,
        register,
        reset,
        control,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            phone: undefined
        },
        mode: 'onChange',
        resolver: yupResolver(schema)
    });

    const { mutate: create } = usePostQuery({
        listKeyId: KEYS.getAllListDepartment,
        hideSuccessToast: true
    });

    const onSubmit = (data: any) => {
        create(
            {
                url: URLS.getAllListDepartment,
                attributes: data
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

    const { data: getDepartment } = useGetAllQuery<{ data: Department[] }>({
        key: KEYS.getAllListDepartment,
        url: URLS.getAllListDepartment,
        params: {
            organizationId: watch("organizationId")
        }
    })

    return (
        <div className='p-4'>
            <form onSubmit={handleSubmit(onSubmit)} action="">
                <div className='grid grid-cols-2 gap-4'>
                    <MyInput
                        {...register("fullName")}
                        error={Boolean(errors?.fullName?.message)}
                        helperText={t(`${errors?.fullName?.message}`)}
                        label={t('Department full name')}
                    />
                    <MyInput
                        {...register("shortName")}
                        error={Boolean(errors?.shortName?.message)}
                        helperText={t(`${errors?.shortName?.message}`)}
                        label={t('Department short name')}
                    />
                    <MyInput
                        {...register("email")}
                        error={Boolean(errors?.email?.message)}
                        helperText={t(`${errors?.email?.message}`)}
                        label={t('Department email')}
                        type='email'
                    />
                    <MyInput
                        {...register("address")}
                        error={Boolean(errors?.address?.message)}
                        helperText={t(`${errors?.address?.message}`)}
                        label={t('Department address')}
                    />
                    <MyInput
                        {...register("additionalDetails")}
                        error={Boolean(errors?.additionalDetails?.message)}
                        helperText={t(`${errors?.additionalDetails?.message}`)}
                        label={t('Department details')}
                    />
                    <MyInput
                        {...register('phone')}
                        error={Boolean(errors?.phone?.message)}
                        helperText={t(`${errors?.phone?.message}`)}
                        type="tel"
                        placeholder="+998 (_ _)  _ _ _  _ _  _ _"
                        label={t('Phone number')}
                    />
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
                                required
                            />
                        )}
                    />
                    <Controller
                        name="parentId"
                        control={control}
                        render={({ field, fieldState }) => (
                            <MySelect
                                label={t("Select department")}
                                options={get(getDepartment, "data")?.map((evt: Department) => ({
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

export default Form;
