import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useDeleteQuery, useGetAllQuery } from 'hooks/api';
import { get } from 'lodash';
import { useMemo, useState } from 'react';
import { DataGridColumnType } from 'components/Atoms/DataGrid/NewTable';
import { useTranslation } from 'react-i18next';
import NoDataCard from './NoDataCard';
import { IAction } from '../../../../interfaces/action.interface';
import { Edit3, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import Loading from 'assets/icons/Loading';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import { DynamicTable } from '@/components/Atoms/DataGrid/NewTable';

const PolicyList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [policyId, setPolicyId] = useState();
  const [open, setOpen] = useState(false);
  const { data, isLoading, refetch } = useGetAllQuery<any>({
    key: KEYS.getPolicyList,
    url: URLS.getPolicyList,
    params: {}
  });

  const handClickOpen = (row: any) => {
    setOpen(true);
    setPolicyId(row);
  };

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'title',
        label: t('Name'),
        headerClassName: 'w-1/2',
        cellRender: (row) => <div className="dark:text-text-title-dark">{row?.title ?? '--'}</div>
      },
      { key: 'description', headerClassName: 'w-1/2', label: t('Organization Name'), cellRender: (row) => <div className="dark:text-text-title-dark">{row?.organization?.fullName ?? '--'}</div> },
    ],
    [t]
  );

  const rowActions: IAction[] = useMemo(
    () => [
      {
        icon: <Edit3 size={DEFAULT_ICON_SIZE} />,
        type: 'secondary',
        name: t('Edit'),
        action: (row, $e) => {
          navigate(`/policy/edit/${row.id}`);
        },
        allowedRoles: ['ADMIN', 'HR'],
      },
      {
        icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
        type: 'danger',
        name: t('Delete'),
        action: (row, $e) => {
          handClickOpen(row?.id);
        },
        allowedRoles: ['ADMIN', 'HR'],
      }
    ],
    [t]
  );

  const { mutate: deleteRequest } = useDeleteQuery({
    listKeyId: KEYS.getPolicyList
  });

  const deleteItem = () => {
    deleteRequest(
      {
        url: `${URLS.getPolicyList}/${policyId}`
      },
      {
        onSuccess: () => {
          refetch();
          setOpen(false)
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="absolute flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  }
  return (
    <>
      {get(data, 'data')?.length > 0 ? (
        <DynamicTable
          data={get(data, 'data', [])}
          pagination={data}
          columns={columns}
          rowActions={rowActions}
          hasIndex={true}
        />
      ) : (
        <NoDataCard />
      )}
      <ConfirmationModal
        title={t("Bu policyni o'chirmoqchimisiz?")}
        subTitle={t("Bu amalni qaytarib bo'lmaydi!")}
        open={open} setOpen={setOpen} confirmationDelete={deleteItem} />
    </>
  );
};

export default PolicyList;
