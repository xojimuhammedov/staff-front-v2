import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridColumnType } from '@/components/Atoms/DataGrid/NewTable';
import dayjs from 'dayjs';
import config from '@/configs';

export const createColumnsScreenshots = () => {
  const { t } = useTranslation();

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'title',
        label: t('Title'),
        headerClassName: 'dark:text-text-title-dark min-w-max',
        cellRender: (row) => (
          <div className="flex items-center gap-2 dark:text-text-title-dark">
            {row?.title ?? '-'}
          </div>
        ),
      },
      {
        key: 'datetime',
        label: t('Datetime'),
        headerClassName: 'dark:text-text-title-dark min-w-max',
        cellRender: (row) =>
          dayjs(row?.datetime).format('DD/MM/YYYY HH:mm:ss'),
      },
      {
        key: 'processName',
        label: t('Process Name'),
        headerClassName: 'dark:text-text-title-dark min-w-max',
        cellRender: (row) => (
          <div className="dark:text-text-title-dark">
            {row?.processName || '-'}
          </div>
        ),
      },
    ],
    [t]
  );


  return {
    columns,
  };
};