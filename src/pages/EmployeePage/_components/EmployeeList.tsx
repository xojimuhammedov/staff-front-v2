import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AreaChart, Edit3, Mail, Phone, Trash2, Calendar } from 'lucide-react';
import { useDeleteQuery, useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { IAction } from 'interfaces/action.interface';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import MyAvatar from 'components/Atoms/MyAvatar'
import config from 'configs';
import storage from 'services/storage';
import AvatarIcon from '../../../assets/icons/avatar.jpg'
import { searchValue } from 'types/search';
import { CredentialIcons } from './CredentialTooltip';
import DateText from 'components/Atoms/DateText';
import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';

type EmployeeListProps = {
  searchValue?: searchValue;
};

const EmployeeList = ({ searchValue }: EmployeeListProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isView = location.pathname === '/view';
  const isWhitelistPage = location.pathname === '/employees/whiteList';
  const isTerminatedPage = location.pathname === '/employees/terminatedEmployees';

  const userData: any = storage.get('userData');
  const userRole = JSON.parse(userData || '{}')?.role;
  const isGuard = userRole === 'GUARD';
  const currentLang: any = i18n.resolvedLanguage;
  const [searchParams] = useSearchParams();
  const [show, setShow] = useState(false);
  const [employeeId, setEmployeeId] = useState<any | null>(null);

  const listQueryKey = isWhitelistPage
    ? `${KEYS.getEmployeeList}-whitelist`
    : isTerminatedPage
      ? `${KEYS.getEmployeeList}-terminated`
      : KEYS.getEmployeeList;

  const { data, isLoading, refetch } = useGetAllQuery({
    key: listQueryKey,
    url: URLS.getEmployeeList,
    params: {
      search: searchValue?.search,
      departmentId:
        searchParams.get('current-setting') === 'employee_list'
          ? searchValue?.parentDepartmentId
          : searchValue?.subdepartmentId,
      page: searchValue?.page || 1,
      limit: searchValue?.limit || 10,
      ...(isWhitelistPage && { isWhitelist: true }),
      ...(isTerminatedPage && { isActive: false }),
    },
  });
  const columns: DataGridColumnType[] = useMemo(() => {
    const cols: DataGridColumnType[] = [
      {
        key: 'fullName',
        label: t('Employees'),
        headerClassName: 'dark:text-text-title-dark',
        cellRender: (row) => (
          <div className="flex items-center w-full gap-4 dark:text-text-title-dark">
            <MyAvatar
              size="medium"
              imageUrl={row?.photo ? `${config.FILE_URL}api/storage/${row?.photo}` : AvatarIcon}
            />
            <div className="flex flex-col">
              <p className="font-medium">{row?.name}</p>
              <span className="text-xs">{row?.job?.[currentLang]}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'department',
        label: t('Department'),
        headerClassName: 'dark:text-text-title-dark',
        cellRender: (row) => (
          <div className="department-text dark:text-text-title-dark">
            {row?.department?.shortName ?? '--'}
          </div>
        ),
      },
      {
        key: 'credential',
        label: t('Credentials'),
        headerClassName: 'dark:text-text-title-dark',
        cellRender: (row) => (
          <CredentialIcons credentials={row?.credentials} />
        ),
      },
      {
        key: 'phone',
        label: t('Phone number'),
        headerClassName: 'dark:text-text-title-dark',
        cellRender: (row) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              {row?.phone && <Phone size={16} className="shrink-0" />}
              <p className="text-sm dark:text-text-title-dark">{row?.phone ?? '--'}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {row?.email && <Mail size={16} className="shrink-0" />}
              <p
                className="text-sm truncate max-w-[180px] dark:text-text-title-dark"
                title={row?.email}
              >
                {row?.email ?? '--'}
              </p>
            </div>
          </div>
        ),
      },

      {
        key: 'birthday',
        label: t('Birthday'),
        headerClassName: 'dark:text-text-title-dark',
        cellRender: (row) => (
          <div className="flex items-center gap-2 text-text-base dark:text-text-title-dark">
            <Calendar size={16} className="text-text-muted" />
            <DateText value={row?.birthday} />
          </div>
        ),
      },
    ];

    return isView ? cols.filter((col) => !['credential', 'joinDate'].includes(col.key)) : cols;

  }, [t, isView, currentLang]);

  const rowActions: IAction[] = useMemo(
    () => {
      if (isGuard) return [];

      return [
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
      ];
    },
    [t, isGuard, navigate]
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
      <DynamicTable
        data={get(data, 'data', [])}
        pagination={get(data, 'meta')}
        columns={columns}
        rowActions={rowActions}
        hasIndex={true}
      />
      <ConfirmationModal
        title={t('Are you sure you want to delete this employee?')}
        subTitle={t("This action cannot be undone!")}
        open={show} setOpen={setShow} confirmationDelete={deleteItem} />
    </>
  );
};

export default EmployeeList;
