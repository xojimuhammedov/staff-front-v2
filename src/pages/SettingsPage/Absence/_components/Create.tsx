import { yupResolver } from '@hookform/resolvers/yup';
import { MyInput, MySelect, MyTextarea } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyModal from 'components/Atoms/MyModal';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { ISelect } from 'interfaces/select.interface';
import { Plus } from 'lucide-react';
import { Organization } from 'pages/OrganizationPage/interface/organization.interface';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { object, string } from 'yup';
import * as yup from 'yup';

const Create = ({ refetch }: any) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { mutate: create } = usePostQuery({
    listKeyId: KEYS.absences,
    hideSuccessToast: true,
  });
  const { data } = useGetAllQuery<any>({
    key: KEYS.getAllListOrganization,
    url: URLS.getAllListOrganization,
    hideErrorMsg: true,
    params: {},
  });

  const schema = object().shape({
    shortLetterUz: string().required(),
    shortLetterRu: string().required(),
    shortLetterEng: string().required(),
    descriptionUz: string().required(),
    descriptionRu: string().required(),
    descriptionEng: string().required(),
    organizationId: yup.number().required(),
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    create(
      {
        url: URLS.absences,
        attributes: data,
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully created!'));
          setOpen(false);
          refetch();
        },
        onError: (e) => {
          console.log(e);
          toast.error(t('An error occurred!'));
        },
      }
    );
  };
  return (
    <>
      <MyButton
        onClick={() => {
          setOpen(true);
        }}
        allowedRoles={['ADMIN', 'HR']}
        startIcon={<Plus />}
        variant='primary'
        className={`text-sm min-w-max [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
      >
        {t('Create absence')}
      </MyButton>
      <MyModal
        modalProps={{
          show: Boolean(open),
          onClose: () => setOpen(false),
          size: 'md',
        }}
        headerProps={{
          children: <h2 className="dark:text-text-title-dark">{t('Absence')}</h2>,
        }}
        bodyProps={{
          children: (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" action="">
              <MyInput label={t('Short letter uz')} {...register('shortLetterUz')} />
              <MyInput label={t('Short letter ru')} {...register('shortLetterRu')} />
              <MyInput label={t('Short letter en')} {...register('shortLetterEng')} />
              <MyTextarea
                label={t('Description uz')}
                {...register('descriptionUz')}
                className="dark:bg-bg-input-dark dark:text-text-title-dark"
              />
              <MyTextarea
                label={t('Description ru')}
                {...register('descriptionRu')}
                className="dark:bg-bg-input-dark dark:text-text-title-dark"
              />
              <MyTextarea
                label={t('Description en')}
                {...register('descriptionEng')}
                className="dark:bg-bg-input-dark dark:text-text-title-dark"
              />
              <Controller
                name="organizationId"
                control={control}
                render={({ field, fieldState }) => (
                  <MySelect
                    label={t('Select organization')}
                    options={data?.data?.map((evt: Organization) => ({
                      label: evt.fullName,
                      value: evt.id,
                    }))}
                    value={field.value as any} 
                    onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                    onBlur={field.onBlur}
                    error={!!fieldState.error}
                    allowedRoles={['ADMIN']}
                    required
                  />
                )}
              />
              <div className="mt-2 flex items-center justify-end gap-4">
                <MyButton variant="primary" type="submit">
                  {t('Save changes')}
                </MyButton>
                <MyButton onClick={() => setOpen(false)} variant="secondary">
                  {t('Close')}
                </MyButton>
              </div>
            </form>
          ),
          className: 'py-[10px]',
        }}
      />
    </>
  );
};

export default Create;
