import React, { useState } from 'react';
import EditForm from './EditForm';
import MyModal from 'components/Atoms/MyModal';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import Form from './Form';
import DepartmentCard from './DepartmentCard';
import { Department } from '../interface/department.interface';
import { useTranslation } from 'react-i18next';
import { useDepartment } from '../hooks/useDepartment';
import { useDeleteDepartment } from '../hooks/useDeleteDepartment';
import DepartmentListItem from './DepartmentListItem';

const DepartmentList = ({ setShowModal, showModal, viewMode }: any) => {
  const { t } = useTranslation();
  const { data, refetch } = useDepartment();
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const { deleteItem, setDepartmentId, setOpen, open } = useDeleteDepartment();

  return (
    <>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4">
          {data?.map((item: Department) => (
            <DepartmentCard
              setDepartmentId={setDepartmentId}
              setShow={setShow}
              action={true}
              setOpen={setOpen}
              setEditId={setEditId}
              item={item}
            />
          ))}
        </div>
      ) : (
        <>
          {data?.map((item: Department) => (
            <DepartmentListItem
              setDepartmentId={setDepartmentId}
              setShow={setShow}
              action={true}
              setOpen={setOpen}
              setEditId={setEditId}
              item={item}
            />
          ))}
        </>
      )}
      <MyModal
        modalProps={{
          show: Boolean(showModal),
          onClose: () => {
            setShowModal(false);
          },
        }}
        headerProps={{
          children: <h2 className="text-xl font-semibold">{t('Create new department')}</h2>,
          className: 'px-6',
        }}
        bodyProps={{
          children: <Form onClose={() => setShowModal(false)} />,
        }}
      />
      <ConfirmationModal
        title={t('Are you sure you want to delete this department?')}
        subTitle={t('This action cannot be undone!')}
        open={open}
        setOpen={setOpen}
        confirmationDelete={deleteItem}
      />
      <MyModal
        modalProps={{
          show: Boolean(show),
          onClose: () => {
            setShow(false);
          },
        }}
        headerProps={{
          children: <h2 className="text-xl font-semibold">{t('Edit department')}</h2>,
          className: 'px-6',
        }}
        bodyProps={{
          children: <EditForm setShow={setShow} editId={editId} refetch={refetch} />,
        }}
      />
    </>
  );
};

export default React.memo(DepartmentList);
