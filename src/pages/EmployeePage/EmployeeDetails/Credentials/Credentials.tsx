import Button from 'components/Atoms/MyButton';
import MyModal from 'components/Atoms/MyModal';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, useGetOneQuery, usePutQuery } from 'hooks/api';
import { Edit, Plus } from 'lucide-react';
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
import { QRCodeCanvas } from 'qrcode.react';

const Credentials = () => {
    const { id } = useParams()
    const { t } = useTranslation()
    const [showModal, setShowModal] = useState(false)
    const [show, setShow] = useState(false)
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState<any>()
    const [credentialId, setCredentialId] = useState(null)
    const { control, watch } = useForm()

    const paramsValue = watch("type")?.label === "All" ? null : watch("type")

    const { data, refetch }: any = useGetAllQuery({
        key: KEYS.credentials,
        url: URLS.credentials,
        params: {
            employeeId: Number(id),
            type: paramsValue
        }
    })

    const typeData = [
        {
            label: "All",
            value: null
        },
        ...credentialTypeData
    ]

    const { data: getOne } = useGetOneQuery({
        id: credentialId,
        url: URLS.credentials,
        params: {},
        enabled: !!credentialId
    });

    const { mutate: update } = usePutQuery({
        listKeyId: KEYS.credentials,
        hideSuccessToast: true
    });

    const onSubmit = () => {
        update(
            {
                url: `${URLS.credentials}/${active?.id}`,
                attributes: {
                    isActive: active?.isActive ? false : true
                }
            },
            {
                onSuccess: () => {
                    toast.success(t('Edit successfully!'));
                    refetch()
                    setOpen(false)
                },
                onError: (e: any) => {
                    console.log(e);
                    toast.error(e?.response?.data?.error?.message)
                }
            }
        );
    };

    return (
        <>
            <div className='flex justify-end gap-4'>
                <div className='flex w-[200px]'>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field, fieldState }) => (
                            <MySelect
                                options={typeData?.map((evt: any) => ({
                                    label: evt.label,
                                    value: evt.value,
                                }))}
                                value={field.value as any}
                                onChange={(val: any) => {
                                    field.onChange((val as ISelect)?.value ?? val)
                                }}
                                onBlur={field.onBlur}
                                error={!!fieldState.error}
                                allowedRoles={["ADMIN", "HR"]}
                            />
                        )}
                    />
                </div>
                <Button startIcon={<Plus />} onClick={() => setShowModal(true)} className={'[&_svg]:stroke-bg-white'} variant='primary'>Add new type</Button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8'>
                {data?.data?.map((item: any) => (
                    <div
                        key={item?.id}
                        className='bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col'
                    >
                        <div className='flex items-center mb-4'>
                            {item.type === "PHOTO" ? (
                                <img
                                    className='w-20 h-20 rounded-full object-cover'
                                    src={`${config.FILE_URL}api/storage/${item?.additionalDetails}`}
                                    alt="User photo"
                                />
                            ) : item?.type === "QR" ? (
                                <QRCodeCanvas
                                    value={item?.code}
                                    size={80}
                                    includeMargin
                                />
                            ) :
                                (
                                    <h2 className='text-xl font-semibold text-gray-800'>{item?.code}</h2>
                                )
                            }
                        </div>

                        <div className='mb-6'>
                            <p className='text-sm text-gray-600'>
                                Type: <span className='font-semibold'>{item?.type}</span>
                            </p>
                        </div>

                        <div className='flex items-center gap-2 mt-auto'>
                            <Button
                                variant='destructive'
                                className='w-full font-medium'
                                onClick={() => {
                                    setActive(item);
                                    setOpen(true)
                                }}
                            >
                                {item?.isActive ? "Inactive" : "Active"}
                            </Button>
                            {/* <Button
                                variant='secondary'
                                onClick={() => {
                                    setCredentialId(item?.id);
                                    setShow(true);
                                }}
                                startIcon={<Edit />}
                            /> */}
                        </div>
                    </div>
                ))}
            </div>
            <MyModal
                modalProps={{
                    show: Boolean(showModal),
                    onClose: () => {
                        setShowModal(false)
                    }
                }}
                headerProps={{
                    children: <h2 className="text-xl font-semibold">{t('Create new type')}</h2>,
                    className: 'px-6'
                }}
                bodyProps={{
                    children: <Form refetch={refetch} onClose={() => setShowModal(false)} employeeId={id} />,
                    className: "py-4"
                }}
            />
            <MyModal
                modalProps={{
                    show: Boolean(show),
                    onClose: () => {
                        setShow(false)
                    }
                }}
                headerProps={{
                    children: <h2 className="text-xl font-semibold">{t('Edit credential')}</h2>,
                    className: 'px-6'
                }}
                bodyProps={{
                    children: <EditForm
                        credentialId={credentialId}
                        data={getOne} refetch={refetch} onClose={() => setShow(false)} employeeId={id} />
                }}
            />
            <ConfirmationCredential
                title={active?.isActive ? t("Buning holatini faolsizlantirmoqchimisiz?") : t("Buning holatini faollashtirmoqchimisiz?")}
                subTitle={t("Bu amalni qaytarib bo'lmaydi!")}
                open={open} setOpen={setOpen} confirmationDelete={onSubmit}
            />
        </>
    );
}

export default Credentials;
