import { yupResolver } from '@hookform/resolvers/yup';
import { MySelect, MyTextarea } from 'components/Atoms/Form';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyModal from 'components/Atoms/MyModal';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePutQuery } from 'hooks/api';
import { ISelect } from 'interfaces/select.interface';
import { Calendar } from 'lucide-react';
import { Organization } from 'pages/OrganizationPage/interface/organization.interface';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { object } from 'yup';
import dayjs from 'dayjs';
import type { AbsenceItem } from './AbsenceCard';

type EditProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch?: () => void;
  employeeId?: number | string;
  item?: AbsenceItem | null;
};

const Edit = ({ open, setOpen, refetch, employeeId, item }: EditProps) => {
  const { t, i18n } = useTranslation();
  
  const { mutate: update } = usePutQuery({
    listKeyId: KEYS.employeeAbsences,
    hideSuccessToast: true,
  });

  const { data } = useGetAllQuery<any>({
    key: KEYS.getAllListOrganization,
    url: URLS.getAllListOrganization,
    hideErrorMsg: true,
    params: {},
  });

  const langSuffix = useMemo(() => {
    const currentLang = i18n.resolvedLanguage ?? 'en';
    return currentLang.startsWith('ru') ? 'Ru' : currentLang.startsWith('uz') ? 'Uz' : 'Eng';
  }, [i18n.resolvedLanguage]);

  const schema = object().shape({
    organizationId: yup.number().required(),
    absenceId: yup
      .number()
      .nullable()
      .when('organizationId', {
        is: (value: number | null | undefined) => Boolean(value),
        then: (currentSchema) => currentSchema.required(),
        otherwise: (currentSchema) => currentSchema.nullable(),
      }),
    description: yup.string().required(),
    date: yup.object().nullable(),
  });

  const { handleSubmit, register, control, watch, setValue, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      organizationId: undefined as unknown as number,
      absenceId: null as unknown as number,
      description: '',
      date: null as any,
    },
  });

  const organizationId = watch('organizationId');

  const { data: absenceData } = useGetAllQuery<any>({
    key: KEYS.absences,
    url: URLS.absences,
    hideErrorMsg: true,
    params: {
      organizationId,
    },
    enabled: Boolean(organizationId),
  });

  useEffect(() => {
    if (!open || !item) return;
    reset({
      organizationId: item.organizationId as any,
      absenceId: (item.absenceId ?? item.absence?.id ?? null) as any,
      description: item.description ?? '',
      date:
        item.startTime || item.endTime
          ? {
              startDate: item.startTime ? dayjs(item.startTime).format('YYYY-MM-DD') : null,
              endDate: item.endTime ? dayjs(item.endTime).format('YYYY-MM-DD') : null,
            }
          : null,
    });
  }, [open, item, reset]);

  const onSubmit = (formData: any) => {
    if (!item?.id) return;
    const startTime = formData?.date?.startDate ? dayjs(formData.date.startDate).toISOString() : undefined;
    const endTime = formData?.date?.endDate ? dayjs(formData.date.endDate).toISOString() : undefined;
    const { date, ...rest } = formData;
    update(
      {
        url: `${URLS.employeeAbsences}/${item.id}`,
        attributes: {
          ...rest,
          startTime,
          endTime,
          employeeId: employeeId ? Number(employeeId) : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully edited!'));
          setOpen(false);
          refetch?.();
        },
        onError: () => {
          toast.error(t('An error occurred!'));
        },
      }
    );
  };

  return (
    <MyModal
      modalProps={{
        show: Boolean(open),
        onClose: () => setOpen(false),
        size: '3xl',
      }}
      headerProps={{
        children: <h2 className="dark:text-text-title-dark">{t('Edit absence')}</h2>,
        className: 'relative z-10',
      }}
      bodyProps={{
        children: (
          <form onSubmit={handleSubmit(onSubmit)} action="">
            <div className="grid grid-cols-1 gap-4">
              <Controller
                name="organizationId"
                control={control}
                render={({ field, fieldState }) => (
                  <MySelect
                    label={t('Select organization')}
                    options={data?.data?.map((evt: Organization) => ({
                      label: evt.fullName,
                      value: evt.id,
                    }))}
                    value={field.value as any}
                    onChange={(val) => {
                      field.onChange(Number((val as ISelect)?.value ?? val));
                      setValue('absenceId', null, { shouldValidate: false, shouldDirty: true });
                    }}
                    onBlur={field.onBlur}
                    error={!!fieldState.error}
                    allowedRoles={['ADMIN', 'DEPARTMENT_LEAD']}
                    required
                  />
                )}
              />
              <Controller
                name="absenceId"
                control={control}
                render={({ field, fieldState }) => (
                  <MySelect
                    label={t('Absence')}
                    options={(absenceData?.data ?? absenceData?.items ?? []).map((absenceItem: any) => ({
                      label: absenceItem?.[`shortLetter${langSuffix}`] ?? absenceItem?.name ?? '--',
                      value: absenceItem?.id,
                    }))}
                    value={field.value as any}
                    onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                    onBlur={field.onBlur}
                    error={!!fieldState.error}
                    allowedRoles={['ADMIN', 'HR', 'DEPARTMENT_LEAD']}
                    required
                  />
                )}
              />
              <MyTextarea
                label={t('Description')}
                {...register('description')}
                className="dark:bg-bg-input-dark dark:text-text-title-dark"
                required
              />
              <MyTailwindPicker
                useRange={true}
                name="date"
                asSingle={false}
                control={control}
                placeholder={t('Today')}
                label={t("Select date")}
                startIcon={<Calendar className="stroke-text-muted" />}
              />
            </div>
            <div className="mt-2 flex items-center justify-end gap-4">
              <MyButton variant="primary" type="submit">
                {t('Save changes')}
              </MyButton>
              <MyButton onClick={() => setOpen(false)} variant="secondary">
                {t('Close')}
              </MyButton>
            </div>
          </form>
        ),
        className: 'py-[10px] overflow-visible relative z-20',
      }}
    />
  );
};

export default Edit;
