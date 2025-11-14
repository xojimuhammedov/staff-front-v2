import { yupResolver } from '@hookform/resolvers/yup';
import { MyInput } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { usePostQuery } from 'hooks/api';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { object, string } from 'yup';
import { paramsStrToObj } from 'utils/helper';

function FormDeviceModal({ setOpenModal }: any) {
  const { t } = useTranslation();
  const searchParams = useLocation();
  const doorId: any = paramsStrToObj(searchParams.search);

  const { mutate: create } = usePostQuery({
    listKeyId: KEYS.getDoorForDevices,
    hideSuccessToast: true
  });

  const schema = object().shape({
    ipAddress: string().required(),
    password: string().required(),
    name: string().required(),
    login: string().required()
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {},
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: any) => {
    const submitData = {
      gateId: doorId?.doorId,
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
          // if (e.response.data.error.message === 'This attribute must be unique') {
          //   // toast.error('Bu ip address oldin ro`yhatdan o`tkazilgan');
          //   toast.error(t('This IP address has been registered before'));
          // } else {
          //   toast.error(t("The IP address was entered incorrectly!"));
          // }
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
