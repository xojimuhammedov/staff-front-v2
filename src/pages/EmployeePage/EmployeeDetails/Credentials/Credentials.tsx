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

const Credentials = () => {
    const { id } = useParams()
    const { t } = useTranslation()
    const [showModal, setShowModal] = useState(false)
    const [show, setShow] = useState(false)
    const [credentialId, setCredentialId] = useState(null)
    const { data, refetch }: any = useGetAllQuery({
        key: KEYS.getCredentialByEmployee,
        url: `${URLS.getCredentialByEmployee}/${id}`,
        params: {}
    })
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

    const onSubmit = (data: any) => {
        update(
            {
                url: `${URLS.credentials}/${data?.id}`,
                attributes: {
                    isActive: data?.isActive ? false : true
                }
            },
            {
                onSuccess: () => {
                    toast.success(t('Edit successfully!'));
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
        <>
            <div className='flex justify-end'>
                <Button startIcon={<Plus />} onClick={() => setShowModal(true)} className={'[&_svg]:stroke-bg-white'} variant='primary'>Add new type</Button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'>
                {data?.map((item: any) => (
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
                            ) : (
                                <h2 className='text-2xl font-semibold text-gray-800'>{item?.code}</h2>
                            )}
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
                                    onSubmit(item);
                                }}
                            >
                                Active
                            </Button>
                            <Button
                                variant='secondary'
                                onClick={() => {
                                    setCredentialId(item?.id);
                                    setShow(true);
                                }}
                                startIcon={<Edit />}
                            />
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
        </>
    );
}

export default Credentials;
