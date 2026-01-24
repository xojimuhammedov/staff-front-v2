import Button from 'components/Atoms/MyButton';
import MyModal from 'components/Atoms/MyModal';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, useGetOneQuery, usePutQuery } from 'hooks/api';
import { Download, Edit, Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Form from './Create';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import EditForm from './Edit';
import config from 'configs';
import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';
import { MySelect } from 'components/Atoms/Form';
import { credentialTypeData } from 'configs/type';
import { ISelect } from 'interfaces/select.interface';
import ConfirmationCredential from './Confirmation';
import { QRCodeCanvas } from 'qrcode.react';
import MyButton from 'components/Atoms/MyButton/MyButton';

const Credentials = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<any>();
  const [credentialId, setCredentialId] = useState(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { control, watch } = useForm();

  const paramsValue = watch('type')?.label === 'All' ? null : watch('type');

  const { data, refetch }: any = useGetAllQuery({
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

  const downloadQR = (code: string) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // Kattaroq rasm olish uchun yangi canvas yaratamiz
    const tempCanvas = document.createElement('canvas');
    const size = 512; // yoki 1024 — qanchalik katta bo'lsa shunchalik aniq

    tempCanvas.width = size;
    tempCanvas.height = size;

    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(canvas, 0, 0, size, size);

    const link = document.createElement('a');
    link.download = `QR_${code}.png`;
    link.href = tempCanvas.toDataURL('image/png', 1.0);
    link.click();
  };

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
          className={`text-sm [&_svg]:stroke-gray-600 dark:[&_svg]:stroke-black-300`}
          variant='primary'
        >
          {t('Add new typse')}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
        {data?.data?.map((item: any) => (
          <div
            key={item?.id}
            className="bg-white dark:bg-bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 flex flex-col"
          >
            <div className="flex items-center mb-4">
              {item.type === 'PHOTO' ? (
                <img
                  className="w-20 h-20 rounded-full object-cover"
                  src={`${config.FILE_URL}api/storage/${item?.additionalDetails}`}
                  alt="User photo"
                />
              ) : item?.type === 'QR' ? (
                <div className="flex justify-between w-full">
                  <QRCodeCanvas
                    value={item?.code}
                    ref={canvasRef}
                    size={80}
                    style={{ opacity: '0.2' }}
                    includeMargin
                  />
                  <MyButton
                    onClick={() => downloadQR(item?.code)}
                    variant="secondary"
                    startIcon={<Download />}
                  ></MyButton>
                </div>
              ) : (
                <h2 className="text-xl font-semibold text-gray-800 dark:text-text-title-dark">
                  {item?.code}
                </h2>
              )}
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-text-title-dark">
                {t('Type')}: <span className="font-semibold">{item?.type}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 mt-auto">
              <Button
                // variant="secondary"
                className={`
                  w-full rounded-md
                  bg-red-600 dark:bg-red-700 text-sm font-semibold text-white dark:text-white shadow-xs hover:bg-red-500 dark:hover:bg-red-600
                  [&_svg]:stroke-gray-600 dark:[&_svg]:stroke-gray-300
                `}
                onClick={() => {
                  setActive(item);
                  setOpen(true);
                }}
              >
                {item?.isActive ? t('Inactive') : t('Active')}
              </Button>
            </div>
          </div>
        ))}
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
