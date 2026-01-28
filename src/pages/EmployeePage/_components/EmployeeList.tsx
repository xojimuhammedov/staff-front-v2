import TableProvider from 'providers/TableProvider/TableProvider';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from 'components/Atoms/DataGrid';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AreaChart, Edit3, Mail, Phone, Trash2, Calendar } from 'lucide-react';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { useDeleteQuery, useGetAllQuery, usePostQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import 'dayjs/locale/uz';
import 'dayjs/locale/uz-latn';
import 'dayjs/locale/en';
import Loading from 'assets/icons/Loading';
import { IFilter } from 'interfaces/filter.interface';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { IAction } from 'interfaces/action.interface';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import MyAvatar from 'components/Atoms/MyAvatar'
import config from 'configs';

import AvatarIcon from '../../../assets/icons/avatar.jpg'
import { searchValue } from 'types/search';
import { CredentialIcons } from './CredentialTooltip';

type EmployeeListProps = {
  searchValue?: searchValue;
};

const EmployeeList = ({ searchValue }: EmployeeListProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.resolvedLanguage;
  const dateLocale = currentLang?.startsWith('ru')
    ? 'ru'
    : currentLang?.startsWith('uz')
      ? 'uz-latn'
      : 'en';
  const [searchParams] = useSearchParams()
  const [show, setShow] = useState(false)
  const [employeeId, setEmployeeId] = useState<any | null>(null)

  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.getEmployeeList,
    url: URLS.getEmployeeList,
    params: {
      search: searchValue?.search,
      departmentId: searchParams.get("current-setting") === "employee_list" ? searchValue?.parentDepartmentId : searchValue?.subdepartmentId,
      page: searchValue?.page || 1,
      limit: searchValue?.limit || 10,
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
            <div className='flex flex-col'>
              <p className='font-medium'>{row?.name}</p>
              <span className='text-xs'>{row?.job?.[`${currentLang}`]}</span>
            </div>
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
        key: 'credential',
        label: t('Credentials'),
        headerClassName: 'w-1/3',
        cellRender: (row) => <CredentialIcons credentials={row?.credentials} />
      },
      {
        key: 'phone',
        label: t('Phone number'),
        headerClassName: 'w-1/3',
        cellRender: (row) =>
          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-1'>
              {row?.phone ? <Phone size={16} /> : null}
              <p className='text-sm'>{row?.phone ?? '--'}</p>
            </div>
            <div className='flex items-center gap-1'>
              {row?.email ? <Mail size={16} /> : null}
              <p className='text-sm'>{row?.email ?? '--'}</p>
            </div>
          </div>
      },
      {
        key: 'joinDate',
        label: t('Join Date'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="flex items-center gap-2 text-text-base dark:text-text-title-dark">
            <Calendar size={16} className="text-text-muted" />
            <span>
              {row?.createdAt ? dayjs(row?.createdAt).locale(dateLocale).format('DD MMM YYYY') : '--'}
            </span>
          </div>
        )
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
      label: t('Credentials'),
      headerClassName: 'w-1/3'
    },
    {
      id: 4,
      label: t('Phone number'),
      headerClassName: 'w-1/3'
    },
    {
      id: 5,
      label: t('Join Date'),
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
        type: 'secondary',
        name: t('Details'),
        action: (row, $e) => {
          navigate(`/employees/about/${row.id}`);
        }
      },
      {
        icon: <Edit3 size={DEFAULT_ICON_SIZE} />,
        type: 'secondary',
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
        title={t('Are you sure you want to delete this employee?')}
        subTitle={t("Bu amalni qaytarib bo'lmaydi!")}
        open={show} setOpen={setShow} confirmationDelete={deleteItem} />
    </>
  );
};

export default EmployeeList;
