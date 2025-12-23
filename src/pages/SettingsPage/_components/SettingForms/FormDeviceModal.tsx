import { yupResolver } from '@hookform/resolvers/yup';
import { MyCheckbox, MyInput, MySelect } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { usePostQuery } from 'hooks/api';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { object, string } from 'yup';
import { paramsStrToObj } from 'utils/helper';
import deviceType from 'configs/deviceType';
import { useState } from 'react';

const checkType = [
  {
    id: 1,
    label: "Both",
    value: "BOTH"
  },
  {
    id: 2,
    label: "Check in",
    value: "ENTER"
  },
  {
    id: 3,
    label: "Check out",
    value: "EXIT"
  }
]

function FormDeviceModal({ setOpenModal }: any) {
  const { t } = useTranslation();
  const searchParams = useLocation();
  const doorId: any = paramsStrToObj(searchParams.search);
  const [selectGates, setSelectGates] = useState<number[]>([]);

  const { mutate: create } = usePostQuery({
    listKeyId: KEYS.getDoorForDevices,
    hideSuccessToast: true
  });

  const schema = object().shape({
    ipAddress: string().required(),
    password: string().required(),
    name: string().required(),
    login: string().required(),
    entryType: string().required(),
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {},
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const options =
    deviceType?.map((item: any) => ({
      label: item.label,
      value: item.value,
    })) || [];

  // value qiymatini options asosida topish
  const value = options.filter((option: any) =>
    selectGates.includes(option.value)
  );

  // onchange hodisasi
  const handleChange = (selected: any) => {
    const ids = selected.map((s: any) => s.value);
    setSelectGates(ids);
  };

  const onSubmit = (data: any) => {
    const submitData = {
      gateId: Number(doorId?.doorId),
      deviceTypes: selectGates,
      ...data
    }
    create(
      {
        url: URLS.getDoorForDevices,
        attributes: submitData
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully created!'));
          setOpenModal(false);
          reset();
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message)
        }
      }
    );
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" action="">
      <MyInput
        {...register('name')}
        error={Boolean(errors?.name?.message)}
        helperText={t(`${errors?.name?.message}`)}
        placeholder={t('Enter device name')}
        label={t('Name')}
      />
      <MySelect
        isMulti
        options={options}
        className=''
        label={t("Select type")}
        value={value}
        onChange={handleChange}
        allowedRoles={["ADMIN", "HR"]}
      />
      <MyInput
        {...register('ipAddress')}
        error={Boolean(errors?.ipAddress?.message)}
        helperText={t(`${errors?.ipAddress?.message}`)}
        placeholder={t('Enter ip address')}
        label={t('Ip address')}
      />
      <MyInput
        {...register('password')}
        error={Boolean(errors?.password?.message)}
        helperText={t(`${errors?.password?.message}`)}
        placeholder={t('Enter password')}
        label={t('Password')}
      />
      <MyInput
        {...register('login')}
        error={Boolean(errors?.login?.message)}
        helperText={t(`${errors?.login?.message}`)}
        placeholder={t('Enter device login')}
        label={t('Login')}
      />
      <Controller
        name="entryType"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <div className='flex items-center justify-between'>
            {checkType?.map((evt: any, index: number) => {
              const isChecked = field.value === evt.value;
              return (
                <MyCheckbox
                  key={index}
                  label={evt.label}
                  id={`${evt.id + 20}`}
                  checked={isChecked}
                  onChange={() => field.onChange(evt.value)}
                />
              );
            })}
          </div>
        )}
      />
      <div className="flex items-center justify-end gap-4">
        <MyButton variant="primary">{t('Create a device')}</MyButton>
        <MyButton
          onClick={() => {
            setOpenModal(false), reset();
          }}
          className={'w-[98px]'}
          variant="secondary">
          {t('Close')}
        </MyButton>
      </div>
    </form>
  );
}

export default FormDeviceModal;
