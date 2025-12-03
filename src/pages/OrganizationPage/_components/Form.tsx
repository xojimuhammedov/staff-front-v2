import { MyInput, MySelect } from 'components/Atoms/Form';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { useTranslation } from 'react-i18next';
import MyInputMask from 'components/Atoms/Form/MyInputMask';
import { KEYS } from 'constants/key';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { toast } from 'react-toastify';
import { URLS } from 'constants/url';
import MyButton from 'components/Atoms/MyButton/MyButton';

const Form = ({ refetch, onClose }: any) => {
    const { t } = useTranslation()
    const [selectGates, setSelectGates] = useState<number[]>([]);
    const schema = object().shape({
        fullName: string().required(),
        shortName: string().required(),
        email: string(),
        address: string(),
        additionalDetails: string(),
        phone: string()
    });
    const { data: getDoor }: any = useGetAllQuery({
        key: KEYS.getDoorGates,
        url: URLS.getDoorGates,
        params: {}
    });

    const options =
        getDoor?.data?.map((item: any) => ({
            label: item.name,
            value: item.id,
        })) || [];

    // value qiymatini options asosida topish
    const value = options.filter((option: any) =>
        selectGates.includes(option.value)
    );

    // onchange hodisasi
    const handleChange = (selected: any) => {
        const ids = selected.map((s: any) => s.value);
        setSelectGates(ids);
    };

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
        listKeyId: KEYS.getAllListOrganization,
        hideSuccessToast: true
    });

    const onSubmit = (data: any) => {
        create(
            {
                url: URLS.getAllListOrganization,
                attributes: {
                    gates: selectGates,
                    ...data
                }
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
                        {...register("fullName")}
                        error={Boolean(errors?.fullName?.message)}
                        helperText={t(`${errors?.fullName?.message}`)}
                        label={t('Organization full name')}
                    />
                    <MyInput
                        {...register("shortName")}
                        error={Boolean(errors?.shortName?.message)}
                        helperText={t(`${errors?.shortName?.message}`)}
                        label={t('Organization short name')}
                    />
                    <MyInput
                        {...register("email")}
                        error={Boolean(errors?.email?.message)}
                        helperText={t(`${errors?.email?.message}`)}
                        label={t('Organization email')}
                        type='email'
                    />
                    <MyInput
                        {...register("address")}
                        error={Boolean(errors?.address?.message)}
                        helperText={t(`${errors?.address?.message}`)}
                        label={t('Organization address')}
                    />
                    <MyInput
                        {...register("additionalDetails")}
                        error={Boolean(errors?.additionalDetails?.message)}
                        helperText={t(`${errors?.additionalDetails?.message}`)}
                        label={t('Organization details')}
                    />
                    <MyInput
                        {...register('phone')}
                        error={Boolean(errors?.phone?.message)}
                        helperText={t(`${errors?.phone?.message}`)}
                        type="tel"
                        placeholder="+998 (_ _)  _ _ _  _ _  _ _"
                        label={t('Phone number')}
                    />
                </div>
                <MySelect
                    isMulti
                    options={options}
                    className=''
                    label={t("Gates")}
                    value={value}
                    onChange={handleChange}
                    allowedRoles={["ADMIN"]}
                />
                <div className="mt-4 flex w-full justify-end gap-4">
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
