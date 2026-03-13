import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';
import { searchValue } from 'types/search';
import MyBadge from 'components/Atoms/MyBadge';
import { User, ShieldAlert, ShieldCheck, MonitorDot, Delete, Trash2 } from 'lucide-react';
import DateText from 'components/Atoms/DateText';
import { useNavigate } from 'react-router-dom';
import { useDeleteQuery } from 'hooks/api';
import { IAction } from 'interfaces/action.interface';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import AssignEmployeeModal from './AssignEmployeeModal';
import { Link, Unlink } from 'lucide-react';
import { useState } from 'react';
import { DEFAULT_ICON_SIZE } from '@/constants/ui.constants';

interface Props {
  searchValue?: searchValue;
}

const BADGE_CLASSES = {
  red: 'border border-tag-red-icon [&_p]:text-tag-red-text dark:border-tag-red-icon dark:[&_p]:text-tag-red-text',
  green:
    'border border-tag-green-icon [&_p]:text-tag-green-text dark:border-tag-green-icon dark:[&_p]:text-tag-green-text',
  blue:
    'border border-tag-blue-icon [&_p]:text-tag-blue-text dark:border-tag-blue-icon dark:[&_p]:text-tag-blue-text',
} as const;

const ComputerUsersList = ({ searchValue }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | string | null>(null);

  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.getComputerUserList,
    url: URLS.getComputerUserList,
    params: {
      search: searchValue?.search,
      page: searchValue?.page || 1,
      limit: searchValue?.limit || 10,
    },
  });

  const { mutate: deleteMutate } = useDeleteQuery({
    listKeyId: KEYS.getComputerUserList
  });

  const handleDelete = () => {
    if (!selectedId) return;
    deleteMutate(
      { url: `${URLS.getComputerUserList}/${selectedId}/unlink-employee` },
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setSelectedId(null);
          refetch();
        }
      }
    );
  };

  const columns: DataGridColumnType[] = useMemo(() => {
    return [
      {
        key: 'employee',
        label: t('Employee'),
        headerClassName: 'dark:text-text-title-dark',
        cellRender: (row) => (
          <div className="flex items-center w-full gap-4 dark:text-text-title-dark min-w-max">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
              <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-text-base dark:text-text-title-dark">
                {row?.employee?.name ?? t('Unassigned')}
              </p>
              {row?.employee?.department?.shortName && (
                <span className="text-xs text-text-muted">
                  {row.employee.department.shortName}
                </span>
              )}
            </div>
          </div>
        ),
      },
      {
        key: 'pcDetails',
        label: t('PC Details'),
        headerClassName: 'dark:text-text-title-dark min-w-max',
        cellRender: (row) => (
          <div className="flex flex-col dark:text-text-title-dark">
            <span className="font-medium text-sm">{row?.username ?? '--'}</span>
            <span className="text-xs text-text-muted">{row?.domain ?? '--'}</span>
          </div>
        ),
      },
      {
        key: 'isAdmin',
        label: t('Role'),
        headerClassName: 'dark:text-text-title-dark min-w-max',
        cellRender: (row) => {
          return (
            <div className="flex items-center gap-1.5">
              {row?.isAdmin ? (
                <MyBadge variant="blue" className={BADGE_CLASSES['blue']}>
                  <ShieldCheck size={14} className="mr-1 inline" />
                  {t('Admin')}
                </MyBadge>
              ) : (
                <MyBadge variant="neutral" className="border border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300">
                  <ShieldAlert size={14} className="mr-1 inline" />
                  {t('Standard')}
                </MyBadge>
              )}
            </div>
          );
        },
      },
      {
        key: 'status',
        label: t('Status'),
        headerClassName: 'dark:text-text-title-dark min-w-max',
        cellRender: (row) => {
          const isActive = row?.isActive;
          return (
            <MyBadge
              className={BADGE_CLASSES[isActive ? 'green' : 'red']}
              variant={isActive ? 'green' : 'red'}
            >
              {isActive ? t('Active') : t('Inactive')}
            </MyBadge>
          );
        },
      },
      {
        key: 'computers_count',
        label: t('Computers'),
        headerClassName: 'dark:text-text-title-dark min-w-max',
        cellRender: (row) => (
           <div className="flex items-center gap-1.5 dark:text-text-title-dark">
             <MonitorDot size={18} className="text-text-muted" />
             <span className="font-medium">{row?._count?.computers ?? 0}</span>
           </div>
        ),
      },
      {
        key: 'createdAt',
        label: t('Created At'),
        headerClassName: 'dark:text-text-title-dark min-w-max',
        cellRender: (row) => (
           <div className="text-sm dark:text-text-title-dark">
             <DateText value={row?.createdAt} />
           </div>
        ),
      },
    ];
  }, [t]);

  const rowActions: IAction[] = useMemo(() => {
    return [
      {
        icon: <Link size={DEFAULT_ICON_SIZE} />,
        type: 'primary',
        name: t('Assign'),
        action: (row, $e) => {
          $e?.stopPropagation();
          setSelectedId(row.id);
          setIsAssignOpen(true);
        },
        hidden: (row) => row?.employeeId !== null
      },
      {
        icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
        type: 'danger',
        name: t('Delete'),
        action: (row, $e) => {
          $e?.stopPropagation();
          setSelectedId(row.id);
          setIsDeleteOpen(true);
        },
        hidden: (row) => row?.employeeId === null
      }
    ];
  }, [t]);

  if (isLoading) {
    return (
      <div className="absolute flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative flex-1 bg-white dark:bg-[rgb(var(--color-bg-bgblack-dark))] rounded-lg">
      <DynamicTable
        data={get(data, 'data', [])}
        pagination={data}
        columns={columns}
        rowActions={rowActions}
        hasIndex={true}
      />

      <AssignEmployeeModal
        open={isAssignOpen}
        setOpen={setIsAssignOpen}
        computerUserId={selectedId}
        onSuccess={refetch}
      />
      <ConfirmationModal
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        title={t('Are you sure you want to unlink this employee?')}
        subTitle={t('This action will remove the assigned employee from this computer profile.')}
        confirmationDelete={handleDelete}
      />
    </div>
  );
};

export default ComputerUsersList;
