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
import ReasonModal from '../_components/ReasonModal';
import { useNavigate } from 'react-router-dom';
import AvatarIcon from '../../../assets/icons/avatar.jpg';
import DateText from 'components/Atoms/DateText';

const BADGE_CLASSES = {
  orange: 'border border-tag-orange-icon [&_p]:text-tag-orange-text dark:border-tag-orange-icon dark:[&_p]:text-tag-orange-text',
  red: 'border border-tag-red-icon [&_p]:text-tag-red-text dark:border-tag-red-icon dark:[&_p]:text-tag-red-text',
  green: 'border border-tag-green-icon [&_p]:text-tag-green-text dark:border-tag-green-icon dark:[&_p]:text-tag-green-text',
  blue: 'border border-tag-blue-icon [&_p]:text-tag-blue-text dark:border-tag-blue-icon dark:[&_p]:text-tag-blue-text',
} as const;


export const createColumns = ({ refetch }: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getProgressBarColor = (percent: number) => {
    if (percent < 40) {
      return 'bg-red-500';
    } else if (percent >= 40 && percent < 70) {
      return 'bg-orange-400';
    } else {
      return 'bg-green-500';
    }
  };

  const renderBadge = (variant: 'orange' | 'red' | 'green' | 'blue', text: string) => (
    <MyBadge className={`${BADGE_CLASSES[variant]} min-w-max`} variant={variant}>
      {text}
    </MyBadge>
  );

  const renderStatusBadge = (status?: string, map?: Record<string, 'orange' | 'red' | 'green' | 'blue'>) => {
    if (!status) return '--';
    const variant = map?.[status] ?? 'green';
    return renderBadge(variant, t(status));
  };

  const renderTimeCell = (time?: string, format = 'HH:mm') => {
    if (!time) return '--';
    return (
      <div className="department-text text-text-base dark:text-text-title-dark">
        {' '}
        {dayjs(time).format(format)}{' '}
      </div>
    );
  };

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'fullName',
        label: t('Employee name'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="flex items-center gap-2 dark:text-text-title-dark">
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
        label: t('Arrival status'),
        headerClassName: 'w-1/4',
        cellRender: (row) =>
          renderStatusBadge(row?.arrivalStatus, { LATE: 'orange', ABSENT: 'red' }),
      },
      {
        key: 'arrivalTime',
        label: t('Arrival time'),
        headerClassName: 'w-1/4',
        cellRender: (row) => renderTimeCell(row?.startTime, 'HH:mm'),
      },
      {
        key: 'goneStatus',
        label: t('Left status'),
        headerClassName: 'w-1/4',
        cellRender: (row) =>
          renderStatusBadge(row?.goneStatus, { EARLY: 'blue' }),
      },
      {
        key: 'goneTime',
        label: t('Gone time'),
        headerClassName: 'w-1/4',
        cellRender: (row) => {
          if (row?.endTime) return renderTimeCell(row?.endTime, 'HH:mm');
          if (row?.arrivalStatus === 'ABSENT' || row?.arrivalStatus === 'PENDING') {
            return '--';
          }
          return renderBadge('green', t('Working now'));
        },
      },
      {
        key: 'workonTime',
        label: t('Work on time'),
        headerClassName: 'w-1/4',
        cellRender: (row) => {
          if (row?.arrivalStatus === 'ABSENT' || row?.arrivalStatus === 'PENDING') {
            return '--';
          }
          if (row?.startTime) {
            const plannedMinutes = Number(row?.plannedMinutes ?? 0);
            const effectiveEndTime = row?.endTime ?? dayjs().toISOString();
            const minutes = Math.max(0, dayjs(effectiveEndTime).diff(dayjs(row?.startTime), 'minute'));
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            const percent =
              plannedMinutes > 0 ? Math.min(100, Math.round((minutes / plannedMinutes) * 100)) : 0;
            
            const progressBarColor = getProgressBarColor(percent);
            
            return (
              <div className="flex flex-col gap-1">
                <div className="text-sm text-text-base dark:text-text-title-dark">
                  {t('work_time_format', { hours, minutes: mins })}
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${progressBarColor}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="text-xs text-text-muted">{percent}%</div>
              </div>
            );
          } else return '--';
        },
      },
      {
        key: 'arrivalDate',
        label: t('Arrival date'),
        headerClassName: 'w-1/4',
        cellRender: (row) => <DateText value={row?.startTime} />,
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
      id: 2,
      label: t('Arrival status'),
      headerClassName: 'w-1/4',
    },
    {
      id: 3,
      label: t('Arrival time'),
      headerClassName: 'w-1/4',
    },
    {
      id: 4,
      label: t('Left status'),
      headerClassName: 'w-1/4',
    },
    {
      id: 5,
      label: t('Gone time'),
      headerClassName: 'w-1/4',
    },
    {
      id: 6,
      label: t('Work on time'),
      headerClassName: 'w-1/4',
    },
    {
      id: 7,
      label: t('Arrival date'),
      headerClassName: 'w-1/4',
    },
    {
      id: 8,
      label: t('Reason'),
      headerClassName: 'w-28',
    },
  ];
  const rowActions: IAction[] = useMemo(
    () => [
      {
        icon: <View size={DEFAULT_ICON_SIZE} />,
        type: 'secondary',
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