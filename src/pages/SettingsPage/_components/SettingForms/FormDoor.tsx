import { yupResolver } from '@hookform/resolvers/yup';
import { MyInput, MyTextarea } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { usePostQuery } from 'hooks/api';
import { get } from 'lodash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import storage from 'services/storage';
import { object, string } from 'yup';

function FormDoor({ handleClick }: any) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userDataString: string | null = storage.get('userData');
  const companyId: any = userDataString ? JSON.parse(userDataString) : {};

  const schema = object().shape({
    name: string().required(),
    description: string()
  });

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    defaultValues: {},
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const { mutate: create, isLoading: isLoadingPost } = usePostQuery({
    listKeyId: KEYS.getDoor,
    hideSuccessToast: true
  });

  const onSubmit = (data: any) => {
    const submitData = {
      ...data,
      company: get(companyId, 'company.id')
    };
    create(
      {
        url: URLS.getDoor,
        attributes: {
          data: submitData
        }
      },
      {
        onSuccess: (data) => {
          navigate(`/settings/door/create?current-step=2&deviceId=${data?.data?.data?.id}`);
          toast.success(t('Door created successfully!'));
        },
        onError: (e) => {
          console.log(e);
        }
      }
    );
  };

  return (
    <div
      className={
        'mt-12 min-h-[400px] w-full rounded-m bg-bg-base p-4 shadow-base dark:bg-bg-dark-theme'
      }>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <LabelledCaption
            title={t('Door details')}
            subtitle={t('Enter a door name and description')}
          />
        </div>
        <div className="flex items-center gap-4">
          <MyButton onClick={handleClick} variant="primary">
            {t('Go to next step')}
          </MyButton>
        </div>
      </div>
      <MyDivider />
      <form onSubmit={handleSubmit(onSubmit)} action="">
        <div className="my-10 flex">
          <div className="w-[50%]">
            <LabelledCaption
              title={t('Door name')}
              subtitle={t('Short and easy-to-understand name')}
            />
          </div>
          <div className="w-[50%]">
            <MyInput
              {...register('name')}
              error={Boolean(errors?.name?.message)}
              helperText={errors?.name?.message}
              placeholder={t('Enter door name')}
            />
          </div>
        </div>
        <div className="my-10 flex">
          <div className="w-[50%]">
            <LabelledCaption
              title={t('Door description')}
              subtitle={t('Short and easy-to-understand name')}
            />
          </div>
          <div className="w-[50%]">
            <MyTextarea
              {...register('description')}
              error={Boolean(errors?.description?.message)}
              helperText={errors?.description?.message}
              className="min-h-[180px]"
              placeholder={t('Enter door description')}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <MyButton type="submit" variant="primary">
            {t('Create Door')}
          </MyButton>
        </div>
      </form>
    </div>
  );
}

export default FormDoor;
