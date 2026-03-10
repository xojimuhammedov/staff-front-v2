import React from 'react';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import MyModal from 'components/Atoms/MyModal';
import { MyInput } from 'components/Atoms/Form';
import MyToggle from 'components/Atoms/MyToggle/MyToggle';
import MyButton from 'components/Atoms/MyButton/MyButton';

interface ScreenshotSettingsModalProps {
  show: boolean;
  setShow: (val: boolean) => void;
  register: any;
  errors: any;
  control: any;
}

const ScreenshotSettingsModal: React.FC<ScreenshotSettingsModalProps> = ({
  show,
  setShow,
  register,
  errors,
  control
}) => {
  const { t } = useTranslation();

  return (
    <MyModal
      modalProps={{
        show: Boolean(show),
        onClose: () => {
          setShow(false);
        }
      }}
      headerProps={{
        children: <h2 className="text-xl font-semibold">{t('Policy screenshot settings')}</h2>,
        className: 'px-6'
      }}
      bodyProps={{
        children: (
          <>
            <div className='flex flex-col gap-4 mt-4'>
              <MyInput
                {...register('interval')}
                error={Boolean(errors?.interval?.message)}
                helperText={t(`${errors?.interval?.message}`)}
                placeholder={t('Enter screenshot interval')}
              />
              <Controller
                name='isGrayscale'
                control={control}
                render={({ field }) => (
                  <MyToggle
                    checked={field.value}
                    onChange={field.onChange}
                    className='w-full cursor-pointer'
                    label={t("Screenshots of the isGrayscale")}
                    iconButton={null}
                  />
                )}
              />
            </div>
            <div className="mt-2 flex w-full justify-end gap-4 pb-2">
              <MyButton
                onClick={() => {
                  setShow(false);
                }}
                variant="primary"
              >
                {t("Done")}
              </MyButton>
            </div>
          </>
        )
      }}
    />
  );
};

export default ScreenshotSettingsModal;
