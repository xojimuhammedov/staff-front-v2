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
import React, { useEffect, useRef, useState } from 'react';
import { ISelect } from 'interfaces/select.interface';
import { credentialTypeData } from 'configs/type';
import MyModal from 'components/Atoms/MyModal';
import ImageCropModalContent from 'pages/EmployeePage/Create/_components/ImageCropModalContent';
import { request } from 'services/request';
import { useImageCropContext } from 'context/ImageCropProvider';
import { readFile } from 'helpers/cropImage';

const Form = ({ refetch, onClose, employeeId }: any) => {
    const { t } = useTranslation()
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageKey, setImageKey] = useState(null)
    const [openModal, setOpenModal] = useState(false);
    const schema = object().shape({
        code: string(),
        type: string().required(),
        additionalDetails: string(),
        organizationId: yup.number().required(),
    });

    const { getProcessedImage, resetStates, setImage }: any = useImageCropContext();
    const handleDone = async (): Promise<void> => {
        const avatar = await getProcessedImage();
        if (!avatar) {
            console.error('Processed image is not available.');
            setOpenModal(false);
            return;
        }

        if (!(avatar instanceof Blob)) {
            console.error('Processed image is not a valid Blob.');
            setOpenModal(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', avatar);

            const response = await request.post(URLS.uploadPhotoByEmployee, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const key = response?.data?.key;
            if (key) {
                setImageKey(key);
                // additionalDetails ga avtomatik yozamiz
                setValue('additionalDetails', key);
                toast.success(t('Photo uploaded successfully!'));
            }

            resetStates();
            setOpenModal(false);
        } catch (error: any) {
            console.error('❌ Error uploading avatar:', error);
            toast.error(t('Failed to upload photo'));
            setOpenModal(false);
        }
    };
    const handleFileChange = async ({ target: { files } }: any) => {
        const file = files && files[0];
        const imageDataUrl = await readFile(file);
        setImage(imageDataUrl);
        setOpenModal(true);
    };

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

    const selectedType = watch('type');
    useEffect(() => {
        if (selectedType === 'PHOTO' && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, [selectedType]);

    const { mutate: create } = usePostQuery({
        listKeyId: KEYS.credentials,
        hideSuccessToast: true
    });

    const onSubmit = (data: any) => {
        const submitData = {
            employeeId: Number(employeeId),
            ...data,
            additionalDetails: selectedType === 'PHOTO' ? imageKey || data.additionalDetails : data.additionalDetails,
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
                                    value={field.value as any}  // 👈 cast to any
                                    onChange={(val) => field.onChange((val as ISelect)?.value ?? val)}
                                    onBlur={field.onBlur}
                                    error={!!fieldState.error}
                                    allowedRoles={["ADMIN", "HR"]}
                                />
                            )}
                        />
                        {
                            watch("type") !== "PHOTO" && <MyInput
                                {...register("code")}
                                error={Boolean(errors?.code?.message)}
                                helperText={t(`${errors?.code?.message}`)}
                                label={t('Code')}
                            />
                        }
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
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
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

            <MyModal
                modalProps={{
                    show: Boolean(openModal),
                    onClose: () => setOpenModal(false),
                    size: 'md'
                }}
                headerProps={{
                    children: <h2 className="text-gray-800">{t('Profile picture')}</h2>
                }}
                bodyProps={{
                    children: (
                        <>
                            <ImageCropModalContent
                                handleDone={handleDone}
                                handleClose={() => setOpenModal(false)}
                            />
                        </>
                    )
                }}
            />
        </>
    );
}

export default React.memo(Form);
