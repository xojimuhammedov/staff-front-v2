import React from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import MyModal from 'components/Atoms/MyModal';
import { MySelect } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { ISelect } from 'interfaces/select.interface';
import MyDateTimeRangePicker from 'components/Atoms/Form/MyDateTimeRangePicker';

interface AddNewTypeModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  employeeData: any;
  codeTypeOptions: Array<{ label: string; value: string }>;
}

const AddNewTypeModal: React.FC<AddNewTypeModalProps> = ({
  show,
  onClose,
  onSubmit,
  employeeData,
  codeTypeOptions,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      attachId: undefined,
      codeType: undefined,
      startDate: undefined,
      endDate: undefined,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <MyModal
      modalProps={{
        show: Boolean(show),
        onClose: handleClose,
      }}
      headerProps={{
        children: <h2 className="text-xl font-semibold">{t('Add new type')}</h2>,
        className: 'px-6',
      }}
      bodyProps={{
        children: (
          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="attachId"
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
                control={control}
                render={({ field, fieldState }) => (
                  <MySelect
                    label={t('Select code type')}
                    options={codeTypeOptions?.map((evt: any) => ({
                      label: evt.label,
                      value: evt.value,
                    }))}
                    value={field.value as any}
                    onChange={(val: any) => {
                      field.onChange((val as ISelect)?.value ?? val);
                    }}
                    onBlur={field.onBlur}
                    error={!!fieldState.error}
                    allowedRoles={['ADMIN', 'HR']}
                  />
                )}
              />
              <Controller
                name="startDate"
                control={control}
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
                control={control}
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
            <div className="mt-6 flex w-full justify-end gap-4">
              <MyButton onClick={onClose} variant="secondary">
                {t('Cancel')}
              </MyButton>
              <MyButton type="submit" variant="primary">
                {t('Create')}
              </MyButton>
            </div>
          </form>
        ),
        className: 'py-4',
      }}
    />
  );
};

export default AddNewTypeModal;
