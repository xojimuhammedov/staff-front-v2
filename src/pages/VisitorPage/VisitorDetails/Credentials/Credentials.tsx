import Button from 'components/Atoms/MyButton';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePutQuery, usePostQuery } from 'hooks/api';
import { Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import OnetimeCodeCard from './OnetimeCodeCard';
import AddNewTypeModal from './_components/AddNewTypeModal';
import { toast } from 'react-toastify';
import ConfirmationCredential from './Confirmation';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { MySelect } from 'components/Atoms/Form';
import { ISelect } from 'interfaces/select.interface';

const Credentials = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<any>();
  const [showModal, setShowModal] = useState(false);
  const { control } = useForm();

  const { data: onetimeCodesData, refetch: refetchOnetimeCodes }: any = useGetAllQuery({
    key: KEYS.getOnetimeCodes,
    url: URLS.getOnetimeCodes,
    params: {
      visitorId: Number(id),
    },
  });

  const { data: employeeData } = useGetAllQuery<any>({
    key: KEYS.getEmployeeList,
    url: URLS.getEmployeeList,
    params: {},
  });

  const codeTypeOptions = [
    { label: 'ONETIME', value: 'ONETIME' },
    { label: 'MULTIPLE', value: 'MULTIPLE' },
  ];

  const { mutate: updateOnetimeCode } = usePutQuery({
    listKeyId: KEYS.getOnetimeCodes,
    hideSuccessToast: true,
  });

  const { mutate: createOnetimeCode } = usePostQuery({
    listKeyId: KEYS.getOnetimeCodes,
    hideSuccessToast: true,
  });

  const onSubmitOnetimeCode = () => {
    updateOnetimeCode(
      {
        url: `${URLS.getOnetimeCodes}/${active?.id}`,
        attributes: {
          isActive: active?.isActive ? false : true,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('Edit successfully!'));
          refetchOnetimeCodes();
          setOpen(false);
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message);
        },
      }
    );
  };

  const handleModalSubmit = (data: any) => {
    const submitData = {
      visitorId: Number(id),
      attachId: data.attachId ? Number(data.attachId) : undefined,
      codeType: data.codeType,
      startDate: dayjs().toISOString(),
      endDate: dayjs().add(1, 'day').toISOString(),
      isActive: true,
    };

    createOnetimeCode(
      {
        url: URLS.getOnetimeCodes,
        attributes: submitData,
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully created!'));
          setShowModal(false);
          refetchOnetimeCodes();
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message || t('Error creating onetime code'));
        },
      }
    );
  };

  return (
    <>
      <div className="flex justify-end gap-4">
        <div className="flex w-[200px]">
          <Controller
            name="type"
            control={control}
            render={({ field, fieldState }) => (
              <MySelect
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
        </div>
        <Button
          startIcon={<Plus />}
          onClick={() => setShowModal(true)}
          className={'[&_svg]:stroke-bg-white'}
          variant="primary"
        >
          Add new type
        </Button>
      </div>
      {onetimeCodesData?.data && onetimeCodesData.data.length > 0 ? (
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {onetimeCodesData.data.map((code: any) => (
              <OnetimeCodeCard
                key={code?.id}
                code={code}
                onToggle={(code) => {
                  setActive(code);
                  setOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500">{t('No onetime codes found')}</div>
      )}
      <AddNewTypeModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        employeeData={employeeData}
        codeTypeOptions={codeTypeOptions}
      />
      <ConfirmationCredential
        title={
          active?.isActive
            ? t('Buning holatini faolsizlantirmoqchimisiz?')
            : t('Buning holatini faollashtirmoqchimisiz?')
        }
        subTitle={t("Bu amalni qaytarib bo'lmaydi!")}
        open={open}
        setOpen={setOpen}
        confirmationDelete={() => {
          // Visitors only have onetime codes
          onSubmitOnetimeCode();
        }}
      />
    </>
  );
};

export default Credentials;
