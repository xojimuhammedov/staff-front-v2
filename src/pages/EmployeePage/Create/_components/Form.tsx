import { MyCheckbox, MyInput, MySelect } from 'components/Atoms/Form';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { get } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Department } from 'pages/DepartmentsPage/interface/department.interface';
import { ISelect } from 'interfaces/select.interface';
import { toast } from 'react-toastify';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import storage from 'services/storage';
import AvatarUpload from '../../_components/AvatarUpload';
import MyToggle from 'components/Atoms/MyToggle/MyToggle';

interface Credential {
  code: string;
  type: 'CAR' | 'QR';
  additionalDetails: string;
}

function Form() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage;
  const userData: any = storage.get('userData');
  const userRole = JSON.parse(userData)?.role;
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([
    {
      code: '',
      type: 'QR',
      additionalDetails: '',
    },
  ]);
  const navigate = useNavigate();

  const { data } = useGetAllQuery<any>({
    key: KEYS.getAllListOrganization,
    url: URLS.getAllListOrganization,
    params: {},
    hideErrorMsg: true,
  });

  const { data: scheduleData } = useGetAllQuery<any>({
    key: KEYS.employeeSchedulePlan,
    url: URLS.employeeSchedulePlan,
    params: {
      page: 1,
      limit: 100,
    },
    hideErrorMsg: true,
  });

  const { data: jobData } = useGetAllQuery<any>({
    key: KEYS.employeeJobPosition,
    url: URLS.employeeJobPosition,
    params: {},
    hideErrorMsg: true,
  });

  const schema = object().shape({
    name: string().required(),
    email: yup.string().transform((v) => (v === '' ? undefined : v)),
    phone: yup.string().transform((v) => (v === '' ? undefined : v)),
    address: yup.string().transform((v) => (v === '' ? undefined : v)),
    departmentId: yup
      .number()
      .when('$role', (role: any, schema) =>
        role === 'ADMIN' || 'HR' ? schema.required() : schema.optional()
      ),
    organizationId: yup
      .number()
      .when('$role', (role: any, schema) =>
        role === 'ADMIN' ? schema.required() : schema.optional()
      ),
    additionalDetails: yup.string().transform((v) => (v === '' ? undefined : v)),
    gender: yup
      .string()
      .oneOf(['MALE', 'FEMALE'])
      .transform((v) => (v === '' ? undefined : v)),
    birthday: yup.string().transform((v) => (v === '' ? undefined : v)),
    employeePlanId: yup.number().transform((v) => (isNaN(v) ? undefined : v)),
    jobId: yup.number().required(),
    isWhitelist: yup.boolean().transform((v) => (v === undefined ? false : v)),
  });
  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { isWhitelist: false },
    mode: 'onChange',
    resolver: yupResolver(schema),
    context: { role: userRole },
  });

  const { mutate: create } = usePostQuery({
    listKeyId: KEYS.getEmployeeList,
    hideSuccessToast: true,
  });

  const onSubmit = (data: any) => {
    create(
      {
        url: URLS.getEmployeeList,
        attributes: {
          photo: imageKey,
          isActive: true,
          isWhitelist: Boolean(data.isWhitelist),
          ...data,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully created!'));
          navigate('/employees');
        },
        onError: (e: any) => {
          toast.error(e?.response?.data?.error?.message);
        },
      }
    );
  };

  const { data: getDepartment } = useGetAllQuery<any>({
    key: KEYS.getAllListDepartment,
    url: URLS.getAllListDepartment,
    params: {
      organizationId: watch('organizationId'),
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="sm:w-full lg:w-2/3 flex gap-6 justify-between">
          <div className="grid grid-cols-2 gap-4 w-3/4">
            <MyInput
              {...register('name')}
              error={Boolean(errors?.name?.message)}
              helperText={t(`${errors?.name?.message}`)}
              label={t('Employee name')}
            />
            <MyInput
              {...register('address')}
              error={Boolean(errors?.address?.message)}
              helperText={t(`${errors?.address?.message}`)}
              label={t('Employee address')}
            />
            <MyInput
              {...register('phone')}
              error={Boolean(errors?.phone?.message)}
              helperText={t(`${errors?.phone?.message}`)}
              label={t('Employee phone number')}
            />
            <MyInput
              {...register('email')}
              error={Boolean(errors?.email?.message)}
              helperText={t(`${errors?.email?.message}`)}
              label={t('Employee email')}
            />
            <MyInput
              {...register('additionalDetails')}
              error={Boolean(errors?.additionalDetails?.message)}
              helperText={t(`${errors?.additionalDetails?.message}`)}
              label={t('Employee details')}
            />
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <MySelect
                  label={t('Gender')}
                  options={[
                    { label: t('Male'), value: 'MALE' },
                    { label: t('Female'), value: 'FEMALE' },
                  ]}
                  value={field.value as any}
                  onChange={(val) => field.onChange((val as ISelect)?.value ?? val)}
                  onBlur={field.onBlur}
                  allowedRoles={['ADMIN', 'HR']}
                />
              )}
            />
            <MyInput
              {...register('birthday')}
              type="date"
              error={Boolean(errors?.birthday?.message)}
              helperText={t(`${errors?.birthday?.message}`)}
              label={t('Birthday')}
            />
            <Controller
              name="jobId"
              control={control}
              render={({ field, fieldState }) => (
                <MySelect
                  label={t('Select position')}
                  options={get(jobData, 'items')?.map((evt: any) => ({
                    label: evt[`${currentLang}`],
                    value: evt.id,
                  }))}
                  value={field.value as any} // 👈 cast to any
                  onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                  allowedRoles={['ADMIN', 'HR']}
                />
              )}
            />
            <Controller
              name="organizationId"
              control={control}
              render={({ field, fieldState }) => (
                <MySelect
                  label={t('Select organization')}
                  options={data?.data?.map((evt: any) => ({
                    label: evt.fullName,
                    value: evt.id,
                  }))}
                  value={field.value as any}
                  onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                  allowedRoles={['ADMIN']}
                />
              )}
            />
            <Controller
              name="departmentId"
              control={control}
              render={({ field, fieldState }) => (
                <MySelect
                  label={t('Select department')}
                  options={get(getDepartment, 'data')?.map((evt: Department) => ({
                    label: evt.fullName,
                    value: evt.id,
                  }))}
                  value={field.value as any} // 👈 cast to any
                  onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                  allowedRoles={['ADMIN', 'HR']}
                />
              )}
            />
            <Controller
              name="employeePlanId"
              control={control}
              render={({ field, fieldState }) => (
                <MySelect
                  label={t('Select schedule')}
                  options={get(scheduleData, 'data', [])?.map((row: any) => ({
                    label: row?.name,
                    value: row?.id,
                  }))}
                  value={field.value as any} // 👈 cast to any
                  onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                  allowedRoles={['ADMIN', 'HR']}
                />
              )}
            />
            <Controller
              name="isWhitelist"
              control={control}
              render={({ field }) => (
                <MyToggle
                  checked={!!field.value}
                  onChange={field.onChange}
                  className="w-full"
                  label={t('Add to whitelist')}
                />
              )}
            />
          </div>
          <AvatarUpload onChangeImageKey={setImageKey} />
        </div>
        <MyDivider />
        <MyButton type="submit" className={'mt-3'} variant="primary">
          {t('Add & Save')}
        </MyButton>
      </form>
    </>
  );
}

export default Form;
