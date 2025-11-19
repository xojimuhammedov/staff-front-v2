import { MyInput, MySelect } from 'components/Atoms/Form';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import MyToggle from 'components/Atoms/MyToggle/MyToggle';
import { Settings2 } from 'lucide-react';
import { Organization } from 'pages/OrganizationPage/interface/organization.interface';
import { ISelect } from 'interfaces/select.interface';
import * as yup from "yup";
import MyModal from 'components/Atoms/MyModal';

interface OptionItem {
  type: string;
  useful: number[];
  unuseful: number[];
}

const GeneralDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<OptionItem[]>([
    {
      type: "WEBSITE",
      useful: [],
      unuseful: [],
    },
    {
      type: "ACTIVE_WINDOW",
      useful: [],
      unuseful: [],
    },
  ]);

  const handleChange = (type: string, field: "useful" | "unuseful", values: number[]) => {
    setOptions((prev) =>
      prev.map((item) =>
        item.type === type ? { ...item, [field]: values } : item
      )
    );
  };
  const [typeValue, setTypeValue] = useState<any>(null)
  const { data: policyGroups } = useGetAllQuery<any>({
    key: KEYS.getPolicyGroups,
    url: URLS.getPolicyGroups,
    params: {
      type: typeValue === "ACTIVE_WINDOW" ? "APPLICATION" : typeValue
    }
  });

  const schema = object().shape({
    title: string().required(),
    description: string(),
    organizationId: yup.number(),
    screenshotInterval: yup.number(),
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors }
  } = useForm<any>({
    defaultValues: {
      isScreenshotEnabled: false,
      isActiveWindowEnabled: false,
      isVisitedSitesEnabled: false,
      screenshotInterval: 60,
      screenshotIsGrayscale: false,
      screenshotCaptureAll: false,
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const { data } = useGetAllQuery<any>({
    key: KEYS.getAllListOrganization,
    url: URLS.getAllListOrganization,
    params: {}
  })

  const { mutate: create, isLoading } = usePostQuery({
    listKeyId: KEYS.getPolicyList,
    hideSuccessToast: true
  });

  const onSubmit = (data: any) => {
    const submitData = {
      options: options,
      ...data
    }
    create(
      {
        url: URLS.getPolicyList,
        attributes: submitData
      },
      {
        onSuccess: (data) => {
          console.log(data)
          navigate(`/policy/create?current-step=1&current-rule=employee-groups&policyId=${data?.data?.id}`);
          toast.success(t('Successfully created!'));
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message || 'ERROR');
        }
      }
    );
  };

  const getValues = (type: string, field: "useful" | "unuseful") => {
    const found = options.find((item) => item.type === type);
    return found ? found[field] : [];
  };

  const selectOptions =
    policyGroups?.data?.map((evt: any) => ({
      label: evt.name,
      value: evt.id,
    })) || [];

  const filteredType = options?.find((o) => o.type === typeValue);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <LabelledCaption
          title={t('Schedule details')}
          subtitle={t('Edit module name and description')}
        />
        <MyDivider className="mb-3xl" />
        <div className="mb-12 flex w-full items-start justify-between">
          <LabelledCaption
            className="flex-1"
            title={t('Group name')}
            subtitle={t('Short and easy-to-understand name')}
          />
          <MyInput
            {...register('title')}
            error={Boolean(errors?.title?.message)}
            helperText={t(`${errors?.title?.message}`)}
            rootClassName="max-w-[462px]"
            placeholder={t('Enter group name')}
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
                  options={data?.data?.map((evt: Organization) => ({
                    label: evt.fullName,
                    value: evt.id,
                  }))}
                  placeholder='Select organization'
                  value={field.value as any}  // 👈 cast to any
                  onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
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
            <Controller
              name='isScreenshotEnabled'
              control={control}
              render={({ field }) => (
                <MyToggle
                  checked={field.value}
                  onChange={field.onChange}
                  className='w-full'
                  label='Screenshots of the display'
                  iconButton={{
                    icon: (
                      <Settings2 />
                    ),
                    onClick: () => field.value ? setShow(true) : {},
                  }}
                />
              )}
            />
            <Controller
              name='isVisitedSitesEnabled'
              control={control}
              render={({ field }) => (
                <MyToggle
                  checked={field.value}
                  onChange={field.onChange}
                  className='w-full'
                  label='Web visiting'
                  iconButton={{
                    icon: (
                      <Settings2 />
                    ),
                    onClick: () => field.value ? (
                      setOpen(true),
                      setTypeValue("WEBSITE")
                    ) : {},
                  }}
                />
              )}
            />
            <Controller
              name='isActiveWindowEnabled'
              control={control}
              render={({ field }) => (
                <MyToggle
                  checked={field.value}
                  onChange={field.onChange}
                  className='w-full'
                  label='Active Window'
                  iconButton={{
                    icon: (
                      <Settings2 />
                    ),
                    onClick: () => field.value ? (
                      setOpen(true),
                      setTypeValue("ACTIVE_WINDOW")
                    ) : {},
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <MyButton type="submit" variant="primary">
            {t('Create')}
          </MyButton>
        </div>
        <MyModal
          modalProps={{
            show: Boolean(show),
            onClose: () => {
              setShow(false)
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
                    {...register('screenshotInterval')}
                    error={Boolean(errors?.screenshotInterval?.message)}
                    helperText={t(`${errors?.screenshotInterval?.message}`)}
                    placeholder={t('Enter screenshot interval')}
                  />
                  <Controller
                    name='screenshotCaptureAll'
                    control={control}
                    render={({ field }) => (
                      <MyToggle
                        checked={field.value}
                        onChange={field.onChange}
                        className='w-full cursor-pointer'
                        label='Screenshots of the screenshotCaptureAll'
                        iconButton={null}
                      />
                    )}
                  />
                  <Controller
                    name='screenshotIsGrayscale'
                    control={control}
                    render={({ field }) => (
                      <MyToggle
                        checked={field.value}
                        onChange={field.onChange}
                        className='w-full'
                        label='Screenshots of the screenshotIsGrayscale'
                        iconButton={null}
                      />
                    )}
                  />
                </div>
                <div className="mt-2 flex w-full justify-end gap-4 pb-2">
                  <MyButton
                    onClick={() => {
                      setShow(false)
                    }}
                    variant="primary">{t("Done")}</MyButton>
                </div>
              </>
            )
          }}
        />

        <MyModal
          modalProps={{
            show: Boolean(open),
            onClose: () => {
              setOpen(false)
            }
          }}
          headerProps={{
            children: <h2 className="text-xl font-semibold">{
              typeValue === "WEBSITE" ? t('Policy web visiting') : t('Policy web application')}</h2>,
            className: 'px-6'
          }}
          bodyProps={{
            children: (
              <>
                <div className='flex flex-col gap-4 mt-4'>
                  {filteredType && (
                    <>
                      <MySelect
                        label={t("Foydali saytlar")}
                        isMulti
                        options={selectOptions}
                        value={selectOptions.filter((opt: any) =>
                          getValues(filteredType.type, "useful").includes(opt.value)
                        )}
                        onChange={(selected: any) =>
                          handleChange(
                            filteredType.type,
                            "useful",
                            selected.map((s: any) => s.value)
                          )
                        }
                      />

                      <MySelect
                        label={t("Foydasiz saytlar")}
                        isMulti
                        options={selectOptions}
                        value={selectOptions.filter((opt: any) =>
                          getValues(filteredType.type, "unuseful").includes(opt.value)
                        )}
                        onChange={(selected: any) =>
                          handleChange(
                            filteredType.type,
                            "unuseful",
                            selected.map((s: any) => s.value)
                          )
                        }
                      />
                    </>
                  )}
                </div>
                <div className="mt-2 flex w-full justify-end gap-4 pb-2">
                  <MyButton onClick={() => {
                    setOpen(false)
                  }}
                    variant="primary">{t("Done")}</MyButton>
                </div>
              </>
            )
          }}
        />
      </form>
    </>
  );
};

export default GeneralDetails;
