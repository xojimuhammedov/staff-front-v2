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
import React, { useRef, useState } from 'react';
import { ISelect } from 'interfaces/select.interface';
import { credentialTypeData } from 'configs/type';
import TypeForm from './TypeForm';

const Form = ({ refetch, onClose, employeeId }: any) => {
    const { t } = useTranslation()
    const [imageKey, setImageKey] = useState(null)
    const [cardNumber, setCardNumber] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [carNumber, setCarNumber] = useState('');
    const [personalCode, setPersonalCode] = useState('');
    const [qrGuid, setQrGuid] = useState('');
    const qrCanvasRef = useRef(null);
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
        watch,
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


    const generateGuid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const generateQRCode = (text: any) => {
        const canvas: any = qrCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const size = 200;
        canvas.width = size;
        canvas.height = size;

        // Simple QR code visualization
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        ctx.fillStyle = '#000000';
        const moduleSize = 4;
        const modules = Math.floor(size / moduleSize);

        // Generate random pattern based on GUID
        for (let i = 0; i < modules; i++) {
            for (let j = 0; j < modules; j++) {
                const hash = text.charCodeAt(i % text.length) + text.charCodeAt(j % text.length);
                if (hash % 2 === 0) {
                    ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
                }
            }
        }
    };

    const handleTypeSelect = (type: any) => {
        setSelectedType(type);

        // Generate GUID and QR code if QR type is selected
        if (type === 'QR') {
            const guid = generateGuid();
            setQrGuid(guid);
            setTimeout(() => generateQRCode(guid), 100);
        }
    };


    const { mutate: create } = usePostQuery({
        listKeyId: KEYS.credentials,
        hideSuccessToast: true
    });

    const onSubmit = (data: any) => {
        const submitData = {
            employeeId: Number(employeeId),
            ...data,
            additionalDetails: selectedType === 'PHOTO' ? imageKey || data.additionalDetails : data.additionalDetails,
            code: selectedType === 'CARD' ? cardNumber :
                selectedType === 'CAR' ? carNumber :
                    selectedType === 'PERSONAL_CODE' ? personalCode :
                        selectedType === 'QR' ? qrGuid : "."
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
                                    onChange={(val: any) =>{
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
                                    value={field.value as any}  // 👈 cast to any
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
                        qrGuid={qrGuid}
                        setQrGuid={setQrGuid}
                        setCardNumber={setCardNumber}
                        carNumber={carNumber}
                        setCarNumber={setCarNumber}
                        personalCode={personalCode}
                        setPersonalCode={setPersonalCode}
                        qrCanvasRef={qrCanvasRef}
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
