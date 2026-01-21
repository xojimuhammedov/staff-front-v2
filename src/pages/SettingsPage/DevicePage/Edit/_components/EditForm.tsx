import { yupResolver } from "@hookform/resolvers/yup";
import { MyCheckbox, MyInput, MySelect } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import deviceType from "configs/deviceType";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { useGetAllQuery, useGetOneQuery, usePutQuery } from "hooks/api";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { object, string, array } from "yup";
import { useEffect } from "react";
import { ISelect } from "interfaces/select.interface";
import MyDivider from "components/Atoms/MyDivider";

const checkType = [
    { id: 1, label: "Both", value: "BOTH" },
    { id: 2, label: "Check in", value: "ENTER" },
    { id: 3, label: "Check out", value: "EXIT" },
];

interface FormValues {
    name: string;
    deviceTypes: string[];
    ipAddress: string;
    login: string;
    password: string;
    entryType: string;
}

const EditForm = ({ handleClick, deviceId, deviceData, isLoading }: any) => {
    const { t } = useTranslation();

    const schema = object().shape({
        name: string().required(t("Name is required")),
        deviceTypes: array()
            .of(string())
            .min(1, t("At least one device type must be selected"))
            .required(t("Device type is required")),
        ipAddress: string().required(t("IP address is required")),
        login: string().required(t("Login is required")),
        entryType: string().required(t("Entry type is required")),
    });

    const { data } = useGetAllQuery<any>({
        key: KEYS.getDoorGates,
        url: URLS.getDoorGates,
        params: {}
    });

    const device = deviceData?.data;

    const {
        handleSubmit,
        register,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<any>({
        defaultValues: {
            name: "",
            deviceTypes: [],
            ipAddress: "",
            login: "",
            entryType: "",
            gateId: ""
        },
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (device) {
            reset({
                name: device.name || "",
                deviceTypes: device.type || [],
                ipAddress: device.ipAddress || "",
                login: device.login || "",
                entryType: device.entryType || "",
                gateId: device?.gateId || ""
            });
        }
    }, [device, reset]);

    const { mutate: updateDevice } = usePutQuery({
        listKeyId: KEYS.getDoorForDevices,
        hideSuccessToast: true,
    });

    const onSubmit = (values: FormValues) => {

        updateDevice(
            {
                url: `${URLS.getDoorForDevices}/${deviceId}`,
                attributes: values,
            },
            {
                onSuccess: () => {
                    toast.success(t("Device successfully updated!"));
                },
                onError: (error: any) => {
                    console.error(error);
                    toast.error(
                        error?.response?.data?.error?.message || t("Update failed")
                    );
                },
            }
        );
    };

    const deviceTypeOptions = deviceType?.map((item: any) => ({
        label: item.label,
        value: item.value,
    })) ?? [];

    if (isLoading) {
        return <p className="text-center py-8">{t("Loading device data...")}</p>;
    }
    return (
        <div className='w-full'>
            <div className="flex items-center justify-end gap-4">
                <MyButton onClick={handleClick} variant="primary">
                    {t("Go to next step")}
                </MyButton>
            </div>
            <MyDivider />
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" action="">
                <div className='grid grid-cols-3 gap-6'>
                    <MyInput
                        {...register('name')}
                        error={Boolean(errors?.name?.message)}
                        helperText={t(`${errors?.name?.message}`)}
                        placeholder={t('Enter device name')}
                        label={t('Name')}
                    />
                    <Controller
                        name="deviceTypes"
                        control={control}
                        render={({ field }) => (
                            <MySelect
                                isMulti
                                label={t("Device types")}
                                placeholder={t("Choose one or more types")}
                                options={deviceTypeOptions}
                                value={deviceTypeOptions.filter((opt) =>
                                    field.value?.includes(opt.value)
                                )}
                                onChange={(selected: any) => {
                                    const values = selected ? selected.map((opt: any) => opt.value) : [];
                                    field.onChange(values);
                                }}
                                error={!!errors.deviceTypes}
                                allowedRoles={["ADMIN", "HR"]}
                            />
                        )}
                    />
                    <MyInput
                        {...register('ipAddress')}
                        error={Boolean(errors?.ipAddress?.message)}
                        helperText={t(`${errors?.ipAddress?.message}`)}
                        placeholder={t('Enter ip address')}
                        label={t('Ip address')}
                    />
                    <MyInput
                        {...register('login')}
                        error={Boolean(errors?.login?.message)}
                        helperText={t(`${errors?.login?.message}`)}
                        placeholder={t('Enter device login')}
                        label={t('Login')}
                    />
                    <Controller
                        name="gateId"
                        control={control}
                        render={({ field, fieldState }) => (
                            <MySelect
                                label={t("Select gate")}
                                options={data?.data?.map((evt: any) => ({
                                    label: evt.name,
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
                    <Controller
                        name="entryType"
                        control={control}
                        render={({ field }) => (
                            <div className="flex flex-wrap items-center gap-6">
                                {checkType.map((item) => (
                                    <MyCheckbox
                                        key={item.id}
                                        label={item.label}
                                        checked={field.value === item.value}
                                        onChange={() => field.onChange(item.value)}
                                    />
                                ))}
                            </div>
                        )}
                    />
                </div>
                <div className="flex items-center justify-end gap-4">
                    <MyButton variant="primary">{t('Save changes')}</MyButton>
                </div>
            </form>
        </div>
    );
}

export default EditForm;
