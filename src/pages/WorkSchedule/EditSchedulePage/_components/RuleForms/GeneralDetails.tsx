import { MyCheckbox, MyInput, MySelect, MyTextarea } from 'components/Atoms/Form';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, useGetOneQuery, usePutQuery } from 'hooks/api';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Organization } from 'pages/OrganizationPage/interface/organization.interface';
import { ISelect } from 'interfaces/select.interface';
import MyTimePicker from 'components/Atoms/Form/MyTimePicker';
import weekDay from 'configs/weekday';
import storage from 'services/storage';

const GeneralDetails = () => {
  const { t } = useTranslation();
  const { id }: any = useParams();
  const userData: any = storage.get("userData")
  const userRole = JSON.parse(userData)?.role
  const navigate = useNavigate()
  const { data } = useGetAllQuery<any>({
    key: KEYS.getAllListOrganization,
    url: URLS.getAllListOrganization,
    params: {},
    hideErrorMsg: true,
  })

  const { data: getOneSchedule, refetch } = useGetOneQuery({
    id: id,
    url: URLS.employeeSchedulePlan,
    params: {},
    enabled: !!id
  })
  const [workingWeekDays, setWorkingWeekDays] = useState<string[]>([]);

  const handleChangeWorking = (value: string) => {
    setWorkingWeekDays((prevDays) =>
      prevDays.includes(value) ? prevDays.filter((day) => day !== value) : [...prevDays, value]
    );
  };

  useEffect(() => {
    if (getOneSchedule?.data?.weekdays) {
      setWorkingWeekDays(getOneSchedule?.data?.weekdays);
    }
  }, [getOneSchedule?.data]);

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors }
  } = useForm<any>({
    defaultValues: useMemo(() => {
      return {
        name: get(getOneSchedule, 'data.name'),
        organizationId: get(getOneSchedule, 'data.organizationId'),
        addadditionalDetails: get(getOneSchedule, 'data.addadditionalDetails'),
        startTime: get(getOneSchedule, 'data.startTime'),
        endTime: get(getOneSchedule, 'data.endTime'),
        extraTime: get(getOneSchedule, 'data.extraTime'),
      };
    }, [getOneSchedule]),
    mode: 'onChange',
  });

  useEffect(() => {
    reset({
      name: get(getOneSchedule, 'data.name'),
      organizationId: get(getOneSchedule, 'data.organizationId'),
      addadditionalDetails: get(getOneSchedule, 'data.addadditionalDetails'),
      startTime: get(getOneSchedule, 'data.startTime'),
      endTime: get(getOneSchedule, 'data.endTime'),
      extraTime: get(getOneSchedule, 'data.extraTime'),
    });
  }, [getOneSchedule]);

  const { mutate: update } = usePutQuery({
    listKeyId: KEYS.employeeSchedulePlan,
    hideSuccessToast: true
  });

  const onSubmit = (data: any) => {
    update(
      {
        url: `${URLS.employeeSchedulePlan}/${id}`,
        attributes: {
          weekdays: workingWeekDays,
          ...data
        }
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully edited!'));
          navigate(`/workschedule/edit/${id}?current-step=1&current-rule=employee-groups`);
          reset();
          refetch()
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message)
        }
      }
    );
  };


  return (
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
                  checked={workingWeekDays?.includes(evt.label)}
                  id={`${evt.id + 20}`}
                  defaultChecked
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {
        userRole === "ADMIN" && (
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
                    allowedRoles={["ADMIN"]}
                    required
                  />
                )}
              />
            </div>
          </div>
        )
      }


      <div className="flex justify-end mt-4">
        <MyButton type="submit" variant="primary">
          {t('Save changes')}
        </MyButton>
      </div>

    </form>
  );
};

export default GeneralDetails;
