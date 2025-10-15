import { MyInput } from 'components/Atoms/Form';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { useTranslation } from 'react-i18next';
import { KEYS } from 'constants/key';
import { usePostQuery } from 'hooks/api';
import { toast } from 'react-toastify';
import { URLS } from 'constants/url';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyModal from 'components/Atoms/MyModal';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { Calendar } from 'lucide-react';
import dayjs from 'dayjs';

const Form = ({ refetch, setShow, show }: any) => {

    const { t } = useTranslation()
    const schema = object().shape({
        firstName: string().required(),
        lastName: string().required(),
        middleName: string(),
        birthday: object() || null,
        additionalDetails: string(),
        phone: string(),
        pinfl: string(),
        workPlace: string(),
        passportNumber: string(),
    });

    const {
        handleSubmit,
        register,
        reset,
        control,
        formState: { errors }
    } = useForm<any>({
        defaultValues: {
            birthday: { startDate: null, endDate: null }
        },
        mode: 'onChange',
        resolver: yupResolver(schema)
    });

    const { mutate: create } = usePostQuery({
        listKeyId: KEYS.getVisitorList,
        hideSuccessToast: true
    });

    const onSubmit = (data: any) => {
        const formattedData = {
            ...data,
            birthday: data.birthday?.startDate
                ? dayjs(data.birthday.startDate).format("YYYY-MM-DD")
                : null,
        };
        create(
            {
                url: URLS.getVisitorList,
                attributes: formattedData
            },
            {
                onSuccess: () => {
                    toast.success(t('Successfully created!'));
                    reset();
                    refetch()
                    setShow(false)
                },
                onError: (e: any) => {
                    console.log(e);
                    toast.error(e?.response?.data?.error?.message)
                }
            }
        );
    };

    return (
        <>
            <MyModal
                modalProps={{
                    show: Boolean(show),
                    onClose: () => {
                        setShow(false)
                    }
                }}
                headerProps={{
                    children: <h2 className="text-xl font-semibold">{t('Create visitor')}</h2>,
                    className: 'px-6'
                }}
                bodyProps={{
                    children: (
                        <div className='p-4'>
                            <form onSubmit={handleSubmit(onSubmit)} action="">
                                <div className='grid grid-cols-2 gap-4'>
                                    <MyInput
                                        {...register("firstName")}
                                        error={Boolean(errors?.firstName?.message)}
                                        helperText={t(`${errors?.firstName?.message}`)}
                                        label={t('Organization full name')}
                                    />
                                    <MyInput
                                        {...register("lastName")}
                                        error={Boolean(errors?.lastName?.message)}
                                        helperText={t(`${errors?.lastName?.message}`)}
                                        label={t('Organization short name')}
                                    />
                                    <MyInput
                                        {...register("middleName")}
                                        error={Boolean(errors?.middleName?.message)}
                                        helperText={t(`${errors?.middleName?.message}`)}
                                        label={t('Organization email')}
                                    />
                                    <MyInput
                                        {...register("workPlace")}
                                        error={Boolean(errors?.workPlace?.message)}
                                        helperText={t(`${errors?.workPlace?.message}`)}
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
                                    <MyTailwindPicker
                                        name="birthday"
                                        control={control}
                                        asSingle={true}
                                        placeholder="Select birthday"
                                        label={t('Birthday')}
                                        useRange={false}
                                        startIcon={<Calendar stroke="#9096A1" />}
                                    />
                                    <MyInput
                                        {...register('pinfl')}
                                        error={Boolean(errors?.pinfl?.message)}
                                        helperText={t(`${errors?.pinfl?.message}`)}
                                        type="tel"
                                        label={t('Pinfl')}
                                    />
                                    <MyInput
                                        {...register('passportNumber')}
                                        error={Boolean(errors?.passportNumber?.message)}
                                        helperText={t(`${errors?.passportNumber?.message}`)}
                                        type="tel"
                                        label={t('Passport Number')}
                                    />
                                </div>
                                <div className="mt-2 flex w-full justify-end gap-4">
                                    <MyButton
                                        type='submit'
                                        variant="primary">{t("Submit")}</MyButton>
                                    <MyButton
                                        onClick={() => {
                                            setShow(false);
                                            reset();
                                        }}
                                        variant="secondary">
                                        {' '}
                                        {t('Close')}
                                    </MyButton>
                                </div>
                            </form>
                        </div>
                    )
                }}
            />
        </>
    );
}

export default Form;
