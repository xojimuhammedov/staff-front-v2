import { MyInput, MySelect } from 'components/Atoms/Form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { Calendar } from 'lucide-react';
import { ISelect } from 'interfaces/select.interface';
import MyDateTimeRangePicker from 'components/Atoms/Form/MyDateTimeRangePicker';
import { useVisitorForm } from 'pages/VisitorPage/hooks/useVisitorForm';
import VisitorDetailsModal from 'pages/VisitorPage/_components/VisitorDetailsModal';

function Form() {
  const { t } = useTranslation();

  const {
    handleSubmit,
    register,
    control,
    errors,
    onSubmit,
    organizationData,
    employeeData,
    codeTypeOptions,
    onetimeCodeControl,
    createdVisitor,
    gateData,
    showVisitorDetailsModal,
    setShowVisitorDetailsModal,
  } = useVisitorForm();

  return (
    <>
      <form className='w-3/4' onSubmit={handleSubmit(onSubmit)}>
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
            label={t('Visitor middle name')}
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
            placeholder="Select birthday"
            label={t('Birthday')}
            useRange={false}
            startIcon={<Calendar stroke="#9096A1" />}
          />
          <MyInput
            {...register('pinfl')}
            error={Boolean(errors?.pinfl?.message)}
            helperText={t(`${errors?.pinfl?.message}`)}
            type="tel"
            label={t('Pinfl')}
          />
          <MyInput
            {...register('passportNumber')}
            error={Boolean(errors?.passportNumber?.message)}
            helperText={t(`${errors?.passportNumber?.message}`)}
            type="tel"
            label={t('Passport Number')}
          />
          <Controller
            name="organizationId"
            control={control}
            render={({ field, fieldState }) => (
              <MySelect
                label={t('Select organization')}
                options={organizationData?.data?.map((evt: any) => ({
                  label: evt.fullName,
                  value: evt.id,
                }))}
                value={field.value as any}
                onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                onBlur={field.onBlur}
                error={!!fieldState.error}
                allowedRoles={['ADMIN']}
              />
            )}
          />
          <Controller
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
                allowedRoles={['ADMIN']}
              />
            )}
          />
          <Controller
            name="attachedId"
            control={control}
            render={({ field, fieldState }) => (
              <MySelect
                label={t('Select employee for attach')}
                options={employeeData?.data?.map((evt: any) => ({
                  label: evt.name,
                  value: evt.id,
                }))}
                value={field.value as any}
                onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                onBlur={field.onBlur}
                error={!!fieldState.error}
                allowedRoles={['ADMIN', 'HR', 'GUARD', 'DEPARTMENT_LEAD']}
              />
            )}
          />
          <Controller
            name="codeType"
            control={onetimeCodeControl}
            render={({ field, fieldState }) => (
              <MySelect
                label={t('Select code type')}
                options={codeTypeOptions}
                value={field.value as any}
                onChange={(val) => {
                  if (val && typeof val === 'object' && !Array.isArray(val) && 'value' in val) {
                    field.onChange((val as ISelect).value);
                  } else {
                    field.onChange(val);
                  }
                }}
                onBlur={field.onBlur}
                error={!!fieldState.error}
                allowedRoles={['ADMIN', 'HR', 'GUARD', 'DEPARTMENT_LEAD']}
              />
            )}
          />
          <Controller
            name="startDate"
            control={onetimeCodeControl}
            render={({ field, fieldState }) => (
              <MyDateTimeRangePicker
                label={t('Start time')}
                value={field.value}
                onChange={field.onChange}
                placeholder={t('Select date and time')}
                error={!!fieldState.error}
              />
            )}
          />
          <Controller
            name="endDate"
            control={onetimeCodeControl}
            render={({ field, fieldState }) => (
              <MyDateTimeRangePicker
                label={t('End time')}
                value={field.value}
                onChange={field.onChange}
                placeholder={t('Select date and time')}
                error={!!fieldState.error}
              />
            )}
          />
        </div>
        <MyDivider />
        <MyButton type="submit" className="mt-3" variant="primary">
          {t('Add & Save')}
        </MyButton>
      </form>
      <VisitorDetailsModal
        show={showVisitorDetailsModal}
        onClose={() => {
          setShowVisitorDetailsModal(false);
        }}
        visitor={createdVisitor}
        organizationData={organizationData}
        employeeData={employeeData}
      />
    </>
  );
}

export default Form;