import { yupResolver } from "@hookform/resolvers/yup";
import { MyCheckbox, MyInput, MySelect } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import deviceType from "configs/deviceType";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { useGetOneQuery, usePutQuery } from "hooks/api";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { object, string, array } from "yup";
import { useEffect } from "react";

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

interface FormDeviceEditProps {
    setOpenModal: (open: boolean) => void;
    deviceId: number | string;
    refetch: () => void;
}

function FormDeviceEdit({
    setOpenModal,
    deviceId,
    refetch,
}: FormDeviceEditProps) {
    const { t } = useTranslation();

    const schema = object().shape({
        name: string().required(t("Name is required")),
        deviceTypes: array()
            .of(string())
            .min(1, t("At least one device type must be selected"))
            .required(t("Device type is required")),
        ipAddress: string().required(t("IP address is required")),
        login: string().required(t("Login is required")),
        password: string().required(t("Password is required")),
        entryType: string().required(t("Entry type is required")),
    });

    const { data: deviceData, isLoading } = useGetOneQuery({
        id: deviceId,
        url: URLS.getDoorForDevices,
        params: {},
        enabled: !!deviceId,
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
            password: "",
            entryType: "",
        },
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    // Ma'lumotlar kelganda formani to'ldirish
    useEffect(() => {
        if (device) {
            reset({
                name: device.name || "",
                deviceTypes: device.deviceTypes || [], // backenddan massiv sifatida keladi deb faraz qilamiz
                ipAddress: device.ipAddress || "",
                login: device.login || "",
                password: device.password || "", // agar password kelmasa, bo'sh qoldiriladi (xavfsizlik uchun)
                entryType: device.entryType || "",
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
                    setOpenModal(false);
                    refetch();
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
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <MyInput
                label={t("Name")}
                placeholder={t("Enter device name")}
                {...register("name")}
                error={!!errors.name}
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

            {/* IP Address */}
            <MyInput
                label={t("Ip address")}
                placeholder={t("Enter ip address")}
                {...register("ipAddress")}
                error={!!errors.ipAddress}
            />

            {/* Login */}
            <MyInput
                label={t("Login")}
                placeholder={t("Enter device login")}
                {...register("login")}
                error={!!errors.login}
            />

            {/* Password */}
            <MyInput
                label={t("Password")}
                placeholder={t("Enter new password (leave blank to keep current)")}
                type="password"
                {...register("password")}
                error={!!errors.password}
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t("Entry type")}
                </label>
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

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4 mt-6">
                <MyButton
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                >
                    Save changes
                </MyButton>
                <MyButton
                    type="button"
                    variant="secondary"
                    onClick={() => setOpenModal(false)}
                >
                    {t("Cancel")}
                </MyButton>
            </div>
        </form>
    );
}

export default FormDeviceEdit;