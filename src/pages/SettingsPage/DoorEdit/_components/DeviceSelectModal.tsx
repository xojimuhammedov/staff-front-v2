import { Controller, useForm } from "react-hook-form";
import { MySelect } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import MyModal from "components/Atoms/MyModal";
import { useTranslation } from "react-i18next";

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: (credentialTypes: string[]) => void;
    deviceTypeOptions: { label: string; value: string }[];
    initialValues: string[];
};

type FormValues = {
    credentialTypes: string[];
};

export default function DeviceTypeSelectModal({
    open,
    onClose,
    onConfirm,
    deviceTypeOptions,
    initialValues
}: Props) {

    const { t } = useTranslation();

    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { credentialTypes: initialValues },
    });

    const submitHandler = (data: FormValues) => {
        onConfirm(data.credentialTypes);
    };

    return (
        <MyModal
            modalProps={{ show: open, onClose }}
            headerProps={{ children: <h2>{t("Select device types")}</h2> }}
            bodyProps={{
                children: (
                    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                        <Controller
                            name="credentialTypes"
                            control={control}
                            render={({ field }) => (
                                <MySelect
                                    isMulti
                                    label={t("Device types")}
                                    options={deviceTypeOptions}
                                    value={deviceTypeOptions.filter(o =>
                                        field.value?.includes(o.value)
                                    )}
                                    onChange={(val: any) =>
                                        field.onChange(val?.map((v: any) => v.value) || [])
                                    }
                                    allowedRoles={["ADMIN", "HR"]}
                                />
                            )}
                        />

                        <div className="flex justify-end gap-4">
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
