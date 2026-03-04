import MyAvatar from 'components/Atoms/MyAvatar';
import MyBadge from 'components/Atoms/MyBadge';
import config from 'configs';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ReasonModal from '../_components/ReasonModal';
import AvatarIcon from '../../../assets/icons/avatar.jpg';
import DateText from 'components/Atoms/DateText';
import { DataGridColumnType } from '@/components/Atoms/DataGrid/NewTable';

const BADGE_CLASSES = {
  orange:
    'border border-tag-orange-icon [&_p]:text-tag-orange-text dark:border-tag-orange-icon dark:[&_p]:text-tag-orange-text',
  red:
    'border border-tag-red-icon [&_p]:text-tag-red-text dark:border-tag-red-icon dark:[&_p]:text-tag-red-text',
  green:
    'border border-tag-green-icon [&_p]:text-tag-green-text dark:border-tag-green-icon dark:[&_p]:text-tag-green-text',
  blue:
    'border border-tag-blue-icon [&_p]:text-tag-blue-text dark:border-tag-blue-icon dark:[&_p]:text-tag-blue-text',
} as const;

export const createColumns = ({ refetch }: any) => {
  const { t } = useTranslation();

  const getProgressBarColor = (percent: number) => {
    if (percent < 40) return 'bg-red-500';
    if (percent < 70) return 'bg-orange-400';
    return 'bg-green-500';
  };

  const renderBadge = (variant: 'orange' | 'red' | 'green' | 'blue', text: string) => (
    <MyBadge className={`${BADGE_CLASSES[variant]} min-w-max`} variant={variant}>
      {text}
    </MyBadge>
  );

  const renderStatusBadge = (
    status?: string,
    map?: Record<string, 'orange' | 'red' | 'green' | 'blue'>
  ) => {
    if (!status) return '--';
    const variant = map?.[status] ?? 'green';
    return renderBadge(variant, t(status));
  };

  const renderTimeCell = (time?: string, format = 'HH:mm') => {
    if (!time) return '--';
    return (
      <div className="department-text text-text-base dark:text-text-title-dark">
        {dayjs(time).format(format)}
      </div>
    );
  };

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'fullName',
        label: t('Employee name'),
        headerClassName: 'dark:text-text-title-dark min-w-max',
        cellRender: (row) => (
          <div className="flex items-center gap-2 dark:text-text-title-dark">
            <button
              type="button"
              className="rounded-full"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <MyAvatar
                size="medium"
                imageUrl={
                  row?.employee?.photo
                    ? `${config.FILE_URL}api/storage/${row?.employee?.photo}`
                    : AvatarIcon
                }
              />
            </button>
            {row?.employee?.name}
          </div>
        ),
      },
      {
        key: 'arrivalStatus',
        label: t('Arrival status'),
        headerClassName: 'dark:text-text-title-dark min-w-max',
        cellRender: (row) =>
          renderStatusBadge(row?.arrivalStatus, { LATE: 'orange', ABSENT: 'red' }),
      },
      {
        key: 'arrivalTime',
        label: t('Arrival time'),
        headerClassName: 'dark:text-text-title-dark min-w-max',
        cellRender: (row) => renderTimeCell(row?.startTime, 'HH:mm'),
      },
      {
        key: 'goneStatus',
        label: t('Left status'),
        headerClassName: 'dark:text-text-title-dark min-w-max',
        cellRender: (row) => renderStatusBadge(row?.goneStatus, { EARLY: 'blue' }),
      },
      {
        key: 'goneTime',
        label: t('Gone time'),
        headerClassName: 'dark:text-text-title-dark min-w-max',
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
        headerClassName: 'dark:text-text-title-dark min-w-max',
        cellRender: (row) => {
          if (row?.arrivalStatus === 'ABSENT' || row?.arrivalStatus === 'PENDING') {
            return '--';
          }
          if (row?.startTime) {
            const plannedMinutes = Number(row?.plannedMinutes ?? 0);
            const effectiveEndTime = row?.endTime ?? dayjs().toISOString();
            const minutes = Math.max(
              0,
              dayjs(effectiveEndTime).diff(dayjs(row?.startTime), 'minute')
            );
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            const percent =
              plannedMinutes > 0
                ? Math.min(100, Math.round((minutes / plannedMinutes) * 100))
                : 0;

            const progressBarColor = getProgressBarColor(percent);

            return (
              <div className="flex flex-col gap-1">
                <div className="text-sm text-text-base dark:text-text-title-dark">
                  {t('work_time_format', { hours, minutes: mins })}
                </div>
                <div className='flex items-center gap-1'>
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${progressBarColor}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="text-xs text-text-muted">{percent}%</div>
                </div>
              </div>
            );
          }
          return '--';
        },
      },
      {
        key: 'arrivalDate',
        label: t('Arrival date'),
        headerClassName: 'dark:text-text-title-dark min-w-max',
        cellRender: (row) => <DateText className='dark:text-text-title-dark' value={row?.startTime} />,
      },
      {
        key: 'reason',
        label: t('Reason'),
        headerClassName: 'dark:text-text-title-dark min-w-max',
        cellRender: (row) => <ReasonModal row={row} refetch={refetch} />,
      },
    ],
    [t, refetch]
  );


  return {
    columns,
  };
};