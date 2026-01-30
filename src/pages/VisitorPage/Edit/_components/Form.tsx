import { MyInput, MySelect } from 'components/Atoms/Form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { Calendar } from 'lucide-react';
import { ISelect } from 'interfaces/select.interface';
import { useVisitorEditForm } from '../../hooks/useVisitorEditForm';
import { useParams, useNavigate } from 'react-router-dom';

function Form() {
  const { t } = useTranslation();
  const { id } = useParams();

  const {
    handleSubmit,
    register,
    control,
    errors,
    onSubmit,
    // gateData,
    isLoading,
  } = useVisitorEditForm(id ?? '');

  if (!id) {
    return <div className="text-text-muted">{t('Invalid visitor ID')}</div>;
  }

  if (isLoading) {
    return <div>{t('Loading...')}</div>;
  }

  return (
    <form className="w-3/4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-3 gap-4">
        <MyInput
          {...register('firstName')}
          error={Boolean(errors?.firstName?.message)}
          helperText={t(`${errors?.firstName?.message}`)}
          label={t('Visitor full name')}
        />

        <MyInput
          {...register('lastName')}
          error={Boolean(errors?.lastName?.message)}
          helperText={t(`${errors?.lastName?.message}`)}
          label={t('Visitor last name')}
        />

        <MyInput
          {...register('middleName')}
          error={Boolean(errors?.middleName?.message)}
          helperText={t(`${errors?.middleName?.message}`)}
          label={t('Visitor email')}
        />

        <MyInput
          {...register('workPlace')}
          error={Boolean(errors?.workPlace?.message)}
          helperText={t(`${errors?.workPlace?.message}`)}
          label={t('Visitor address')}
        />

        <MyInput
          {...register('additionalDetails')}
          error={Boolean(errors?.additionalDetails?.message)}
          helperText={t(`${errors?.additionalDetails?.message}`)}
          label={t('Visitor details')}
        />

        <MyInput
          {...register('phone')}
          error={Boolean(errors?.phone?.message)}
          helperText={t(`${errors?.phone?.message}`)}
          type="tel"
          placeholder="+998 (_ _)  _ _ _  _ _  _ _"
          label={t('Phone number')}
        />

        <MyTailwindPicker
          name="birthday"
          control={control}
          asSingle={true}
          placeholder={t('Select birthday')}
          label={t('Birthday')}
          useRange={false}
          startIcon={<Calendar stroke="#9096A1" />}
        />

        <MyInput
          {...register('passportNumberOrPinfl')}
          error={Boolean(errors?.passportNumberOrPinfl?.message)}
          helperText={t(`${errors?.passportNumberOrPinfl?.message}`)}
          type="tel"
          label={t('Pinfl or Passport Number')}
        />

        {/* <Controller
          name="gateId"
          control={control}
          render={({ field, fieldState }) => (
            <MySelect
              label={t('Select gate')}
              options={gateData?.data?.map((evt: any) => ({
                label: evt.name,
                value: evt.id,
              }))}
              value={field.value as any}
              onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
              onBlur={field.onBlur}
              error={!!fieldState.error}
              allowedRoles={['ADMIN', 'HR', 'DEPARTMENT_LEAD', 'GUARD']}
            />
          )}
        /> */}
      </div>

      <MyDivider />

      <div className="flex gap-4">
        <MyButton
          type='submit'
          className={'mt-3'}
          variant="primary">{t("Add & Save")}</MyButton>
      </div>
    </form>
  );
}

export default Form;
