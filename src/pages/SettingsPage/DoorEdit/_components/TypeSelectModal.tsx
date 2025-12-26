import { MyCheckbox } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyModal from 'components/Atoms/MyModal';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export type Credential = {
    id: number;
    type: string;
    isAssignedToGate: boolean;
};

type FormValues = {
    credentialIds: number[];
};

const TypeSelectModal = ({ onClose, open, employeeId, gateId, setEmployeeId }: any) => {
    const { t } = useTranslation()

    const { data, refetch } = useGetAllQuery<any>({
        key: KEYS.devicesGateEmployee,
        url: `${URLS.devicesGateEmployee}/${gateId}/employee/${employeeId}/credentials`,
        params: {},
        hideErrorMsg: true,
        enabled: Boolean(employeeId)
    })
    const { register, watch, reset, setValue, handleSubmit } = useForm<FormValues>();

    useEffect(() => {
        if (!data) return;

        const checked = data
            .filter((item: any) => item.isAssignedToGate)
            .map((item: any) => item.id);

        reset({
            credentialIds: checked,
        });
    }, [data, reset]);

    const handleClose = () => {
        reset({
            credentialIds: [],
        });
        setEmployeeId(null)
        onClose();
    };

    const selectedIds = watch("credentialIds");

    const toggleId = (id: number) => {
        const exists = selectedIds.includes(id);

        if (exists) {
            setValue(
                "credentialIds",
                selectedIds.filter(v => v !== id)
            );
        } else {
            setValue("credentialIds", [...selectedIds, id]);
        }
    };

    const { mutate: create } = usePostQuery({
        listKeyId: KEYS.deviceGateSyncEmployee,
        hideSuccessToast: true
    });

    const onSubmit = (data: any) => {
        create(
            {
                url: URLS.deviceGateSyncEmployee,
                attributes: {
                    gateId: Number(gateId),
                    employeeId: Number(employeeId),
                    ...data
                }
            },
            {
                onSuccess: () => {
                    toast.success(t('Successfully edited!'));
                    handleClose()
                    refetch()
                },
                onError: (e: any) => {
                    toast.error(e?.response?.data?.error?.message)
                }
            }
        );
    };

    return (
        <MyModal
            modalProps={{ show: open, onClose: handleClose }}
            headerProps={{ children: <h2>{t("Select device types")}</h2> }}
            bodyProps={{
                children: (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-4">
                        <div className="space-y-3">
                            {data?.map((item: any) => (
                                <label
                                    key={item.id}
                                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                                >
                                    <MyCheckbox
                                        {...register("credentialIds")}
                                        className="w-4 h-4"
                                        checked={selectedIds?.includes(item?.id)}
                                        onChange={() => toggleId(item.id)}
                                    />

                                    <span className="font-medium">
                                        {item.type} — {item.code}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end gap-4">
                            <MyButton type="submit" variant="primary">
                                {t("Save changes")}
                            </MyButton>
                            <MyButton type="button" variant="secondary" onClick={handleClose}>
                                {t("Cancel")}
                            </MyButton>
                        </div>
                    </form>
                )
            }}
        />
    );
}

export default TypeSelectModal;
