import { useGetAllQuery } from '@/hooks/api';
import { URLS } from '@/constants/url';
import { KEYS } from '@/constants/key';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';
import { MySelect } from '@/components/Atoms/Form';
import { get } from 'lodash';
import MyAvatar from '@/components/Atoms/MyAvatar';
import config from '@/configs';
import AvatarIcon from '../../../assets/icons/avatar.jpg';
import Loading from '@/assets/icons/Loading';

// Helper to format time in seconds to readable format
const formatTime = (seconds: number | undefined | null) => {
  if (seconds == null) return '--';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const hh = h > 0 ? `${h}h ` : '';
  const mm = m > 0 ? `${m}m ` : '';
  const ss = `${s}s`;

  return `${hh}${mm}${ss}`;
};

function getTimePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

const EmployeeProductivityRanking = ({ paramsValue, limit = 10 }: { paramsValue: any, limit?: number }) => {
  const { t } = useTranslation();
  const [type, setType] = useState<string>('TOP_PRODUCTIVE');

  const { data, isLoading } = useGetAllQuery<any>({
    key: KEYS.dashboardEmployeeProductivityRanking,
    url: URLS.dashboardEmployeeProductivityRanking,
    params: {
      ...paramsValue,
      limit,
      ...(type ? { type } : {})
    },
  });

  const columns: DataGridColumnType[] = useMemo(() => [
    {
      key: 'employeeName',
      label: t('Employee Name'),
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => (
         <div className="flex items-center gap-3">
          <MyAvatar
            shape="circle" 
            size="medium" 
            imageUrl={row?.employeePhoto ? `${config.FILE_URL}api/storage/${row?.employeePhoto}` : AvatarIcon} 
          >
            {row?.employeeName?.charAt(0) ?? '?'}
          </MyAvatar>
          <div className="flex flex-col">
            <p className="font-medium text-text-base dark:text-text-title-dark text-sm">{row?.employeeName ?? '--'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{row?.department ?? '--'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'usefulTime',
      label: t('Useful Time'),
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => (
        <div className="text-sm dark:text-[rgb(74,222,128)] text-tag-green-text">
          {formatTime(row?.usefulTime)}
        </div>
      ),
    },
    {
      key: 'unusefulTime',
      label: t('Unuseful Time'),
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => (
        <div className="text-sm dark:text-[rgb(248,113,113)] text-tag-red-text">
          {formatTime(row?.unusefulTime)}
        </div>
      ),
    },
    {
      key: 'otherTime',
      label: t('Other Time'),
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => (
        <div className="text-sm dark:text-gray-400 text-gray-500">
          {formatTime(row?.otherTime)}
        </div>
      ),
    },
    {
      key: 'productivityScore',
      label: t('Productivity Score'),
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => {
        const totalTime =
          (row?.usefulTime || 0) + (row?.unusefulTime || 0) + (row?.otherTime || 0);
        const usefulPercent = getTimePercentage(
          row?.usefulTime || 0,
          totalTime
        );
        const unusefulPercent = getTimePercentage(
          row?.unusefulTime || 0,
          totalTime
        );
        const otherPercent = getTimePercentage(row?.otherTime || 0, totalTime);
        return (
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden flex">
              <div
                className="h-full bg-tag-green-text dark:bg-[rgb(74,222,128)]"
                style={{ width: `${usefulPercent}%` }}
              />
              <div
                className="h-full bg-tag-red-text dark:bg-[rgb(248,113,113)]"
                style={{ width: `${unusefulPercent}%` }}
              />
              <div
                className="h-full bg-gray-500 dark:bg-gray-400"
                style={{ width: `${otherPercent}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-primary w-8 text-right">
              {row?.productivityScore ?? 0}%
            </span>
          </div>
        )
      },
    },
  ], [t]);

  // Handle case where data is directly an array vs paginated response
  const tableData = Array.isArray(data) ? data : get(data, 'data', []);

  const filterOptions = [
    { label: t('Top Productive'), value: 'TOP_PRODUCTIVE' },
    { label: t('Least Productive'), value: 'LEAST_PRODUCTIVE' },
  ];

  return (
    <div className="bg-bg-base dark:bg-dark-dashboard-cards rounded-m p-4 mt-8 shadow-base flex-1 min-w-0 overflow-x-auto min-h-[430px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-text-title-dark text-text-base">{t('Employee Productivity Ranking')}</h2>
        <div className="w-[180px]">
          <MySelect
            options={filterOptions}
            value={type}
            onChange={(selected: any) => setType(selected?.value || '')}
            allowedRoles={undefined as any}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="flex w-full items-center justify-center min-h-[300px]">
          <Loading />
        </div>
      ) : (
        <DynamicTable
          data={tableData}
          columns={columns}
          hasIndex={true}
          hasPagination={false}
        />
      )}
    </div>
  );
};

export default EmployeeProductivityRanking;
