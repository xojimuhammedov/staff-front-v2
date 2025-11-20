import { yupResolver } from '@hookform/resolvers/yup';
import { MyInput, MySelect } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { ISelect } from 'interfaces/select.interface';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { object, string } from 'yup';
import * as yup from "yup";

function FormDoor() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data } = useGetAllQuery<any>({
    key: KEYS.getAllListOrganization,
    url: URLS.getAllListOrganization,
    params: {},
    hideErrorMsg: true
  })

  const schema = object().shape({
    name: string().required(),
    organizationId: yup.number(),
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {},
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const { mutate: create } = usePostQuery({
    listKeyId: KEYS.getDoorGates,
    hideSuccessToast: true
  });

  const onSubmit = (data: any) => {
    create(
      {
        url: URLS.getDoorGates,
        attributes: data
      },
      {
        onSuccess: (data) => {
          navigate(`/settings/door/create?current-step=2&doorId=${data?.data?.id}`);
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
        {/* <div className="flex items-center gap-4">
          <MyButton variant="primary">
            {t('Go to next step')}
          </MyButton>
        </div> */}
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
              title={t('Door name')}
              subtitle={t('Short and easy-to-understand name')}
            />
          </div>
          <div className="w-[50%]">
            <Controller
              name="organizationId"
              control={control}
              render={({ field, fieldState }) => (
                <MySelect
                  options={data?.data?.map((evt: any) => ({
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
