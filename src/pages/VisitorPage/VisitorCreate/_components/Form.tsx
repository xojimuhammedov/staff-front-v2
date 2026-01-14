import { MyInput, MySelect } from 'components/Atoms/Form';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { useTranslation } from 'react-i18next';
import { KEYS } from 'constants/key';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { toast } from 'react-toastify';
import { URLS } from 'constants/url';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import { ISelect } from 'interfaces/select.interface';
import * as yup from 'yup';
import storage from 'services/storage';
import { useNavigate } from 'react-router-dom';
import MyDateTimeRangePicker from 'components/Atoms/Form/MyDateTimeRangePicker';

function Form() {
  const userData: any = storage.get('userData');
  const userRole = JSON.parse(userData)?.role;

  const { data } = useGetAllQuery<any>({
    key: KEYS.getAllListOrganization,
    url: URLS.getAllListOrganization,
    params: {},
    hideErrorMsg: true,
  });

  const { data: employeeData } = useGetAllQuery<any>({
    key: KEYS.getEmployeeList,
    url: URLS.getEmployeeList,
    params: {},
  });

  const { t } = useTranslation();
  const navigate = useNavigate();

  const visitorSchema = object().shape({
    firstName: string().required(),
    lastName: string().required(),
    middleName: string(),
    birthday: object() || null,
    additionalDetails: string(),
    phone: string(),
    pinfl: string(),
    workPlace: string(),
    passportNumber: string(),
    attachId: yup.number(),
    organizationId: yup
      .number()
      .when('$role', (role: any, schema) =>
        role === 'ADMIN' ? schema.required() : schema.optional()
      ),
  });

  const onetimeCodeSchema = object().shape({
    codeType: string().required(),
    startDate: yup.mixed().required(),
    endDate: yup.mixed().required(),
    additionalDetails: string(),
    isActive: yup.boolean(),
  });

  // Visitor form
  const {
    handleSubmit: handleVisitorSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      birthday: { startDate: null, endDate: null },
    },
    mode: 'onChange',
    resolver: yupResolver(visitorSchema),
    context: { role: userRole },
  });

  // Onetime code form
  const {
    handleSubmit: handleOnetimeCodeSubmit,
    control: onetimeCodeControl,
    getValues: getOnetimeCodeValues,
    formState: { errors: onetimeCodeErrors },
  } = useForm<any>({
    defaultValues: {
      codeType: '',
      startDate: null,
      endDate: null,
      additionalDetails: '',
      isActive: true,
    },
    mode: 'onChange',
    resolver: yupResolver(onetimeCodeSchema),
  });

  const { mutate: createVisitor } = usePostQuery({
    listKeyId: KEYS.getVisitorList,
    hideSuccessToast: true,
  });

  const { mutate: createOnetimeCode } = usePostQuery({
    listKeyId: KEYS.getOnetimeCodes,
    hideSuccessToast: true,
  });

  const onSubmitVisitor = (visitorData: any) => {
    const { attachId, ...visitorDataWithoutAttachId } = visitorData;
    
    const formattedData = {
      ...visitorDataWithoutAttachId,
      birthday: visitorData.birthday?.startDate
        ? dayjs(visitorData.birthday.startDate).format('YYYY-MM-DD')
        : null,
    };
    createVisitor(
      {
        url: URLS.getVisitorList,
        attributes: formattedData,
      },
      {
        onSuccess: (response: any) => {
          const visitorId = response?.data?.id || response?.id;
          if (visitorId) {
            const onetimeCodeData = getOnetimeCodeValues();
            if (onetimeCodeData.codeType && onetimeCodeData.startDate && onetimeCodeData.endDate) {
              const formattedOnetimeCodeData = {
                visitorId: visitorId,
                codeType: onetimeCodeData.codeType,
                startDate: dayjs(onetimeCodeData.startDate).toISOString(),
                endDate: dayjs(onetimeCodeData.endDate).toISOString(),
                additionalDetails: onetimeCodeData.additionalDetails || '',
                isActive: onetimeCodeData.isActive ?? true,
              };

              createOnetimeCode(
                {
                  url: URLS.getOnetimeCodes,
                  attributes: formattedOnetimeCodeData,
                },
                {
                  onSuccess: () => {
                    toast.success(t('Successfully created!'));
                    navigate('/visitor');
                  },
                  onError: (e: any) => {
                    console.log(e);
                    toast.error(e?.response?.data?.error?.message || t('Error creating onetime code'));
                  },
                }
              );
            } else {
              toast.success(t('Successfully created!'));
              navigate('/visitor');
            }
          } else {
            toast.success(t('Successfully created!'));
            navigate('/visitor');
          }
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message);
        },
      }
    );
  };
  const codeTypeOptions = [
    {
      label: 'ONETIME',
      value: 'ONETIME',
    },
    {
      label: 'MULTIPLE',
      value: 'MULTIPLE',
    },
  ];
  return (
    <>
      <form onSubmit={handleVisitorSubmit(onSubmitVisitor)}>
        <div className="grid grid-cols-2 gap-4 w-2/4">
          <MyInput
            {...register('firstName')}
            error={Boolean(errors?.firstName?.message)}
            helperText={t(`${errors?.firstName?.message}`)}
            label={t('Visitor full name')}
          />
          <MyInput
            {...register('lastName')}
            error={Boolean(errors?.lastName?.message)}
            helperText={t(`${errors?.lastName?.message}`)}
            label={t('Visitor short name')}
          />
          <MyInput
            {...register('middleName')}
            error={Boolean(errors?.middleName?.message)}
            helperText={t(`${errors?.middleName?.message}`)}
            label={t('Visitor email')}
          />
          <MyInput
            {...register('workPlace')}
            error={Boolean(errors?.workPlace?.message)}
            helperText={t(`${errors?.workPlace?.message}`)}
            label={t('Visitor address')}
          />
          <MyInput
            {...register('additionalDetails')}
            error={Boolean(errors?.additionalDetails?.message)}
            helperText={t(`${errors?.additionalDetails?.message}`)}
            label={t('Visitor details')}
          />
          <MyInput
            {...register('phone')}
            error={Boolean(errors?.phone?.message)}
            helperText={t(`${errors?.phone?.message}`)}
            type="tel"
            placeholder="+998 (_ _)  _ _ _  _ _  _ _"
            label={t('Phone number')}
          />
          <MyTailwindPicker
            name="birthday"
            control={control}
            asSingle={true}
            placeholder="Select birthday"
            label={t('Birthday')}
            useRange={false}
            startIcon={<Calendar stroke="#9096A1" />}
          />
          <MyInput
            {...register('pinfl')}
            error={Boolean(errors?.pinfl?.message)}
            helperText={t(`${errors?.pinfl?.message}`)}
            type="tel"
            label={t('Pinfl')}
          />
          <MyInput
            {...register('passportNumber')}
            error={Boolean(errors?.passportNumber?.message)}
            helperText={t(`${errors?.passportNumber?.message}`)}
            type="tel"
            label={t('Passport Number')}
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
            name="attachId"
            control={control}
            render={({ field, fieldState }) => (
              <MySelect
                label={t('Select employee for attach')}
                options={employeeData?.data?.map((evt: any) => ({
                  label: evt.name,
                  value: evt.id,
                }))}
                value={field.value as any}
                onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                onBlur={field.onBlur}
                error={!!fieldState.error}
                allowedRoles={['ADMIN', 'HR', 'GUARD', 'DEPARTMENT_LEAD']}
              />
            )}
          />
          <Controller
            name="codeType"
            control={onetimeCodeControl}
            render={({ field, fieldState }) => (
              <MySelect
                label={t('Select code type')}
                options={codeTypeOptions}
                value={field.value as any}
                onChange={(val) => {
                  if (val && typeof val === 'object' && !Array.isArray(val) && 'value' in val) {
                    field.onChange((val as ISelect).value);
                  } else {
                    field.onChange(val);
                  }
                }}
                onBlur={field.onBlur}
                error={!!fieldState.error}
                allowedRoles={['ADMIN', 'HR', 'GUARD', 'DEPARTMENT_LEAD']}
              />
            )}
          />
          <Controller
            name="startDate"
            control={onetimeCodeControl}
            render={({ field, fieldState }) => (
              <MyDateTimeRangePicker
                label={t('Start time')}
                value={field.value}
                onChange={field.onChange}
                placeholder={t('Select date and time')}
                error={!!fieldState.error}
              />
            )}
          />
          <Controller
            name="endDate"
            control={onetimeCodeControl}
            render={({ field, fieldState }) => (
              <MyDateTimeRangePicker
                label={t('End time')}
                value={field.value}
                onChange={field.onChange}
                placeholder={t('Select date and time')}
                error={!!fieldState.error}
              />
            )}
          />
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
