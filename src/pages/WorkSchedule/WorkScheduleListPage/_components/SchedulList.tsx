import TableProvider from 'providers/TableProvider/TableProvider';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from 'components/Atoms/DataGrid';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useLocation, useNavigate } from 'react-router-dom';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { useDeleteQuery, useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { IFilter } from 'interfaces/filter.interface';
import { IAction } from 'interfaces/action.interface';
import { paramsStrToObj } from 'utils/helper';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { Clock, Edit3, Plus, Trash2 } from 'lucide-react';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import { searchValue } from 'types/search';
import { twMerge } from 'tailwind-merge';


const WorkScheduleList = () => {
  const { t } = useTranslation();
  const location = useLocation()
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [scheduleId, setScheduleId] = useState(null)
  const searchValue: searchValue = paramsStrToObj(location.search)

  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.employeeSchedulePlan,
    url: URLS.employeeSchedulePlan,
    params: {
      search: searchValue?.search,
      page: searchValue?.page || 1,
      limit: searchValue?.limit || 10,
    }
  });
  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'name',
        label: t('Schedule name'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-text-base dark:text-text-title-dark">
              {row?.name ?? "--"}
            </span>
            <span className="text-xs text-text-muted dark:text-text-subtle">
              {row?.organization?.shortName ?? row?.organization?.fullName ?? "--"}
            </span>
          </div>
        )
      },
      {
        key: 'weekdays',
        label: t('Weekdays'),
        headerClassName: 'w-1/3',
        cellRender: (row) => {
          const selected = Array.isArray(row?.weekdays) ? row.weekdays : [];
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          return (
            <div className="flex flex-wrap items-center gap-1">
              {days.map((day) => {
                const isActive = selected.includes(day);
                return (
                  <span
                    key={day}
                    className={twMerge(
                      'flex h-5 min-w-[20px] items-center justify-center rounded-md px-1 text-[11px] font-semibold uppercase',
                      isActive
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    )}
                  >
                    {t(day).slice(0, 3)}
                  </span>
                );
              })}
            </div>
          );
        },
      },
      {
        key: 'workTime',
        label: t('Time'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="flex items-center gap-2 text-text-base dark:text-text-title-dark">
            <span className="font-medium">{row?.startTime ?? '--'}</span>
            <span className="text-text-muted dark:text-subtext-color-dark">-</span>
            <span className="font-medium">{row?.endTime ?? '--'}</span>
          </div>
        )
      },
      {
        key: 'extraTime',
        label: t('Extra time'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/70 dark:bg-white/10">
              <Clock className="h-3.5 w-3.5" />
            </span>
            <span>
              {row?.extraTime ?? 0} {t('min')}
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
      label: t('Schedule name'),
      headerClassName: 'w-1/3'
    },
    {
      id: 2,
      label: t('Weekdays'),
      headerClassName: 'w-1/3'
    },
    {
      id: 3,
      label: t('Time'),
      headerClassName: 'w-1/3'
    },
    {
      id: 4,
      label: t('Extra time'),
      headerClassName: 'w-1/3'
    }
  ];

  const filter: IFilter[] = useMemo(
    () => [],
    [t]
  );

  const rowActions: IAction[] = useMemo(
    () => [
      {
        icon: <Edit3 size={DEFAULT_ICON_SIZE} />,
        type: 'secondary',
        name: t('Edit'),
        action: (row, $e) => {
          navigate(`/workschedule/edit/${row?.id}`)
        },
        allowedRoles: ['ADMIN', 'HR'],
      },
      {
        icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
        type: 'danger',
        name: t('Delete'),
        action: (row, $e) => {
          setShow(true)
          setScheduleId(row?.id)
        },
        allowedRoles: ['ADMIN', 'HR'],
      }
    ],
    [t]
  );

  const { mutate: deleteRequest } = useDeleteQuery({
    listKeyId: KEYS.employeeSchedulePlan
  });

  const deleteItem = () => {
    deleteRequest(
      {
        url: `${URLS.employeeSchedulePlan}/${scheduleId}`
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
      <div className="flex h-full w-full items-center justify-center">
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
          handleRowClick={(row: any) => navigate(`/workschedule/edit/${row?.id}`)}
        />
      </TableProvider>
      <ConfirmationModal
        title={t("Are you sure you want to delete this schedule?")}
        subTitle={t("This action cannot be undone!")}
        open={show} setOpen={setShow} confirmationDelete={deleteItem} />
    </>
  );
};

export default WorkScheduleList;
