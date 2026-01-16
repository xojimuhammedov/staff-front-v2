import { MySelect } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import MyToggle from 'components/Atoms/MyToggle/MyToggle';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import deviceSettingsData from 'configs/deviceSettings';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetOneQuery, usePutQuery } from 'hooks/api';
import { ISelect } from 'interfaces/select.interface';
import { get } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const DeviceSettings = ({ handleClick, deviceId }: any) => {
    const { t } = useTranslation()
    const initialValuesRef = useRef<any>(null);

    const { data: deviceData, refetch } = useGetOneQuery({
        id: deviceId,
        url: URLS.getDeviceSettingsInfo,
        params: {},
        enabled: !!deviceId,
    });

    const { mutate: updateCredential } = usePutQuery({
        listKeyId: KEYS.deviceCredentialType,
        hideSuccessToast: true
    })

    const { mutate: updateDisplay } = usePutQuery({
        listKeyId: KEYS.deviceDisplay,
        hideSuccessToast: true
    })

    const deviceTypeOptions = deviceSettingsData?.map((item: any) => ({
        label: item.label,
        value: item.value,
    })) ?? [];

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        mode: "onChange",
    })

    useEffect(() => {
        if (deviceData?.data) {
            const initialValues = {
                showName: get(deviceData, 'data.showName'),
                showPicture: get(deviceData, 'data.showPicture'),
                voicePrompt: get(deviceData, 'data.voicePrompt'),
                showEmployeeNo: get(deviceData, 'data.showEmployeeNo'),
                authMode: get(deviceData, 'data.authMode'),
            };

            initialValuesRef.current = initialValues;
            reset(initialValues);
        }
    }, [deviceData?.data, reset]);

    const onSubmit = async (data: any) => {
        const initial = initialValuesRef.current;

        if (!initial) return;

        // display ga tegishli fieldlar
        const displayFields = ['showName', 'showPicture', 'voicePrompt', 'showEmployeeNo'];

        const isDisplayChanged = displayFields.some(
            (key) => data[key] !== initial[key]
        );

        const isAuthModeChanged = data.authMode !== initial.authMode;

        try {
            // 1️⃣ Agar display o‘zgargan bo‘lsa
            if (isDisplayChanged) {
                await new Promise((resolve, reject) => {
                    updateDisplay(
                        {
                            url: `${URLS.deviceDisplay}/${deviceId}`,
                            attributes: {
                                showName: data.showName,
                                showPicture: data.showPicture,
                                voicePrompt: data.voicePrompt,
                                showEmployeeNo: data.showEmployeeNo,
                            },
                        },
                        {
                            onSuccess: resolve,
                            onError: reject,
                        }
                    );
                });
            }

            // 2️⃣ Agar authMode o‘zgargan bo‘lsa
            if (isAuthModeChanged) {
                await new Promise((resolve, reject) => {
                    updateCredential(
                        {
                            url: `${URLS.deviceCredentialType}/${deviceId}`,
                            attributes: {
                                authMode: data.authMode,
                            },
                        },
                        {
                            onSuccess: resolve,
                            onError: reject,
                        }
                    );
                });
            }

            // Agar hech narsa o‘zgarmagan bo‘lsa
            if (!isDisplayChanged && !isAuthModeChanged) {
                toast.info(t('No changes detected'));
                return;
            }

            toast.success(t('Successfully edited!'));
            refetch();
            reset(data);
            initialValuesRef.current = data;

        } catch (e: any) {
            console.error(e);
            toast.error(e?.response?.data?.error?.message || 'Something went wrong');
        }
    };



    return (
        <div className='w-full mt-10'>
            <div className="flex items-center justify-between">
                <LabelledCaption
                    title={t("Edit device settings")}
                    subtitle={t("Add info for device setting")}
                />
                <MyButton variant="primary" onClick={handleClick}>
                    {t("Go to next step")}
                </MyButton>
            </div>
            <MyDivider />
            <form onSubmit={handleSubmit(onSubmit)} className='mt-8'>
                <div className='flex w-full items-center justify-between'>
                    <LabelledCaption
                        className="w-1/2"
                        title={t('Select auth')}
                        subtitle={""}
                    />
                    <div className='w-1/2'>
                        <Controller
                            name="authMode"
                            control={control}
                            render={({ field }) => (
                                <MySelect
                                    placeholder={t("Choose one or more types")}
                                    options={deviceTypeOptions}
                                    value={field.value as any}
                                    onChange={(val) => field.onChange((val as ISelect)?.value ?? val)}
                                    error={!!errors.authMode}
                                    allowedRoles={["ADMIN", "HR"]}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className='flex w-full items-start justify-between mt-8'>
                    <LabelledCaption
                        className="flex-1"
                        title={t('Settings info')}
                        subtitle={t('Short and understandable caption')}
                    />
                    <div className='flex gap-4 flex-col w-1/2'>
                        <Controller
                            name='showName'
                            control={control}
                            render={({ field }) => (
                                <MyToggle
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className='w-full'
                                    label={t("show Name")}
                                />
                            )}
                        />
                        <Controller
                            name='showPicture'
                            control={control}
                            render={({ field }) => (
                                <MyToggle
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className='w-full'
                                    label={t("Show picture")}
                                />
                            )}
                        />
                        <Controller
                            name='voicePrompt'
                            control={control}
                            render={({ field }) => (
                                <MyToggle
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className='w-full'
                                    label={t("Voice prompt")}
                                />
                            )}
                        />
                        <Controller
                            name='showEmployeeNo'
                            control={control}
                            render={({ field }) => (
                                <MyToggle
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className='w-full'
                                    label={t("Show EmployeeNo")}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-end mt-8">
                    <MyButton type='submit' variant="primary">{t('Save changes')}</MyButton>
                </div>
            </form>
        </div>
    );
}

export default DeviceSettings;
