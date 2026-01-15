import { MySelect } from 'components/Atoms/Form';
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
import React, { useState } from 'react';
import { ISelect } from 'interfaces/select.interface';
import { credentialTypeData } from 'configs/type';
import TypeForm from './TypeForm';

const Form = ({ refetch, onClose, visitorId }: any) => {
    const { t } = useTranslation()
    const [imageKey, setImageKey] = useState(null)
    const [cardNumber, setCardNumber] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [carNumber, setCarNumber] = useState('');
    const [personalCode, setPersonalCode] = useState('');
    const [code, setCode] = useState<string>("");
    const schema = object().shape({
        code: string(),
        type: string(),
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
        reset,
        control,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            type: '',
            additionalDetails: '',
            code: ".",
            organizationId: undefined,
        },
        mode: 'onChange',
        resolver: yupResolver(schema)
    });

    const handleTypeSelect = (type: any) => {
        setSelectedType(type);
    };

    const { mutate: create } = usePostQuery({
        listKeyId: KEYS.credentials,
        hideSuccessToast: true
    });

    const onSubmit = (data: any) => {
        const submitData = {
            visitorId: Number(visitorId),
            ...data,
            additionalDetails: selectedType === 'PHOTO' ? imageKey || data.additionalDetails : data.additionalDetails,
            code: selectedType === 'CARD' ? cardNumber :
                selectedType === 'CAR' ? carNumber :
                    selectedType === 'PERSONAL_CODE' ? personalCode :
                        selectedType === 'QR' ? code : "."
        };
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
        <>
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
                                    value={selectedType}
                                    onChange={(val: any) => {
                                        field.onChange((val as ISelect)?.value ?? val)
                                        handleTypeSelect(val.value)
                                    }}
                                    onBlur={field.onBlur}
                                    error={!!fieldState.error}
                                    allowedRoles={["ADMIN", "HR"]}
                                />
                            )}
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
                                    value={field.value as any}
                                    onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                                    onBlur={field.onBlur}
                                    error={!!fieldState.error}
                                    allowedRoles={["ADMIN"]}
                                />
                            )}
                        />
                    </div>
                    <TypeForm
                        selectedTypeName={selectedType}
                        setValue={setValue} setImageKey={setImageKey}
                        cardNumber={cardNumber}
                        setCardNumber={setCardNumber}
                        carNumber={carNumber}
                        setCarNumber={setCarNumber}
                        personalCode={personalCode}
                        setPersonalCode={setPersonalCode}
                        code={code}
                        setCode={setCode}
                    />
                    <div className="mt-8 flex w-full justify-end gap-4">
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
        </>
    );
}

export default React.memo(Form);
