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
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import ReasonModal from './ReasonModal';

import AvatarIcon from '../../../assets/icons/avatar.jpg'


const AttendanceList = () => {
  const { t } = useTranslation();
  const location = useLocation()
  const searchValue: any = paramsStrToObj(location.search)
  const { control, watch } = useForm()

  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.attendacesForEmployee,
    url: URLS.attendacesForEmployee,
    params: {
      search: searchValue?.search,
      // date: dayjs(watch('date')?.startDate)?.format("YYYY-MM-DD")
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
      // {
      //   key: 'department',
      //   label: t('Department'),
      //   headerClassName: 'w-1/3',
      //   cellRender: (row) => <div className="department-text">{row?.employee?.department?.fullName ?? '--'}</div>
      // },
      {
        key: 'arrivalStatus',
        label: t('Come status'),
        headerClassName: 'w-1/3',
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
        headerClassName: 'w-1/3',
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
        key: "reason",
        label: t("Reason"),
        headerClassName: 'w-1/3',
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
    // {
    //   id: 2,
    //   label: t('Department'),
    //   headerClassName: 'w-1/3'
    // },
    {
      id: 3,
      label: t('Come status'),
      headerClassName: 'w-1/3'
    },
    {
      id: 4,
      label: t('Left status'),
      headerClassName: 'w-1/3'
    },
    {
      id: 5,
      label: t('Work on time'),
      headerClassName: 'w-1/4'
    },
    {
      id: 6,
      label: t('Reason'),
      headerClassName: 'w-1/3'
    }
  ];

  const filter: IFilter[] = useMemo(
    () => [],
    [t]
  );

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
          hasFilters={false}
          dataColumn={dataColumn}
          hasExport={false}
          hasCheckbox={false}
          rowActions={rowActions}
          pagination={data}
          hasButton={false}
          hasDatePicker={
            <>
              <div className="w-[140px]">
                <MyTailwindPicker
                  useRange={false}
                  name='date'
                  asSingle={true}
                  control={control}
                  placeholder={t('Today')}
                  startIcon={<Calendar stroke="#9096A1" />}
                />
              </div>
            </>
          }
        />
      </TableProvider>
    </>
  );
};

export default AttendanceList;
