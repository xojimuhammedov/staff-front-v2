import { MyInput, MySelect } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyModal from 'components/Atoms/MyModal';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, useGetOneQuery, usePutQuery } from 'hooks/api';
import { ISelect } from 'interfaces/select.interface';
import { Organization } from 'pages/OrganizationPage/interface/organization.interface';
import React, { useEffect, useMemo } from 'react';
import { get, Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const EditForm = ({ refetch, open, setOpen, userId }: any) => {
  const { t } = useTranslation()

  const { data } = useGetAllQuery<any>({
    key: KEYS.getAllListOrganization,
    url: URLS.getAllListOrganization,
    params: {}
  })

  const { data: userRoles } = useGetAllQuery<any>({
    key: KEYS.getUserRoles,
    url: URLS.getUserRoles
  })

  const { data: getOne } = useGetOneQuery({
    id: userId,
    url: URLS.getListUsersManagment,
    params: {},
    enabled: !!userId
  });

  const { data: departmentData } = useGetAllQuery<any>({
    key: KEYS.getAllListDepartment,
    url: URLS.getAllListDepartment,
    params: {}
  })

  const { mutate: update } = usePutQuery({
    listKeyId: KEYS.getListUsersManagment,
    hideSuccessToast: true
  });

  const departmentOptions = useMemo(
    () =>
      departmentData?.data?.map((item: any) => ({
        label: item.fullName,
        value: item.id,
      })) || [],
    [departmentData?.data]
  );

  const defaultDepartmentIds = useMemo(() => {
    return (
      getOne?.data?.departments?.map((org: any) => org.id) || []
    );
  }, [getOne?.data?.departments]);


  const {
    handleSubmit,
    register,
    reset,
    control,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: useMemo(() => {
      return {
        name: get(getOne, 'data.name'),
        username: get(getOne, 'data.username'),
        role: get(getOne, 'data.role'),
        organizationId: get(getOne, 'data.organizationId'),
        departmentIds: defaultDepartmentIds,
        password: get(getOne, 'data.password'),
      };
    }, [getOne?.data]),
    mode: 'onChange',
  });

  useEffect(() => {
    reset({
      name: get(getOne, 'data.name'),
      username: get(getOne, 'data.username'),
      role: get(getOne, 'data.role'),
      organizationId: get(getOne, 'data.organizationId'),
      departmentIds: defaultDepartmentIds,
      password: get(getOne, 'data.password'),
    });
  }, [getOne?.data, defaultDepartmentIds]);


  const onSubmit = (data: any) => {
    update(
      {
        url: `${URLS.getListUsersManagment}/${userId}`,
        attributes: data
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully edited!'));
          reset();
          refetch()
          setOpen(false)
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message)
        }
      }
    );
  };

  return (
    <MyModal
      modalProps={{
        show: Boolean(open),
        onClose: () => {
          setOpen(false)
        }
      }}
      headerProps={{
        children: <h2 className="text-xl font-semibold">{t('Add a user')}</h2>,
        className: 'px-6'
      }}
      bodyProps={{
        children: (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-3" action="">
            <div className='grid grid-cols-2 gap-4 w-full'>
              <MyInput
                {...register('name')}
                error={Boolean(errors?.name?.message)}
                helperText={t(`${errors?.name?.message}`)}
                label={t('Full Name')}
              />
              <MyInput
                {...register('username')}
                error={Boolean(errors?.username?.message)}
                helperText={t(`${errors?.username?.message}`)}
                label={t('Username')}
              />
              <MyInput
                {...register('password')}
                label={t('Password')}
              />
              <Controller
                name="role"
                control={control}
                render={({ field, fieldState }) => (
                  <MySelect
                    label={t("Select role")}
                    options={userRoles?.map((evt: any) => ({
                      label: evt,
                      value: evt,
                    }))}
                    value={field.value as any}  // 👈 cast to any
                    onChange={(val) => field.onChange((val as ISelect)?.value ?? val)}
                    onBlur={field.onBlur}
                    error={!!fieldState.error}
                    allowedRoles={["ADMIN"]}
                  />
                )}
              />
              <Controller
                name="organizationId"
                control={control}
                render={({ field, fieldState }) => (
                  <MySelect
                    label={t("Select organization")}
                    options={data?.data?.map((evt: Organization) => ({
                      label: evt.fullName,
                      value: evt.id,
                    }))}
                    value={field.value as any}  // 👈 cast to any
                    onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                    onBlur={field.onBlur}
                    error={!!fieldState.error}
                    allowedRoles={["ADMIN"]}
                  />
                )}
              />
              {
                watch("role") === "DEPARTMENT_LEAD" && (
                  <Controller
                    name="departmentIds"
                    control={control}
                    rules={{ required: t("At least one department must be selected") }}
                    render={({ field }) => (
                      <MySelect
                        isMulti={true}
                        options={departmentOptions}
                        value={departmentOptions.filter((opt: any) =>
                          field.value?.includes(opt.value)
                        )}
                        onChange={(selectedOptions: any) => {
                          const values = selectedOptions
                            ? selectedOptions?.map((opt: any) => opt.value)
                            : [];
                          field.onChange(values);
                        }}
                        allowedRoles={["ADMIN"]}
                        label={t("Select departments")}
                      />
                    )}
                  />
                )
              }
            </div>

            <div className="mb-[5px] flex w-full justify-end gap-4">
              <MyButton type="submit" variant="primary">
                {' '}
                {t('Add & Save permit')}
              </MyButton>
              <MyButton
                className="w-[98px]"
                onClick={() => {
                  setOpen(false);
                }}
                variant="secondary">
                {' '}
                {t('Close')}
              </MyButton>
            </div>
          </form>
        ),
        className: 'px-[20px]'
      }}
    />
  );
}

export default EditForm;
