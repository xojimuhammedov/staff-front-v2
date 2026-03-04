
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Monitor } from 'lucide-react';
import { MOCK_COMPUTER_TRACKING, MOCK_PAGINATION } from './mockComputerTracking';
import MyBadge from 'components/Atoms/MyBadge';
import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';

const BADGE_CLASSES = {
  red: 'border border-tag-red-icon [&_p]:text-tag-red-text dark:border-tag-red-icon dark:[&_p]:text-tag-red-text',
  green:
    'border border-tag-green-icon [&_p]:text-tag-green-text dark:border-tag-green-icon dark:[&_p]:text-tag-green-text',
} as const;

const ComputerTrackingList = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isView = location.pathname === '/view';
  const currentLang: any = i18n.resolvedLanguage;
  const columns: DataGridColumnType[] = useMemo(() => {
    const cols: DataGridColumnType[] = [
      {
        key: 'computer',
        label: t('Computer'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="flex items-center gap-3 dark:text-text-title-dark">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-gray-800/50">
              <Monitor className="h-5 w-5 text-blue-600 dark:text-gray-400" />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="font-medium text-xs">{row?.computerName ?? '--'}</p>
              {row?.location && (
                <p className="text-xs text-text-muted dark:text-text-muted">{row.location}</p>
              )}
            </div>
          </div>
        ),
      },
      {
        key: 'model',
        label: t('Model'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="text-text-base dark:text-text-title-dark">{row?.model ?? '--'}</div>
        ),
      },
      {
        key: 'status',
        label: t('Status'),
        headerClassName: 'w-1/3',
        cellRender: (row) => {
          const isOnline = row?.status === 'active';
          return (
            <MyBadge
              className={BADGE_CLASSES[isOnline ? 'green' : 'red']}
              variant={isOnline ? 'green' : 'red'}
            >
              {isOnline ? t('Online') : t('Offline')}
            </MyBadge>
          );
        },
      },
      {
        key: 'ipAddress',
        label: t('IP address'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="text-text-base dark:text-text-title-dark">{row?.ipAddress ?? '--'}</div>
        ),
      },
      {
        key: 'employee',
        label: t('Employees'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="text-sm dark:text-text-title-dark">
            <p className="text-sm">{row?.employee?.name ?? '--'}</p>
          </div>
        ),
      },
      {
        key: 'number',
        label: t('Number'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 font-mono text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {row?.inventoryNumber ?? '--'}
          </div>
        ),
      },
    ];

    return isView ? cols.filter((col) => !['status', 'employee'].includes(col.key)) : cols;
  }, [t, isView, currentLang]);


  return (
    <DynamicTable
      data={MOCK_COMPUTER_TRACKING}
      pagination={MOCK_PAGINATION}
      columns={columns}
      hasIndex={true}
    />
  );
};

export default ComputerTrackingList;
