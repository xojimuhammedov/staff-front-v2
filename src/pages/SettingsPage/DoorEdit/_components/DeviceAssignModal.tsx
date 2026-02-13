import { Controller, useForm } from 'react-hook-form';
import { MySelect } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyModal from 'components/Atoms/MyModal';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { usePostQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useState } from 'react';
import { useEventsSocket } from 'hooks/useSocket';
import deviceType from 'configs/deviceType';
import { ISelect } from 'interfaces/select.interface';

type Props = {
  open: boolean;
  onClose: () => void;
  deviceId: any;
  tempSelectedIds: number[];
  refetch: () => void;
  setStatusRefetch: (value: string) => void;
};

type FormValues = {
  credentialTypes: string[];
};

type Option = { label: string; value: string };

export default function DeviceAssignModal({
  open,
  onClose,
  deviceId,
  tempSelectedIds,
  refetch,
  setStatusRefetch,
}: Props) {
  const { t } = useTranslation();
  const [jobId, setJobId] = useState<string | number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { credentialTypes: [] },
  });

  const options: Option[] =
    deviceType?.map((evt: any) => ({
      label: evt.label,
      value: evt.value,
    })) ?? [];

  useEventsSocket({
    jobId,
    onStart: () => {
      setLoading(true);
    },
    onProgress: (p) => {},
    onError: (msg) => {
      setLoading(false);
      toast.error(msg);
      setJobId(undefined);
    },
    onDone: ({ status, data }) => {
      setLoading(false);

      if (status === 'failed') {
        toast.error('Job failed');
        setJobId(undefined);
        return;
      }

      refetch();
      onClose();
      reset();
      toast.success(t('Saved successfully'));
      setJobId(undefined);
      setStatusRefetch('assignRefetch');
    },
  });

  const { mutate: assignEmployees } = usePostQuery({
    listKeyId: KEYS.devicesEmployeeAssign,
    hideSuccessToast: true,
  });

  const handleAssign = (data: any) => {
    if (!tempSelectedIds.length) return toast.warning(t('Please select at least one employee'));
    setLoading(true);
    assignEmployees(
      {
        url: URLS.devicesEmployeeAssign,
        attributes: {
          employeeIds: tempSelectedIds,
          deviceIds: deviceId,
          ...data,
        },
      },
      {
        onSuccess: (response) => {
          const ok = response?.data?.success;
          const jid = response?.data?.jobId;

          if (ok && jid) {
            setJobId(jid);
          } else {
            setLoading(false);
            toast.error('JobId not found or success=false');
          }
        },
        onError: (e: any) => {
          setLoading(false);
          console.log(e);
          toast.error('Request failed');
        },
      }
    );
    [tempSelectedIds, deviceId];
  };

  return (
    <MyModal
      modalProps={{ show: open, onClose }}
      headerProps={{ children: <h2>{t('Select device types')}</h2> }}
      bodyProps={{
        children: (
          <form onSubmit={handleSubmit(handleAssign)} className="space-y-6">
            <Controller
              name="credentialTypes"
              control={control}
              render={({ field }) => {
                const selectedOptions = options.filter((opt: any) =>
                  Array.isArray(field.value) ? field.value.includes(opt.value) : false
                );
                return (
                  <MySelect
                    isMulti
                    label={t('Device types')}
                    options={options}
                    value={selectedOptions as any}
                    onChange={(
                      vals: ISelect | ISelect[] | string | string[] | number | number[]
                    ) => {
                      const selectedArray = Array.isArray(vals) ? vals : [];
                      const arr = selectedArray.map((v) =>
                        typeof v === 'object' && 'value' in v ? v.value : v
                      );
                      field.onChange(arr);
                    }}
                    allowedRoles={['ADMIN', 'HR']}
                  />
                );
              }}
            />

            <div className="flex justify-end gap-4 mb-4">
              <MyButton disabled={loading} type="submit" variant="primary">
                {loading ? t('Processing...') : t('Confirm and Add Employees')}
              </MyButton>

              <MyButton type="button" variant="secondary" onClick={onClose}>
                {t('Cancel')}
              </MyButton>
            </div>
          </form>
        ),
        className: 'py-4',
      }}
    />
  );
}
