import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import MyAvatar from 'components/Atoms/MyAvatar';
import MyBadge from 'components/Atoms/MyBadge';
import config from 'configs';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import dayjs from 'dayjs';
import { IAction } from 'interfaces/action.interface';
import { View } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getTimeDifference } from 'utils/helper';
import ReasonModal from '../_components/ReasonModal';
import { useNavigate } from 'react-router-dom';
import AvatarIcon from '../../../assets/icons/avatar.jpg';

export const createColumns = ({ refetch }: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
              <div className="department-text text-text-base dark:text-text-title-dark">
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
              <div className="department-text text-text-base dark:text-text-title-dark">
                {' '}
                {dayjs(row?.startTime).format('YYYY-MM-DD, HH:mm')}{' '}
              </div>
            );
          } else return '--';
        },
      },
      {
        key: 'reason',
        label: t('Reason'),
        headerClassName: 'w-28',
        cellRender: (row) => <ReasonModal row={row} refetch={refetch} />,
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
      label: t('Reason'),
      headerClassName: 'w-28',
    },
  ];
  const rowActions: IAction[] = useMemo(
    () => [
      {
        icon: <View size={DEFAULT_ICON_SIZE} />,
        type: 'primary',
        name: t('View'),
        action: (row, $e) => {
          navigate(`/employees/about/${row?.employee?.id}?current-setting=attendance`);
        },
        allowedRoles: ['ADMIN', 'HR'],
      },
    ],
    [t]
  );

  return {
    rowActions,
    dataColumn,
    columns,
  };
};
