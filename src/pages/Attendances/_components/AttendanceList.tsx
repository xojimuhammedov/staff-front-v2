import TableProvider from 'providers/TableProvider/TableProvider';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from 'components/Atoms/DataGrid';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useLocation } from 'react-router-dom';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { IFilter } from 'interfaces/filter.interface';
import { IAction } from 'interfaces/action.interface';
import { getTimeDifference, paramsStrToObj } from 'utils/helper';
import MyAvatar from 'components/Atoms/MyAvatar';
import MyBadge from 'components/Atoms/MyBadge';
import config from 'configs';
import dayjs from 'dayjs';
import ReasonModal from './ReasonModal';
import AvatarIcon from '../../../assets/icons/avatar.jpg'
import { searchValue } from 'types/search';


const AttendanceList = ({ watch }: any) => {
  const { t } = useTranslation();
  const location = useLocation()
  const searchValue: searchValue = paramsStrToObj(location.search)

  const paramsValue = watch('date') ? {
    startDate: dayjs(watch('date')?.startDate)?.format("YYYY-MM-DD"),
    endDate: dayjs(watch('date')?.endDate)?.format("YYYY-MM-DD")
  } : {
    date: dayjs(new Date())?.format("YYYY-MM-DD")
  }

  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.attendacesForEmployee,
    url: URLS.attendacesForEmployee,
    params: {
      search: searchValue?.search,
      page: searchValue?.page || 1,
      limit: searchValue?.pageSize || 10,
      ...paramsValue
    }
  });
  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'fullName',
        label: t('Employee name'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            <MyAvatar size="medium" imageUrl={row?.employee?.photo ? `${config.FILE_URL}api/storage/${row?.employee?.photo}` : AvatarIcon} />
            {row?.employee?.name}
          </div>
        )
      },
      {
        key: 'arrivalStatus',
        label: t('Come status'),
        headerClassName: 'w-1/4',
        cellRender: (row) => {
          if (row?.arrivalStatus) {
            return (
              <MyBadge variant={row?.arrivalStatus === "LATE" ? "orange" : row.arrivalStatus === "ABSENT" ? "red" : 'green'}>
                {row?.arrivalStatus}
              </MyBadge>
            );
          } else return '--';
        }
      },
      {
        key: 'goneStatus',
        label: t('Left status'),
        headerClassName: 'w-1/4',
        cellRender: (row) => {
          if (row?.goneStatus) {
            return (
              <MyBadge variant={row?.goneStatus === "EARLY" ? "orange" : 'green'}>
                {row?.goneStatus}
              </MyBadge>
            );
          } else return '--';
        }
      },
      {
        key: 'workonTime',
        label: t('Work on time'),
        headerClassName: 'w-1/4',
        cellRender: (row) => {
          if (row?.startTime) {
            return (
              <div className="department-text">{getTimeDifference(row?.startTime, row?.endTime)}</div>
            )
          } else return "--"
        }
      },
      {
        key: 'startTime',
        label: t('Arrival time'),
        headerClassName: 'w-1/4',
        cellRender: (row) => {
          if (row?.startTime) {
            return (
              <div className="department-text">{dayjs(row?.startTime).format("YYYY-MM-DD, HH:mm")}</div>
            )
          } else return "--"
        }
      },
      {
        key: "reason",
        label: t("Reason"),
        headerClassName: 'w-1/4',
        cellRender: (row) => <ReasonModal row={row} refetch={refetch} />
      }
    ],
    [t]
  );

  const dataColumn = [
    {
      id: 1,
      label: t('Employee name'),
      headerClassName: 'w-1/3'
    },
    {
      id: 3,
      label: t('Come status'),
      headerClassName: 'w-1/4'
    },
    {
      id: 4,
      label: t('Left status'),
      headerClassName: 'w-1/4'
    },
    {
      id: 5,
      label: t('Work on time'),
      headerClassName: 'w-1/4'
    },
    {
      id: 6,
      label: t('Arrival time'),
      headerClassName: 'w-1/4'
    },
    {
      id: 7,
      label: t('Reason'),
      headerClassName: 'w-1/4'
    }
  ];

  const filter: IFilter[] = useMemo(
    () => [],
    [t]
  )
  const rowActions: IAction[] = useMemo(
    () => [],
    [t]
  );

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
          hasAction={false}
          hasCustomizeColumns={true}
          dataColumn={dataColumn}
          rowActions={rowActions}
          pagination={data}
        />
      </TableProvider>
    </>
  );
};

export default AttendanceList;
