import { yupResolver } from '@hookform/resolvers/yup';
import { MySelect, MyTextarea } from 'components/Atoms/Form';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyModal from 'components/Atoms/MyModal';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { ISelect } from 'interfaces/select.interface';
import { Calendar, Plus } from 'lucide-react';
import { Organization } from 'pages/OrganizationPage/interface/organization.interface';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { object } from 'yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import storage from 'services/storage';

type CreateProps = {
  refetch?: () => void;
  employeeId?: number | string;
};

const Create = ({ refetch, employeeId }: CreateProps) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const userData: any = storage.get("userData")
  const userRole = JSON.parse(userData)?.role

  const { mutate: create } = usePostQuery({
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
    organizationId: yup
    .number()
    .when('$role', (role: any, schema) =>
      role === 'ADMIN' ? schema.required() : schema.optional()
    ),
    absenceId: yup
      .number()
      .nullable()
      .when('organizationId', {
        is: (value: number | null | undefined) => Boolean(value),
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.nullable(),
      }),
    description: yup.string().required(),
    date: yup.object().nullable(),
  });


  const { handleSubmit, register, control, watch, setValue } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      absenceId: null as unknown as number,
    },
    context: { role: userRole }
  });

  const organizationId = watch('organizationId');

  const { data: absenceData } = useGetAllQuery<any>({
    key: KEYS.absences,
    url: URLS.absences,
    hideErrorMsg: true,
    params: {
      organizationId,
    },
  });

  const onSubmit = (formData: any) => {
    const startTime = formData?.date?.startDate
      ? dayjs(formData.date.startDate).toISOString()
      : undefined;
    const endTime = formData?.date?.endDate
      ? dayjs(formData.date.endDate).toISOString()
      : undefined;
    const { date, ...rest } = formData;
    create(
      {
        url: URLS.employeeAbsences,
        attributes: {
          ...rest,
          startTime,
          endTime,
          employeeId: employeeId ? Number(employeeId) : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully created!'));
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
    <>
      <MyButton
        onClick={() => {
          setOpen(true);
        }}
        allowedRoles={['ADMIN', 'HR', 'DEPARTMENT_LEAD']}
        startIcon={<Plus />}
        variant="primary"
        className={`text-sm min-w-max [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
      >
        {t('Create absence')}
      </MyButton>
      <MyModal
        modalProps={{
          show: Boolean(open),
          onClose: () => setOpen(false),
          size: '3xl',
        }}
        headerProps={{
          children: <h2 className="dark:text-text-title-dark">{t('Absence')}</h2>,
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
                      allowedRoles={['ADMIN']}
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
                      options={(absenceData?.data ?? absenceData?.items ?? []).map((item: any) => ({
                        label: `${item?.[`shortLetter${langSuffix}`]} (${item?.[`description${langSuffix}`]})`,
                        value: item?.id,
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
                  label={t('Select date')}
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
    </>
  );
};
export default Create;
