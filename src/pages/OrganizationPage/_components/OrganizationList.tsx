import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useDeleteQuery, useGetOneQuery } from 'hooks/api';
import React, { useState } from 'react';
import OrganizationCard from './OrganizationCard';
import { get } from 'lodash';
import MyDivider from 'components/Atoms/MyDivider';
import MyModal from 'components/Atoms/MyModal';
import { Organization } from '../interface/organization.interface';
import Form from './Form';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import { useTranslation } from 'react-i18next';
import EditForm from './EditForm';

const OrganizationList = ({ data, refetch, setShowModal, showModal }: any) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [organizationId, setOrganizationId] = useState<any | null>(null);

  const { mutate: deleteRequest } = useDeleteQuery({
    listKeyId: KEYS.getAllListOrganization,
  });

  const deleteItem = () => {
    deleteRequest(
      {
        url: `${URLS.getAllListOrganization}/${organizationId}`,
      },
      {
        onSuccess: () => {
          refetch();
          setOpen(false);
        },
      }
    );
  };

  const { data: getOne } = useGetOneQuery({
    id: organizationId,
    url: URLS.getAllListOrganization,
    params: {},
    enabled: !!organizationId,
  });

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4">
        {get(data, 'data')?.map((item: Organization) => (
          <OrganizationCard
            setOrganizationId={setOrganizationId}
            setShow={setShow}
            setOpen={setOpen}
            item={item}
          />
        ))}
      </div>
      <MyDivider />
      <MyModal
        modalProps={{
          show: Boolean(showModal),
          onClose: () => {
            setShowModal(false);
          },
        }}
        headerProps={{
          children: <h2 className="text-xl font-semibold">{t('Create new organization')}</h2>,
          className: 'px-6',
        }}
        bodyProps={{
          children: <Form refetch={refetch} onClose={() => setShowModal(false)} />,
        }}
      />
      <ConfirmationModal
        title={t('Are you sure you want to delete this organization')}
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
          children: <h2 className="text-xl font-semibold">{t('Edit organization')}</h2>,
          className: 'px-6',
        }}
        bodyProps={{
          children: (
            <EditForm
              organizationId={organizationId}
              data={getOne}
              refetch={refetch}
              onClose={() => setShow(false)}
            />
          ),
        }}
      />
    </>
  );
};

export default React.memo(OrganizationList);
