import Button from 'components/Atoms/MyButton';
import MyModal from 'components/Atoms/MyModal';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useDeleteQuery, useGetAllQuery, useGetOneQuery, usePutQuery } from 'hooks/api';
import { Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Form from './Create';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import EditForm from './Edit';
import config from 'configs';
import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';
import { MySelect } from 'components/Atoms/Form';
import { credentialTypeData } from 'configs/type';
import { ISelect } from 'interfaces/select.interface';
import ConfirmationCredential from './Confirmation';
import CredentialCard from './CredentialCard';
import Loading from 'assets/icons/Loading';

const Credentials = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<any>();
  const [credentialId, setCredentialId] = useState(null);
  const { control, watch } = useForm();

  const paramsValue = watch('type')?.label === 'All' ? null : watch('type');

  const { data, refetch, isLoading }: any = useGetAllQuery({
    key: KEYS.credentials,
    url: URLS.credentials,
    params: {
      employeeId: Number(id),
      type: paramsValue,
    },
  });

  const typeData = [
    {
      label: t('All'),
      value: null,
    },
    ...credentialTypeData,
  ];


  const { data: getOne } = useGetOneQuery({
    id: credentialId,
    url: URLS.credentials,
    params: {},
    enabled: !!credentialId,
  });

  const { mutate: update } = usePutQuery({
    listKeyId: KEYS.credentials,
    hideSuccessToast: true,
  });
  const { mutate: deleteCredential } = useDeleteQuery({
    listKeyId: KEYS.credentials,
  });

  const onSubmit = () => {
    update(
      {
        url: `${URLS.credentials}/${active?.id}`,
        attributes: {
          isActive: active?.isActive ? false : true,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully edited!'));
          refetch();
          setOpen(false);
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message);
        },
      }
    );
  };

  const handleDelete = (credentialId: string) => {
    deleteCredential(
      {
        url: `${URLS.credentials}/${credentialId}`,
      },
      {
        onSuccess: () => {
          refetch();
        },
        onError: (e: any) => {
          toast.error(e?.response?.data?.error?.message || t('Delete failed'));
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end gap-4">
        <div className="flex w-[200px]">
          <Controller
            name="type"
            control={control}
            render={({ field, fieldState }) => (
              <MySelect
                placeholder={t('Select type')}
                options={typeData?.map((evt: any) => ({
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
          className={`text-sm [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
          variant="primary"
        >
          {t('Add new type')}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {data?.data?.map((item: any) => {
          const imageUrl =
            item?.type === "PHOTO"
              ? `${config.FILE_URL}api/storage/${item?.additionalDetails}`
              : undefined;
          const qrImageUrl = undefined;
          return (
            <CredentialCard
              key={item.id}
              id={item.id}
              type={item.type}
              value={item.code}
              imageUrl={item.type === "QR" ? qrImageUrl : imageUrl}
              isActive={!!item.isActive}
              createdAt={item.createdAt}
              updatedAt={item.updatedAt}
              organizationId={item.organizationId}
              onToggleActive={() => {
                setActive(item);
                setOpen(true);
              }}
              onDelete={handleDelete}
              code={item?.code || undefined}
            />
          )
        }
        )}
      </div>
      <MyModal
        modalProps={{
          show: Boolean(showModal),
          onClose: () => {
            setShowModal(false);
          },
        }}
        headerProps={{
          children: (
            <h2 className="text-xl font-semibold text-text-base dark:text-text-title-dark">
              {t('Create new type')}
            </h2>
          ),
          className: 'px-6',
        }}
        bodyProps={{
          children: <Form refetch={refetch} onClose={() => setShowModal(false)} employeeId={id} />,
        }}
      />
      <MyModal
        modalProps={{
          show: Boolean(show),
          onClose: () => {
            setShow(false);
          },
        }}
        headerProps={{
          children: (
            <h2 className="text-xl font-semibold text-text-base dark:text-text-title-dark">
              {t('Edit credential')}
            </h2>
          ),
          className: 'px-6',
        }}
        bodyProps={{
          children: (
            <EditForm
              credentialId={credentialId}
              data={getOne}
              refetch={refetch}
              onClose={() => setShow(false)}
              employeeId={id}
            />
          ),
        }}
      />
      <ConfirmationCredential
        title={
          active?.isActive
            ? t('Are you sure you want to deactivate this credential?')
            : t('Are you sure you want to activate this credential?')
        }
        subTitle={t("Bu amalni qaytarib bo'lmaydi!")}
        open={open}
        setOpen={setOpen}
        confirmationDelete={onSubmit}
      />
    </>
  );
};

export default Credentials;
