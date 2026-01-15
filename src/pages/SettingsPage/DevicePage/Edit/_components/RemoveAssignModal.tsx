import { Controller, useForm } from "react-hook-form";
import { MySelect } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import MyModal from "components/Atoms/MyModal";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetOneQuery, usePostQuery } from "hooks/api";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import deviceType from "configs/deviceType";

type Props = {
    open: boolean;
    onClose: () => void;
    deviceId: any,
    tempSelectedIds: number[]
};

type FormValues = {
    credentialTypes: string[];
};

export default function RemoveAssignModal({
    open,
    onClose,
    deviceId,
    tempSelectedIds,
}: Props) {
    const navigate = useNavigate()
    const { t } = useTranslation();

    const { data: deviceData } = useGetOneQuery({
        id: deviceId,
        url: URLS.getDoorForDevices,
        params: {},
        enabled: !!deviceId,
    });

    const deviceTypeOptions =
        deviceData?.data?.type?.map((d: any) => ({
            label: d,
            value: d,
        })) ?? [];

    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { credentialTypes: deviceData?.data?.type },
    });

    const { mutate: removeEmployees } = usePostQuery({
        listKeyId: KEYS.removeAssignEmployee,
        hideSuccessToast: true,
    });

    const handleAssign = (data: any) => {
        if (!tempSelectedIds.length)
            return toast.warning(t("Please select at least one employee"));

        removeEmployees(
            {
                url: URLS.removeAssignEmployee,
                attributes: {
                    employeeIds: tempSelectedIds,
                    deviceIds: [deviceId],
                    ...data
                },
            },
            {
                onSuccess: () => {
                    toast.success(t("Saved successfully"));
                    navigate("/settings?current-setting=deviceControl");
                },
                onError: (e: any) =>
                    console.log(e)
            }
        );
    };

    return (
        <MyModal
            modalProps={{ show: open, onClose }}
            headerProps={{ children: <h2>{t("Select device types")}</h2> }}
            bodyProps={{
                children: (
                    <form onSubmit={handleSubmit(handleAssign)} className="space-y-6">
                        <Controller
                            name="credentialTypes"
                            control={control}
                            render={({ field }) => (
                                <MySelect
                                    isMulti
                                    label={t("Device types")}
                                    options={deviceTypeOptions}
                                    value={deviceTypeOptions.filter((o: any) =>
                                        field.value?.includes(o.value)
                                    )}
                                    onChange={(val: any) =>
                                        field.onChange(val?.map((v: any) => v.value) || [])
                                    }
                                    allowedRoles={["ADMIN", "HR"]}
                                />
                            )}
                        />

                        <div className="flex justify-end gap-4 mb-4">
                            <MyButton type="submit" variant="primary">
                                {t("Confirm and Add Employees")}
                            </MyButton>

                            <MyButton type="button" variant="secondary" onClick={onClose}>
                                {t("Cancel")}
                            </MyButton>
                        </div>
                    </form>
                )
            }}
        />
    );
}
