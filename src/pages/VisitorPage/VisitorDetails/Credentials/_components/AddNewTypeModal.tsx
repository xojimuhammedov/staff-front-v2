import React from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import MyModal from 'components/Atoms/MyModal';
import { MyInput, MySelect } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { ISelect } from 'interfaces/select.interface';
import { MyDateTimePicker } from 'components/Atoms/Form/MyDateTimePicker';
import { yupResolver } from '@hookform/resolvers/yup';
import { onetimeCodeSchema } from 'schema/visitor.schema';

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


  interface FormValues {
    codeType: string | undefined;
    carNumber?: string;
    startDate: string | null;
    endDate: string | null;
  }

  const { control, handleSubmit, reset, register, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      codeType: undefined,
      startDate: null,
      endDate: null,
    },
    mode: 'onChange',
    resolver: yupResolver(onetimeCodeSchema) as any,
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
              <MyInput
                {...register('carNumber')}
                error={Boolean(errors?.carNumber?.message)}
                helperText={t(`${errors?.carNumber?.message}`)}
                label={t('Car Number')}
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
                    allowedRoles={['ADMIN', 'HR', 'GUARD']}
                  />
                )}
              />
              <MyDateTimePicker
                name="startDate"
                control={control}
                label={t('Start time')}
              />
              <MyDateTimePicker
                name="endDate"
                control={control}
                label={t('End time')}
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
        className: '',
      }}
    />
  );
};

export default AddNewTypeModal;
