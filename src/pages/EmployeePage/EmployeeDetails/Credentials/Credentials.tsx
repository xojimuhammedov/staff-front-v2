import Button from 'components/Atoms/MyButton';
import MyModal from 'components/Atoms/MyModal';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useDeleteQuery, useGetAllQuery, useGetOneQuery } from 'hooks/api';
import { Edit, Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Form from './Create';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import EditForm from './Edit';

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

    const { mutate: deleteRequest } = useDeleteQuery({
        listKeyId: KEYS.credentials
    });

    const deleteItem = (id: number) => {
        deleteRequest(
            {
                url: `${URLS.credentials}/${id}`
            },
            {
                onSuccess: () => {
                    refetch();
                }
            }
        );
    };

    return (
        <>
            <div className='flex justify-end'> <Button startIcon={<Plus />} onClick={() => setShowModal(true)} className={'[&_svg]:stroke-bg-white'} variant='primary'>Add new type</Button></div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'>
                {
                    data?.map((item: any) => (
                        <div key={item?.id} className='bg-white border border-gray-200 rounded-lg shadow-sm p-4 gap-2'>
                            <h2 className='text-base font-medium'>{item?.code}</h2>
                            <div className='flex items-center gap-1 mt-4'>
                                <p className='text-sm'>Type:</p>
                                <b className='text-sm'>{item?.type}</b>
                            </div>
                            <div className='flex items-center gap-2 mt-4'>
                                <Button variant='destructive' onClick={() => deleteItem(item?.id)} className={'w-full font-medium'}>Delete</Button>
                                <Button variant='secondary' onClick={() => {
                                    setCredentialId(item?.id)
                                    setShow(true)
                                }} startIcon={<Edit />}></Button>
                            </div>
                        </div>
                    ))
                }
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
                    children: <Form refetch={refetch} onClose={() => setShowModal(false)} employeeId={id} />
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
