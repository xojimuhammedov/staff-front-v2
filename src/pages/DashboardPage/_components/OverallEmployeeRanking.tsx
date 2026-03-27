import { useGetAllQuery } from '@/hooks/api';
import { URLS } from '@/constants/url';
import { KEYS } from '@/constants/key';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';
import { MySelect } from '@/components/Atoms/Form';
import { get } from 'lodash';
import MyAvatar from '@/components/Atoms/MyAvatar/MyAvatar';
import config from '@/configs';
import AvatarIcon from '../../../assets/icons/avatar.jpg';
import Loading from '@/assets/icons/Loading';

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

const OverallEmployeeRanking = ({ paramsValue, limit = 5 }: { paramsValue: any, limit?: number }) => {
  const { t } = useTranslation();
  const [type, setType] = useState<string>('');

  const { data, isLoading } = useGetAllQuery<any>({
    key: KEYS.dashboardOverallEmployeeRanking,
    url: URLS.dashboardOverallEmployeeRanking,
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
      key: 'efficiencyScore',
      label: t('Efficiency Score'),
      headerClassName: 'dark:text-text-title-dark min-w-max text-center',
      cellClassName: 'text-center',
      cellRender: (row) => (
        <div className={`text-sm font-semibold ${getScoreColor(row?.efficiencyScore ?? 0)}`}>
          {row?.efficiencyScore ?? 0}%
        </div>
      ),
    },
    {
      key: 'productivityScore',
      label: t('Productivity Score'),
      headerClassName: 'dark:text-text-title-dark min-w-max text-center',
      cellClassName: 'text-center',
      cellRender: (row) => (
        <div className={`text-sm font-semibold ${getScoreColor(row?.productivityScore ?? 0)}`}>
          {row?.productivityScore ?? 0}%
        </div>
      ),
    },
    {
      key: 'overallScore',
      label: t('Overall Score'),
      headerClassName: 'dark:text-text-title-dark min-w-max text-center',
      cellClassName: 'text-center',
      cellRender: (row) => (
        <div className={`text-sm font-bold ${getScoreColor(row?.overallScore ?? 0)}`}>
          {row?.overallScore ?? 0}%
        </div>
      ),
    },
  ], [t]);

  const tableData = Array.isArray(data) ? data : get(data, 'data', []);

  const filterOptions = [
    { label: t('All'), value: '' },
    { label: t('Top'), value: 'TOP' },
    { label: t('Least'), value: 'LEAST' },
  ];

  return (
    <div className="bg-bg-base dark:bg-dark-dashboard-cards rounded-m p-4 mt-8 shadow-base flex-1 min-w-0 overflow-x-auto min-h-[430px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-text-title-dark text-text-base">{t('Overall Employee Ranking')}</h2>
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

export default OverallEmployeeRanking;
