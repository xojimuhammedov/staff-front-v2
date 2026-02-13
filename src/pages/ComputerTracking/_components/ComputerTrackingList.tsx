import TableProvider from 'providers/TableProvider/TableProvider';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from 'components/Atoms/DataGrid';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useLocation } from 'react-router-dom';
import { Monitor } from 'lucide-react';
import { searchValue } from 'types/search';
import { IFilter } from 'interfaces/filter.interface';
import { MOCK_COMPUTER_TRACKING, MOCK_PAGINATION } from './mockComputerTracking';
import type { IComputerTrackingItem } from './mockComputerTracking';
import MyBadge from 'components/Atoms/MyBadge';

type ComputerTrackingListProps = {
  searchValue?: searchValue;
};

const BADGE_CLASSES = {
  red: 'border border-tag-red-icon [&_p]:text-tag-red-text dark:border-tag-red-icon dark:[&_p]:text-tag-red-text',
  green:
    'border border-tag-green-icon [&_p]:text-tag-green-text dark:border-tag-green-icon dark:[&_p]:text-tag-green-text',
} as const;

const ComputerTrackingList = ({ searchValue }: ComputerTrackingListProps) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isView = location.pathname === '/view';
  const currentLang: any = i18n.resolvedLanguage;
  const isLoading = false;
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
          <div className="text-text-base dark:text-text-title-dark">
            {row?.inventoryNumber ?? '--'}
          </div>
        ),
      },
    ];

    return isView ? cols.filter((col) => !['status', 'employee'].includes(col.key)) : cols;
  }, [t, isView, currentLang]);

  const dataColumn = useMemo(() => {
    const base = [
      { id: 1, label: t('Computer'), headerClassName: 'w-1/3' },
      { id: 2, label: t('Model'), headerClassName: 'w-1/3' },
      { id: 3, label: t('Status'), headerClassName: 'w-1/3' },
      { id: 4, label: t('IP address'), headerClassName: 'w-1/3' },
      { id: 5, label: t('Employees'), headerClassName: 'w-1/3' },
      { id: 6, label: t('Number'), headerClassName: 'w-1/3' },
    ];

    return isView ? base.filter((c) => ![3, 5].includes(c.id)) : base;
  }, [t, isView]);

  const filter: IFilter[] = useMemo(() => [], [t]);

  return (
    <TableProvider<IComputerTrackingItem, IFilter[]>
      values={{
        columns,
        filter,
        rows: MOCK_COMPUTER_TRACKING,
        keyExtractor: 'id',
      }}
    >
      <DataGrid
        isLoading={isLoading}
        hasOrderColumn={false}
        hasCustomizeColumns={true}
        dataColumn={dataColumn}
        pagination={MOCK_PAGINATION}
      />
    </TableProvider>
  );
};

export default ComputerTrackingList;
