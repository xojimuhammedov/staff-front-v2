import { MyCheckbox, MyInput, MySelect, MyTextarea } from 'components/Atoms/Form';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, useGetOneQuery, usePutQuery } from 'hooks/api';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { Organization } from 'pages/OrganizationPage/interface/organization.interface';
import { ISelect } from 'interfaces/select.interface';
import { Settings2 } from 'lucide-react';
import MyToggle from 'components/Atoms/MyToggle/MyToggle';
import MyModal from 'components/Atoms/MyModal';


interface OptionItem {
  type: string;
  useful: number[];
  unuseful: number[];
}

const GeneralDetails = () => {
  const { t } = useTranslation();
  const { id }: any = useParams();
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  const [typeValue, setTypeValue] = useState<any>(null)
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
  const { data } = useGetAllQuery<any>({
    key: KEYS.getListOrganizationSelf,
    url: URLS.getListOrganizationSelf,
    params: {}
  })

  const { data: getOnePolicy, refetch } = useGetOneQuery({
    id: id,
    url: URLS.getPolicyList,
    params: {},
    enabled: !!id
  })

  const { data: policyGroups } = useGetAllQuery<any>({
    key: KEYS.getPolicyGroups,
    url: URLS.getPolicyGroups,
    params: {
      type: typeValue === "ACTIVE_WINDOW" ? "APPLICATION" : typeValue
    }
  });


  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors }
  } = useForm<any>({
    defaultValues: useMemo(() => {
      return {
        title: get(getOnePolicy, 'data.title'),
        organizationId: get(getOnePolicy, 'data.organizationId'),
        isScreenshotEnabled: get(getOnePolicy, 'data.isScreenshotEnabled'),
        isActiveWindowEnabled: get(getOnePolicy, 'data.isActiveWindowEnabled'),
        isVisitedSitesEnabled: get(getOnePolicy, 'data.isVisitedSitesEnabled'),
        screenshotInterval: get(getOnePolicy, 'data.screenshotInterval'),
        screenshotIsGrayscale: get(getOnePolicy, 'data.screenshotIsGrayscale'),
        screenshotCaptureAll: get(getOnePolicy, 'data.screenshotCaptureAll'),
      };
    }, [getOnePolicy]),
    mode: 'onChange',
  });

  useEffect(() => {
    reset({
      title: get(getOnePolicy, 'data.title'),
      organizationId: get(getOnePolicy, 'data.organizationId'),
      isScreenshotEnabled: get(getOnePolicy, 'data.isScreenshotEnabled'),
      isActiveWindowEnabled: get(getOnePolicy, 'data.isActiveWindowEnabled'),
      isVisitedSitesEnabled: get(getOnePolicy, 'data.isVisitedSitesEnabled'),
      screenshotInterval: get(getOnePolicy, 'data.screenshotInterval'),
      screenshotIsGrayscale: get(getOnePolicy, 'data.screenshotIsGrayscale'),
      screenshotCaptureAll: get(getOnePolicy, 'data.screenshotCaptureAll'),
    });
  }, [getOnePolicy]);

  const handleChange = (type: string, field: "useful" | "unuseful", values: number[]) => {
    setOptions((prev) =>
      prev.map((item) =>
        item.type === type ? { ...item, [field]: values } : item
      )
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
    })) ?? [];

  const filteredType = options?.find((o) => o.type === typeValue);

  const { mutate: update } = usePutQuery({
    listKeyId: KEYS.getPolicyList,
    hideSuccessToast: true
  });

  const onSubmit = (data: any) => {
    update(
      {
        url: `${URLS.getPolicyList}/${id}`,
        attributes: data
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully edited!'));
          reset();
          refetch()
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message)
        }
      }
    );
  };


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
                options={data?.map((evt: Organization) => ({
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
          {t('Save changes')}
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
  );
};

export default GeneralDetails;
