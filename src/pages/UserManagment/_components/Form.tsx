import { yupResolver } from '@hookform/resolvers/yup';
import { MyInput, MySelect } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyModal from 'components/Atoms/MyModal';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { ISelect } from 'interfaces/select.interface';
import { Organization } from 'pages/OrganizationPage/interface/organization.interface';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { object, string } from 'yup';

const Form = ({ refetch, open, setOpen }: any) => {
  const { t } = useTranslation()

  const { mutate: create } = usePostQuery({
    listKeyId: KEYS.getListUsersManagment,
    hideSuccessToast: true
  });

  const { data } = useGetAllQuery<any>({
    key: KEYS.getListOrganizationSelf,
    url: URLS.getListOrganizationSelf,
    params: {}
  })

  const { data: userRoles } = useGetAllQuery<any>({
    key: KEYS.getUserRoles,
    url: URLS.getUserRoles
  })

  const schema = object().shape({
    name: string().required(),
    username: string().required(),
    password: string().required(),
    role: string().required(),
    organizationId: string(),
  });

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {},
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: any) => {
    create(
      {
        url: URLS.getListUsersManagment,
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

export default Form;
