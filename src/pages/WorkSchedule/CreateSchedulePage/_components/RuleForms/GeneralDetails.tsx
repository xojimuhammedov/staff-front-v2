import { MyCheckbox, MyInput, MySelect, MyTextarea } from 'components/Atoms/Form';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Organization } from 'pages/OrganizationPage/interface/organization.interface';
import { ISelect } from 'interfaces/select.interface';
import * as yup from "yup";
import MyTimePicker from 'components/Atoms/Form/MyTimePicker';
import weekDay from 'configs/weekday';
import { useState } from 'react';

const GeneralDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [workingWeekDays, setWorkingWeekDays] = useState<string[]>([]);

  const schema = object().shape({
    name: string().required(),
    addadditionalDetails: string(),
    startTime: string(),
    endTime: string(),
    extraTime: string(),
    organizationId: yup.number(),
  });

  const handleChangeWorking = (value: string) => {
    setWorkingWeekDays((prevDays: string[]) =>
      prevDays.includes(value) ? prevDays.filter((day) => day !== value) : [...prevDays, value]
    );
  };


  const {
    handleSubmit,
    register,
    control,
    formState: { errors }
  } = useForm<any>({
    defaultValues: {
      weekdays: "Mon,Fri",
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const { data } = useGetAllQuery<any>({
    key: KEYS.getAllListOrganization,
    url: URLS.getAllListOrganization,
    params: {}
  })

  const { mutate: create } = usePostQuery({
    listKeyId: KEYS.employeeSchedulePlan,
    hideSuccessToast: true
  });

  const onSubmit = (data: any) => {
    create(
      {
        url: URLS.employeeSchedulePlan,
        attributes: {
          weekdays: workingWeekDays,
          ...data
        }
      },
      {
        onSuccess: (data) => {
          navigate(`/workschedule/create?current-step=1&current-rule=employee-groups&schedule=${data?.data?.id}`);
          toast.success(t('Successfully created!'));
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message || 'ERROR');
        }
      }
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <LabelledCaption
          title={t('Schedule details')}
          subtitle={t('Edit module name and description')}
        />
        <MyDivider className="mb-3xl" />
        <div className="mb-12 flex w-full items-start justify-between">
          <LabelledCaption
            className="flex-1"
            title={t('Schedule name')}
            subtitle={t('Short and easy-to-understand name')}
          />
          <MyInput
            {...register('name')}
            error={Boolean(errors?.name?.message)}
            helperText={t(`${errors?.name?.message}`)}
            rootClassName="max-w-[462px]"
            placeholder={t('Enter schedule name')}
          />
        </div>

        <div className="mb-12 flex w-full items-start justify-between">
          <LabelledCaption
            className="flex-1"
            title={t('Schedule details')}
            subtitle={t('Short and easy-to-understand name')}
          />
          <MyTextarea
            {...register('addadditionalDetails')}
            error={Boolean(errors?.addadditionalDetails?.message)}
            helperText={t(`${errors?.addadditionalDetails?.message}`)}
            rootClassName="max-w-[462px]"
            placeholder={t('Enter schedule details')}
          />
        </div>
        <div className='mb-12 flex w-full items-start justify-between'>
          <LabelledCaption
            className="flex-1"
            title={t('Schedule details')}
            subtitle={t('Short and easy-to-understand name')}
          />
          <div className='flex flex-col gap-4'>
            <div className="grid grid-cols-2 gap-4 w-[462px]">
              <Controller
                name="startTime"
                control={control}
                render={({ field, fieldState }) => (
                  <MyTimePicker
                    {...field}
                    label="Start work time"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="endTime"
                control={control}
                render={({ field, fieldState }) => (
                  <MyTimePicker
                    {...field}
                    label={t("End work time")}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="extraTime"
                control={control}
                render={({ field, fieldState }) => (
                  <MyTimePicker
                    {...field}
                    label={t("Extra time")}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </div>
            <div>
              <h4 className="text-xl font-medium dark:text-text-title-dark">
                {t('Working week types')}
              </h4>
              <div className="mb-4 mt-6 grid grid-cols-3 gap-8">
                {weekDay?.map((evt: any, index: number) => (
                  <MyCheckbox
                    onChange={() => handleChangeWorking(evt.label)}
                    key={index}
                    label={evt.label}
                    value={evt.label}
                    checked={workingWeekDays.includes(evt.label)}
                    id={`${evt.id + 20}`}
                    defaultChecked
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12 flex w-full items-start justify-between">
          <LabelledCaption
            className="flex-1"
            title={t('Organization')}
            subtitle={t('')}
          />
          <div className='w-[462px]'>
            <Controller
              name="organizationId"
              control={control}
              render={({ field, fieldState }) => (
                <MySelect
                  options={data?.data?.map((evt: Organization) => ({
                    label: evt.fullName,
                    value: evt.id,
                  }))}
                  placeholder='Select organization'
                  value={field.value as any}  // 👈 cast to any
                  onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                  required
                />
              )}
            />
          </div>
        </div>
        <MyDivider />
        <div className="flex justify-end mt-4">
          <MyButton type="submit" variant="primary">
            {t('Create')}
          </MyButton>
        </div>
      </form>
    </>
  );
};

export default GeneralDetails;
