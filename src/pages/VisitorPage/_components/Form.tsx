import { MyInput, MySelect } from 'components/Atoms/Form';
import { Controller } from 'react-hook-form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyModal from 'components/Atoms/MyModal';
import { ISelect } from 'interfaces/select.interface';
import MyDateTimeRangePicker from 'components/Atoms/Form/MyDateTimeRangePicker';
import { useVisitorForm } from '../hooks/useVisitorForm';
import VisitorDetailsModal from './VisitorDetailsModal';

const Form = ({ refetch, setShow, show }: any) => {
  const {
    t,
    handleSubmit,
    register,
    reset,
    control,
    errors,
    onSubmit,
    organizationData,
    employeeData,
    codeTypeOptions,
    createdVisitor,
    showVisitorDetailsModal,
    setShowVisitorDetailsModal,
  } = useVisitorForm(refetch, setShow);

  return (
    <>
    <MyModal
        modalProps={{
          show: Boolean(show),
          onClose: () => {
            setShow(false);
            reset();
          },
        }}
        headerProps={{
          children: <h2 className="text-xl font-semibold">{t('Create visitor')}</h2>,
          className: 'px-6',
        }}
        bodyProps={{
          children: (
            <div className="p-4">
              <form onSubmit={handleSubmit(onSubmit)} action="">
                <div className="grid grid-cols-2 gap-4">
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
                    label={t('Visitor short name')}
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
                        value={field.value as any} // 👈 cast to any
                        onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                        onBlur={field.onBlur}
                        error={!!fieldState.error}
                        allowedRoles={['ADMIN']}
                      />
                    )}
                  />

                  <Controller
                    name="attachId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <MySelect
                        label={t('Select employee')}
                        options={employeeData?.data?.map((evt: any) => ({
                          label: evt.name,
                          value: evt.id,
                        }))}
                        value={field.value as any} // 👈 cast to any
                        onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                        onBlur={field.onBlur}
                        error={!!fieldState.error}
                        allowedRoles={['ADMIN', 'HR', 'GUARD', 'DEPARTMENT_LEAD']}
                      />
                    )}
                  />
                  <Controller
                    name="onetimeCodeId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <MySelect
                        label={t('Select code type')}
                        options={codeTypeOptions}
                        value={field.value as any}
                        onChange={(val) => {
                          if (
                            val &&
                            typeof val === 'object' &&
                            !Array.isArray(val) &&
                            'value' in val
                          ) {
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
                  <MyDateTimeRangePicker
                    label="Sana"
                    placeholder="DD/MM/YYYY HH:mm"
                    className="custom-datepicker"
                    size="small"
                    error={!!errors.date}
                  />
                </div>
                <div className="mt-2 flex w-full justify-end gap-4">
                  <MyButton type="submit" variant="primary">
                    {t('Submit')}
                  </MyButton>
                  <MyButton
                    onClick={() => {
                      setShow(false);
                      reset();
                    }}
                    variant="secondary"
                  >
                    {' '}
                    {t('Close')}
                  </MyButton>
                </div>
              </form>
            </div>
          ),
        }}
      />
      <VisitorDetailsModal
        show={showVisitorDetailsModal}
        onClose={() => {
          setShowVisitorDetailsModal(false);
          setShow(false);
        }}
        visitor={createdVisitor}
        organizationData={organizationData}
        employeeData={employeeData}
      />
    </>
  );
};

export default Form;
