import { MyInput, MySelect } from 'components/Atoms/Form';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KEYS } from 'constants/key';
import { useGetAllQuery, usePutQuery } from 'hooks/api';
import { toast } from 'react-toastify';
import { URLS } from 'constants/url';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { get } from 'lodash';

const EditForm = ({ onClose, refetch, data, organizationId }: any) => {
  const { t } = useTranslation()
  const [selectGates, setSelectGates] = useState<number[]>([]);

  const { data: getDoor }: any = useGetAllQuery({
    key: KEYS.getDoorGates,
    url: URLS.getDoorGates,
    params: {}
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: useMemo(() => {
      return {
        fullName: get(data, 'data.fullName'),
        shortName: get(data, 'data.shortName'),
        email: get(data, 'data.email'),
        address: get(data, 'data.address'),
        additionalDetails: get(data, 'data.additionalDetails'),
        phone: get(data, 'data.phone')
      };
    }, [data]),
    mode: 'onChange'
  });

  useEffect(() => {
    reset({
      fullName: get(data, 'data.fullName'),
      shortName: get(data, 'data.shortName'),
      email: get(data, 'data.email'),
      address: get(data, 'data.address'),
      additionalDetails: get(data, 'data.additionalDetails'),
      phone: get(data, 'data.phone')
    });
  }, [data]);

  const { mutate: update } = usePutQuery({
    listKeyId: KEYS.getAllListOrganization,
    hideSuccessToast: true
  });

  useEffect(() => {
    if (data?.data?.gates) {

      const savedGateIds =
        data?.data?.gates
          ? data?.data?.gates.map((g: any) => g.id)
          : data?.data?.gates || [];

      setSelectGates(savedGateIds); // Bu yer muhim!
    }
  }, [data?.data?.gates]);

  const options = useMemo(() =>
    getDoor?.data?.map((item: any) => ({
      label: item.name,
      value: item.id,
    })) || [],
    [getDoor?.data]);

  // Tanlangan optionlarni React Select ga berish uchun
  const selectedValues = useMemo(() =>
    options.filter((option: any) => selectGates.includes(option.value)),
    [options, selectGates]
  );

  const onSubmit = (data: any) => {
    update(
      {
        url: `${URLS.getAllListOrganization}/${organizationId}`,
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
            label={t('Organization full name')}
          />
          <MyInput
            {...register("shortName")}
            error={Boolean(errors?.shortName?.message)}
            helperText={t(`${errors?.shortName?.message}`)}
            label={t('Organization short name')}
          />
          <MyInput
            {...register("email")}
            error={Boolean(errors?.email?.message)}
            helperText={t(`${errors?.email?.message}`)}
            label={t('Organization email')}
            type='email'
          />
          <MyInput
            {...register("address")}
            error={Boolean(errors?.address?.message)}
            helperText={t(`${errors?.address?.message}`)}
            label={t('Organization address')}
          />
          <MyInput
            {...register("additionalDetails")}
            error={Boolean(errors?.additionalDetails?.message)}
            helperText={t(`${errors?.additionalDetails?.message}`)}
            label={t('Organization details')}
          />
          <MyInput
            {...register('phone')}
            error={Boolean(errors?.phone?.message)}
            helperText={t(`${errors?.phone?.message}`)}
            type="tel"
            placeholder="+998 (_ _)  _ _ _  _ _  _ _"
            label={t('Phone number')}
          />
        </div>
        <MySelect
          isMulti
          options={options}
          value={selectedValues}        // Bu yerda to'g'ri tanlanganlar ko'rinadi
          onChange={(selected: any) => {
            const ids = selected ? selected.map((s: any) => s.value) : [];
            setSelectGates(ids);
          }}
          label={t("Gates")}
          allowedRoles={["ADMIN"]}
        />
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

export default EditForm;
