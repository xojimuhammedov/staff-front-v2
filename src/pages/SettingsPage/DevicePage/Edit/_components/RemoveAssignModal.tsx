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
import storage from "services/storage";
import { useMemo, useState } from "react";
import { useEventsSocket } from "hooks/useSocket";

type Props = {
    open: boolean;
    onClose: () => void;
    deviceId: any,
    tempSelectedIds: number[];
    refetch: () => void;
    hikvisionRefetch: () => void;
};

type FormValues = {
    credentialTypes: string[];
};

export default function RemoveAssignModal({
    open,
    onClose,
    deviceId,
    tempSelectedIds,
    refetch,
    hikvisionRefetch
}: Props) {
    const navigate = useNavigate()
    const { t } = useTranslation();
    const [jobId, setJobId] = useState<string | number | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    useEventsSocket({
        jobId,
        onStart: () => {
            // ixtiyoriy: start kelsa ham loading true bo‘lsin
            setLoading(true);
        },
        onProgress: (p) => {
            // progress UI qilish mumkin
            // console.log("progress", p);
        },
        onError: (msg) => {
            setLoading(false);
            toast.error(msg);
            setJobId(undefined);
        },
        onDone: ({ status, data }) => {
            setLoading(false);

            if (status === "failed") {
                toast.error("Job failed");
                setJobId(undefined);
                return;
            }

            // ✅ hamma jarayon tugagach
            refetch();
            hikvisionRefetch();
            toast.success(t("Saved successfully"));
            onClose();
            navigate("/settings?current-setting=deviceControl");
            setJobId(undefined);
        },
    });


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
        setLoading(true);
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
                onSuccess: (response) => {
                    const ok = response?.data?.success;
                    const jid = response?.data?.jobId;

                    if (ok && jid) {
                        // ✅ API success + jobId => socket ishga tushadi
                        setJobId(jid);
                        // loading true qoladi, socket completed/failed bo‘lganda false bo‘ladi
                    } else {
                        setLoading(false);
                        toast.error("JobId not found or success=false");
                    }
                },
                onError: (e: any) => {
                    setLoading(false);
                    console.log(e);
                    toast.error("Request failed");
                },
            }
        );
        [tempSelectedIds, deviceId]
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
                            <MyButton disabled={loading} type="submit" variant="primary">
                                {loading ? t("Processing...") : t("Confirm and Add Employees")}
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
