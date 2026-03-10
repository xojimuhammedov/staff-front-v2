import React from 'react';
import { Controller } from 'react-hook-form';
import { Settings2 } from 'lucide-react';
import { MyInput, MySelect } from 'components/Atoms/Form';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyToggle from 'components/Atoms/MyToggle/MyToggle';
import { Organization } from 'pages/OrganizationPage/interface/organization.interface';
import { ISelect } from 'interfaces/select.interface';
import ScreenshotSettingsModal from '../../../CreatePolicyRulePage/_components/RuleForms/ScreenshotSettingsModal';
import WebActiveSettingsModal from '../../../CreatePolicyRulePage/_components/RuleForms/WebActiveSettingsModal';
import { useEditGeneralDetails } from './hooks/useEditGeneralDetails';

const GeneralDetails = () => {
  const {
    t,
    show,
    setShow,
    open,
    setOpen,
    typeValue,
    setTypeValue,
    formMethods,
    orgData,
    enumData,
    selectOptions,
    handleChange,
    getValues,
    onSubmit
  } = useEditGeneralDetails();

  const { handleSubmit, register, control, formState: { errors } } = formMethods;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-12 flex w-full items-start justify-between">
        <LabelledCaption
          className="flex-1"
          title={t('Group name')}
          subtitle={t('Short and easy-to-understand name')}
        />
        <MyInput
          rootClassName="w-[462px]"
          placeholder={t('Enter group name')}
          {...register("title")}
          error={Boolean(errors?.title?.message)}
          helperText={t(`${errors?.title?.message}`)}
        />
      </div>

      <div className="mb-12 flex w-full items-start justify-between">
        <LabelledCaption
          className="flex-1"
          title={t('Organization')}
          subtitle={t('')}
        />
        <div className='w-[462px]'>
          <Controller
            name="organizationId"
            control={control}
            render={({ field, fieldState }) => (
              <MySelect
                options={orgData?.data?.map((evt: Organization) => ({
                  label: evt.fullName,
                  value: evt.id,
                }))}
                placeholder='Select organization'
                value={field.value as any}  // 👈 cast to any
                onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                onBlur={field.onBlur}
                error={!!fieldState.error}
                allowedRoles={["ADMIN"]}
                required
              />
            )}
          />
        </div>
      </div>
      <MyDivider />
      <div className='flex w-full items-start justify-between'>
        <LabelledCaption
          className="flex-1"
          title={t('Politics')}
          subtitle={t('Short and understandable caption')}
        />
        <div className='flex gap-4 flex-col w-[462px]'>
          {!!enumData && Object.keys(enumData as Record<string, any>).map((type) => (
            <Controller
              key={type}
              name={`module_${type}_isEnabled`}
              control={control}
              render={({ field }) => (
                <MyToggle
                  checked={field.value || false}
                  onChange={field.onChange}
                  className='w-full'
                  label={
                    type === 'SCREENSHOT' ? t("Screenshots of the display") :
                    type === 'WEBSNIFFER' ? t("Web visiting") :
                    type === 'ACTIVEWINDOW' ? t("Active Window") :
                    type === 'KEYLOGGER' ? t("Keylogger") : String(type)
                  }
                  iconButton={
                    (type === "SCREENSHOT" || type === "WEBSNIFFER" || type === "ACTIVEWINDOW") ? {
                      icon: <Settings2 />,
                      onClick: () => {
                        if (field.value) {
                          if (type === "SCREENSHOT") {
                            setShow(true);
                          } else {
                            setOpen(true);
                            setTypeValue(type);
                          }
                        }
                      },
                    } : null
                  }
                />
              )}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <MyButton type="submit" variant="primary">
          {t('Save changes')}
        </MyButton>
      </div>

      <ScreenshotSettingsModal
        show={show}
        setShow={setShow}
        register={register}
        errors={errors}
        control={control}
      />

      <WebActiveSettingsModal
        open={open}
        setOpen={setOpen}
        typeValue={typeValue}
        selectOptions={selectOptions}
        getValues={getValues}
        handleChange={handleChange}
      />
    </form>
  );
};

export default GeneralDetails;
