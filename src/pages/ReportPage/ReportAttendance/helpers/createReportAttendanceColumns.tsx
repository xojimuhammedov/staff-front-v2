import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import MyAvatar from 'components/Atoms/MyAvatar';
import MyBadge from 'components/Atoms/MyBadge';
import config from 'configs';
import dayjs from 'dayjs';
import { IAction } from 'interfaces/action.interface';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getTimeDifference } from 'utils/helper';
import AvatarIcon from '../../../../assets/icons/avatar.jpg';

export const createReportAttendanceColumns = () => {
  const { t } = useTranslation();

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'fullName',
        label: t('Employee name'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            <MyAvatar
              size="medium"
              imageUrl={
                row?.employee?.photo
                  ? `${config.FILE_URL}api/storage/${row?.employee?.photo}`
                  : AvatarIcon
              }
            />
            {row?.employee?.name}
          </div>
        ),
      },
      {
        key: 'arrivalStatus',
        label: t('Come status'),
        headerClassName: 'w-1/4',
        cellRender: (row) => {
          if (row?.arrivalStatus) {
            return (
              <MyBadge
                variant={
                  row?.arrivalStatus === 'LATE'
                    ? 'orange'
                    : row.arrivalStatus === 'ABSENT'
                      ? 'red'
                      : 'green'
                }
              >
                {t(row?.arrivalStatus)}
              </MyBadge>
            );
          } else return '--';
        },
      },
      {
        key: 'goneStatus',
        label: t('Left status'),
        headerClassName: 'w-1/4',
        cellRender: (row) => {
          if (row?.goneStatus) {
            return (
              <MyBadge variant={row?.goneStatus === 'EARLY' ? 'orange' : 'green'}>
                {row?.goneStatus}
              </MyBadge>
            );
          } else return '--';
        },
      },
      {
        key: 'workonTime',
        label: t('Work on time'),
        headerClassName: 'w-1/4',
        cellRender: (row) => {
          if (row?.startTime) {
            return (
              <div className="department-text">
                {' '}
                {getTimeDifference(row?.startTime, row?.endTime)}{' '}
              </div>
            );
          } else return '--';
        },
      },
      {
        key: 'startTime',
        label: t('Arrival time'),
        headerClassName: 'w-1/4',
        cellRender: (row) => {
          if (row?.startTime) {
            return (
              <div className="department-text">
                {' '}
                {dayjs(row?.startTime).format('YYYY-MM-DD, HH:mm')}{' '}
              </div>
            );
          } else return '--';
        },
      },
      {
        key: 'endTime',
        label: t('End time'),
        headerClassName: 'w-1/4',
        cellRender: (row) => {
          if (row?.endTime) {
            return (
              <div className="department-text">
                {' '}
                {dayjs(row?.endTime).format('YYYY-MM-DD, HH:mm')}{' '}
              </div>
            );
          } else return '--';
        },
      },
    ],
    [t]
  );

  const dataColumn = [
    {
      id: 1,
      label: t('Employee name'),
      headerClassName: 'w-1/3',
    },
    {
      id: 3,
      label: t('Come status'),
      headerClassName: 'w-1/4',
    },
    {
      id: 4,
      label: t('Left status'),
      headerClassName: 'w-1/4',
    },
    {
      id: 5,
      label: t('Work on time'),
      headerClassName: 'w-1/4',
    },
    {
      id: 6,
      label: t('Arrival time'),
      headerClassName: 'w-1/4',
    },
    {
      id: 7,
      label: t('End time'),
      headerClassName: 'w-1/4',
    },
  ];
  const rowActions: IAction[] = useMemo(
    () => [],
    [t]
  );

  return {
    rowActions,
    dataColumn,
    columns,
  };
};
