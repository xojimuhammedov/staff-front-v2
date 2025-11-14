import { yupResolver } from '@hookform/resolvers/yup';
import { MyInput, MySelect } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyModal from 'components/Atoms/MyModal';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, useGetOneQuery, usePostQuery, usePutQuery } from 'hooks/api';
import { ISelect } from 'interfaces/select.interface';
import { Organization } from 'pages/OrganizationPage/interface/organization.interface';
import React, { useEffect, useMemo } from 'react';
import { get, Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { object, string } from 'yup';
import * as yup from "yup";

const EditForm = ({ refetch, open, setOpen, userId }: any) => {
  const { t } = useTranslation()

  const { data } = useGetAllQuery<any>({
    key: KEYS.getListOrganizationSelf,
    url: URLS.getListOrganizationSelf,
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

  const { mutate: update } = usePutQuery({
    listKeyId: KEYS.getListUsersManagment,
    hideSuccessToast: true
  });


  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: useMemo(() => {
      return {
        name: get(getOne, 'data.name'),
        username: get(getOne, 'data.username'),
        password: get(getOne, 'data.password'),
        role: get(getOne, 'data.role'),
        organizationId: get(getOne, 'data.organizationId'),
      };
    }, [getOne]),
    mode: 'onChange',
  });

  useEffect(() => {
    reset({
      name: get(getOne, 'data.name'),
      username: get(getOne, 'data.username'),
      password: get(getOne, 'data.password'),
      role: get(getOne, 'data.role'),
      organizationId: get(getOne, 'data.organizationId'),
    });
  }, [getOne]);

  const onSubmit = (data: any) => {
    update(
      {
        url: `${URLS.getListUsersManagment}/${userId}`,
        attributes: data
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully created!'));
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
                error={Boolean(errors?.password?.message)}
                helperText={t(`${errors?.password?.message}`)}
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
                  />
                )}
              />
              <Controller
                name="organizationId"
                control={control}
                render={({ field, fieldState }) => (
                  <MySelect
                    label={t("Select organization")}
                    options={data?.map((evt: Organization) => ({
                      label: evt.fullName,
                      value: evt.id,
                    }))}
                    value={field.value as any}  // 👈 cast to any
                    onChange={(val) => field.onChange((val as ISelect)?.value ?? val)}
                    onBlur={field.onBlur}
                    error={!!fieldState.error}
                  />
                )}
              />
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
