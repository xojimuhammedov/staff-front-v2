import TableProvider from 'providers/TableProvider/TableProvider';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from 'components/Atoms/DataGrid';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useLocation, useNavigate } from 'react-router-dom';
import { AreaChart, Edit3, Trash2 } from 'lucide-react';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { useDeleteQuery, useGetAllQuery, usePostQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { IFilter } from 'interfaces/filter.interface';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { IAction } from 'interfaces/action.interface';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import MyAvatar from 'components/Atoms/MyAvatar'
import config from 'configs';

import AvatarIcon from '../../../assets/icons/avatar.jpg'
import { searchValue } from 'types/search';

type EmployeeListProps = {
  searchValue?: searchValue;
};

const EmployeeList = ({ searchValue }: EmployeeListProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [show, setShow] = useState(false)
  const [employeeId, setEmployeeId] = useState<any | null>(null)

  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.getEmployeeList,
    url: URLS.getEmployeeList,
    params: {
      search: searchValue?.search,
      departmentId: searchValue?.subdepartmentId ? searchValue.subdepartmentId : searchValue?.parentDepartmentId,
      page: searchValue?.page || 1,
      limit: searchValue?.limit || 10,
      // attachedId: searchValue?.attachedId 
    }
  });
  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'fullName',
        label: t('Employees'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="flex items-center w-full gap-4 dark:text-text-title-dark">
            <MyAvatar size="medium" imageUrl={row?.photo ? `${config.FILE_URL}api/storage/${row?.photo}` : AvatarIcon} />
            {row?.name}
          </div>
        )
      },
      {
        key: 'department',
        label: t('Department'),
        headerClassName: 'w-1/3',
        cellRender: (row) => <div className="department-text">{row?.department?.shortName ?? '--'}</div>
      },
      {
        key: 'phone',
        label: t('Phone number'),
        headerClassName: 'w-1/3',
        cellRender: (row) => <>{row?.phone ?? '--'}</>
      }
    ],
    [t]
  );

  const dataColumn = [
    {
      id: 1,
      label: t('Employees'),
      headerClassName: 'w-1/3'
    },
    {
      id: 2,
      label: t('Department'),
      headerClassName: 'w-1/3'
    },
    {
      id: 3,
      label: t('Phone Number'),
      headerClassName: 'w-1/3'
    }
  ];

  const filter: IFilter[] = useMemo(
    () => [
    ],
    [t]
  );

  const rowActions: IAction[] = useMemo(
    () => [
      {
        icon: <AreaChart size={DEFAULT_ICON_SIZE} />,
        type: 'primary',
        name: t('Details'),
        action: (row, $e) => {
          navigate(`/employees/about/${row.id}`);
        }
      },
      {
        icon: <Edit3 size={DEFAULT_ICON_SIZE} />,
        type: 'primary',
        name: t('Edit'),
        action: (row, $e) => {
          navigate(`/employees/edit/${row.id}`);
        },
        allowedRoles: ['ADMIN', 'HR'],
      },
      {
        icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
        type: 'danger',
        name: t('Delete'),
        action: (row, $e) => {
          setShow(true)
          setEmployeeId(row?.id)
        },
        allowedRoles: ['ADMIN', 'HR'],
      }
    ],
    [t]
  );

  const { mutate: deleteRequest } = useDeleteQuery({
    listKeyId: KEYS.getEmployeeList
  });

  const deleteItem = () => {
    deleteRequest(
      {
        url: `${URLS.getEmployeeList}/${employeeId}`
      },
      {
        onSuccess: () => {
          refetch();
          setShow(false)
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
      <TableProvider<IEmployee, IFilter[]>
        values={{
          columns,
          filter,
          rows: get(data, 'data', []),
          keyExtractor: 'id'
        }}>
        <DataGrid
          isLoading={isLoading}
          hasCustomizeColumns={true}
          dataColumn={dataColumn}
          rowActions={rowActions}
          pagination={data}
        />
      </TableProvider>
      <ConfirmationModal
        title={t("Bu hodimni o'chirmoqchimisiz?")}
        subTitle={t("Bu amalni qaytarib bo'lmaydi!")}
        open={show} setOpen={setShow} confirmationDelete={deleteItem} />
    </>
  );
};

export default EmployeeList;
