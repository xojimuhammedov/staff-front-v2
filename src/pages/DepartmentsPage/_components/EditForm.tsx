import { MyInput, MySelect } from 'components/Atoms/Form';
import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KEYS } from 'constants/key';
import { useGetAllQuery, usePutQuery } from 'hooks/api';
import { toast } from 'react-toastify';
import { URLS } from 'constants/url';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { get } from 'lodash';
import { ISelect } from 'interfaces/select.interface';
import { Department } from '../interface/department.interface';

const EditForm = ({ onClose, refetch, data, departmentId }: any) => {
  const { t } = useTranslation()

  const { data: getOrganization } = useGetAllQuery<any>({
    key: KEYS.getAllListOrganization,
    url: KEYS.getAllListOrganization,
    hideErrorMsg: true,
    params: {},
  })

  const { data: getDepartment } = useGetAllQuery<{ data: Department[] }>({
    key: KEYS.getAllListDepartment,
    url: URLS.getAllListDepartment,
    params: {}
  })

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: useMemo(() => {
      return {
        fullName: get(data, 'data.fullName'),
        shortName: get(data, 'data.shortName'),
        email: get(data, 'data.email'),
        address: get(data, 'data.address'),
        additionalDetails: get(data, 'data.additionalDetails'),
        phone: get(data, 'data.phone'),
        organizationId: get(data, 'data.organizationId'),
        parentId: get(data, 'data.parentId')
      };
    }, [data]),
    mode: 'onChange',
  });

  useEffect(() => {
    reset({
      fullName: get(data, 'data.fullName'),
      shortName: get(data, 'data.shortName'),
      email: get(data, 'data.email'),
      address: get(data, 'data.address'),
      additionalDetails: get(data, 'data.additionalDetails'),
      phone: get(data, 'data.phone'),
      organizationId: get(data, 'data.organizationId'),
      parentId: get(data, 'data.parentId')
    });
  }, [data]);

  const { mutate: update } = usePutQuery({
    listKeyId: KEYS.getAllListOrganization,
    hideSuccessToast: true
  });

  const onSubmit = (data: any) => {
    update(
      {
        url: `${URLS.getAllListDepartment}/${departmentId}`,
        attributes: data
      },
      {
        onSuccess: () => {
          toast.success(t('Edit successfully!'));
          reset();
          refetch()
          onClose()
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message)
        }
      }
    );
  };

  return (
    <div className='p-4'>
      <form onSubmit={handleSubmit(onSubmit)} action="">
        <div className='grid grid-cols-2 gap-4'>
          <MyInput
            {...register("fullName")}
            error={Boolean(errors?.fullName?.message)}
            helperText={t(`${errors?.fullName?.message}`)}
            label={t('Department full name')}
          />
          <MyInput
            {...register("shortName")}
            error={Boolean(errors?.shortName?.message)}
            helperText={t(`${errors?.shortName?.message}`)}
            label={t('Department short name')}
          />
          <MyInput
            {...register("email")}
            error={Boolean(errors?.email?.message)}
            helperText={t(`${errors?.email?.message}`)}
            label={t('Department email')}
            type='email'
          />
          <MyInput
            {...register("address")}
            error={Boolean(errors?.address?.message)}
            helperText={t(`${errors?.address?.message}`)}
            label={t('Department address')}
          />
          <MyInput
            {...register("additionalDetails")}
            error={Boolean(errors?.additionalDetails?.message)}
            helperText={t(`${errors?.additionalDetails?.message}`)}
            label={t('Department details')}
          />
          <MyInput
            {...register('phone')}
            error={Boolean(errors?.phone?.message)}
            helperText={t(`${errors?.phone?.message}`)}
            type="tel"
            placeholder="+998 (_ _)  _ _ _  _ _  _ _"
            label={t('Phone number')}
          />
          <Controller
            name="organizationId"
            control={control}
            render={({ field, fieldState }) => (
              <MySelect
                label={t("Select organization")}
                options={getOrganization?.data?.map((evt: any) => ({
                  label: evt.fullName,
                  value: evt.id,
                }))}
                value={field.value as any}  // 👈 cast to any
                onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                onBlur={field.onBlur}
                error={!!fieldState.error}
                allowedRoles={['ADMIN']}
                required
              />
            )}
          />
          <Controller
            name="parentId"
            control={control}
            render={({ field, fieldState }) => (
              <MySelect
                label={t("Select department")}
                options={get(getDepartment, "data")?.map((evt: Department) => ({
                  label: evt.fullName,
                  value: evt.id,
                }))}
                value={field.value as any}  // 👈 cast to any
                onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                onBlur={field.onBlur}
                error={!!fieldState.error}
                allowedRoles={['ADMIN', "HR", "DEPARTMENT_LEAD"]}
              />
            )}
          />
        </div>
        <div className="mt-2 flex w-full justify-end gap-4">
          <MyButton
            type='submit'
            variant="primary">{t("Submit")}</MyButton>
          <MyButton
            onClick={() => {
              onClose();
              reset();
            }}
            variant="secondary">
            {' '}
            {t('Close')}
          </MyButton>
        </div>
      </form>
    </div>
  );
}

export default React.memo(EditForm);
