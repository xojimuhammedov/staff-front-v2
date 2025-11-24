import DataGrid from 'components/Atoms/DataGrid';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useDeleteQuery, useGetAllQuery } from 'hooks/api';
import { IFilter } from './../../../../interfaces/filter.interface';
import { get } from 'lodash';
import TableProvider from 'providers/TableProvider/TableProvider';
import { useMemo, useState } from 'react';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useTranslation } from 'react-i18next';
import { IEmployee } from 'interfaces/employee/employee.interface';
import NoDataCard from './NoDataCard';
import { IAction } from '../../../../interfaces/action.interface';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import MyButton from 'components/Atoms/MyButton/MyButton';
import Loading from 'assets/icons/Loading';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';

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

  const dataColumn = [
    {
      id: 1,
      label: t('Name'),
      headerClassName: 'w-1/2'
    },
    {
      id: 2,
      label: t('Organization Name'),
      headerClassName: 'w-1/2'
    },
  ];

  const filter: IFilter[] = useMemo(
    () => [],
    [t]
  );

  const rowActions: IAction[] = useMemo(
    () => [
      {
        icon: <Edit3 size={DEFAULT_ICON_SIZE} />,
        type: 'primary',
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
        <TableProvider<IEmployee, IFilter[]>
          values={{
            columns,
            filter,
            rows: get(data, 'data', []),
            keyExtractor: 'id'
          }}>
          <DataGrid
            isLoading={isLoading}
            rowActions={rowActions}
            dataColumn={dataColumn}
            hasExport={false}
            hasCheckbox={false}
            hasAction={false}
            hasFilters={false}
            pagination={data}
          />
        </TableProvider>
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
