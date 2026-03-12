
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Monitor } from 'lucide-react';
import MyBadge from 'components/Atoms/MyBadge';
import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';
import { useGetAllQuery } from '@/hooks/api';
import { KEYS } from '@/constants/key';
import { URLS } from '@/constants/url';
import { searchValue } from '@/types/search';
import { get } from 'lodash';

const BADGE_CLASSES = {
  red: 'border border-tag-red-icon [&_p]:text-tag-red-text dark:border-tag-red-icon dark:[&_p]:text-tag-red-text',
  green:
    'border border-tag-green-icon [&_p]:text-tag-green-text dark:border-tag-green-icon dark:[&_p]:text-tag-green-text',
} as const;

const ComputerTrackingList = ({ searchValue }: { searchValue: searchValue }) => {
  const { t, i18n } = useTranslation();
  const currentLang: any = i18n.resolvedLanguage;

  const { data } = useGetAllQuery<any>({
    key: KEYS.getComputerList,
    url: URLS.getComputerList,
    params: {
      page: searchValue?.page,
      limit: searchValue?.limit,
      search: searchValue?.search,
    }
  })

  const columns: DataGridColumnType[] = useMemo(() => [
    {
      key: 'computer',
      label: t('Computer'),
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => (
        <div className="flex items-center gap-3 dark:text-text-title-dark">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-gray-800/50">
            <Monitor className="h-5 w-5 text-blue-600 dark:text-gray-400" />
          </div>
          <div className="flex flex-col">
            <p className="font-medium text-xs">{row?.os ?? '--'}</p>
            {row?.version && (
              <p className="text-xs text-text-muted dark:text-text-muted">{row.version}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'pcName',
      label: t('Pc name'),
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => (
        <div className="text-text-base dark:text-text-title-dark">{row?.pcName ?? '--'}</div>
      ),
    },
    {
      key: 'ipAddress',
      label: t('IP address'),
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => (
        <div className="text-text-base dark:text-text-title-dark">{row?.ipAddress ?? '--'}</div>
      ),
    },
    {
      key: 'hostname',
      label: t('Hostname'),
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => (
        <div className="text-sm dark:text-text-title-dark">
          <p className="text-sm">{row?.hostname ?? '--'}</p>
        </div>
      ),
    },
    {
      key: 'isActive',
      label: t('Status'),
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => {
        const isActive = row?.isActive;
        return (
          <MyBadge
            className={BADGE_CLASSES[isActive ? 'green' : 'red']}
            variant={isActive ? 'green' : 'red'}
          >
            {isActive ? t('Active') : t('Inactive')}
          </MyBadge>
        );
      },
    },
    {
      key: 'isOnline',
      label: t('Online'),
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => {
        const isOnline = row?.isOnline;
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
      key: 'isUninstall',
      label: t('Uninstall'),
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => {
        const isUninstall = row?.isUninstall;
        return (
          <MyBadge
            className={BADGE_CLASSES[isUninstall ? 'green' : 'red']}
            variant={isUninstall ? 'green' : 'red'}
          >
            {isUninstall ? t('Uninstall') : t('Install')}
          </MyBadge>
        );
      },
    },
    // {
    //   key: '_count',
    //   label: t('Count for computer users'),
    //   headerClassName: 'dark:text-text-title-dark min-w-max',
    //   cellRender: (row) => (
    //     <div className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 font-mono text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
    //       {row?._count?.computerUsers ?? '--'}
    //     </div>
    //   ),
    // },
  ], [t, currentLang]);


  return (
    <DynamicTable
      data={get(data, 'data')}
      pagination={data}
      columns={columns}
      hasIndex={true}
    />
  );
};

export default ComputerTrackingList;
