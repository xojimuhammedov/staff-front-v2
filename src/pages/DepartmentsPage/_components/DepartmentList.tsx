import React, { useState } from 'react';
import EditForm from './EditForm';
import MyModal from 'components/Atoms/MyModal';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import Form from './Form';
import DepartmentCard from './DepartmentCard';
import { get } from 'lodash';
import { URLS } from 'constants/url';
import { useDeleteQuery, useGetOneQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { Department } from '../interface/department.interface';
import { useTranslation } from 'react-i18next';

const DepartmentList = ({ data, refetch, setShowModal, showModal }: any) => {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const [show, setShow] = useState(false)
    const [departmentId, setDepartmentId] = useState<any | null>(null)
    const { mutate: deleteRequest } = useDeleteQuery({
        listKeyId: KEYS.getAllListDepartment
    });

    const deleteItem = () => {
        deleteRequest(
            {
                url: `${URLS.getAllListDepartment}/${departmentId}`
            },
            {
                onSuccess: () => {
                    refetch();
                    setOpen(false)
                }
            }
        );
    };

    const { data: getOne } = useGetOneQuery({
        id: departmentId,
        url: URLS.getAllListDepartment,
        params: {},
        enabled: !!departmentId
    });
    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'>
                {
                    get(data, 'data')?.map((item: Department) => (
                        <DepartmentCard setDepartmentId={setDepartmentId} setShow={setShow} setOpen={setOpen} item={item} />
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
                    children: <h2 className="text-xl font-semibold">{t('Create new department')}</h2>,
                    className: 'px-6'
                }}
                bodyProps={{
                    children: <Form refetch={refetch} onClose={() => setShowModal(false)} />
                }}
            />
            <ConfirmationModal
                title={t("Bu tashkilotni o'chirmoqchimisiz?")}
                subTitle={t("Bu amalni qaytarib bo'lmaydi!")}
                open={open} setOpen={setOpen} confirmationDelete={deleteItem} />
            <MyModal
                modalProps={{
                    show: Boolean(show),
                    onClose: () => {
                        setShow(false)
                    }
                }}
                headerProps={{
                    children: <h2 className="text-xl font-semibold">{t('Edit department')}</h2>,
                    className: 'px-6'
                }}
                bodyProps={{
                    children: <EditForm
                        departmentId={departmentId}
                        data={getOne} refetch={refetch} onClose={() => setShow(false)} />
                }}
            />
        </>
    );
}

export default DepartmentList;
