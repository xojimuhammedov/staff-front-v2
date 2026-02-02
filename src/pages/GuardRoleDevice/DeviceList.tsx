import { useTranslation } from 'react-i18next';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useMemo, useState } from 'react';
import TableProvider from 'providers/TableProvider/TableProvider';
import DataGrid from 'components/Atoms/DataGrid';
import { useDeleteQuery, usePostQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import MyBadge from 'components/Atoms/MyBadge';
import Loading from 'assets/icons/Loading';
import { ArrowLeftRight, ExternalLink, LogIn, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

type FilterType = {
  search: string;
};

type TItem = {
  employeeName: string;
  status: string;
  timeline: string;
  action: string;
  id: string;
};

const DeviceList = ({ data, isLoading, refetch }: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deviceId, setDeviceId] = useState('');
  const [show, setShow] = useState(false);

  const { mutate: deleteRequest } = useDeleteQuery({
    listKeyId: KEYS.getDoorForDevices,
  });

  const deleteItem = () => {
    if (!deviceId) return;
    deleteRequest(
      {
        url: `${URLS.getDoorForDevices}/${deviceId}`,
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const { mutate } = usePostQuery({
    listKeyId: KEYS.deviceForDoor,
  });

  const employeeForDoor = (id: number) => {
    mutate(
      {
        url: `${URLS.deviceForDoor}/${id}`,
        attributes: {},
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'name',
        label: t('Device name'),
        headerClassName: 'sm:w-1/4 lg:flex-1',
      },
      {
        key: 'deviceType',
        label: t('IP address / Model'),
        headerClassName: 'sm:w-1/4 lg:flex-1',
        cellRender: (row) => (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              {row.ipAddress || '--'}
            </span>
            <span className="text-xs text-text-muted dark:text-subtext-color-dark">
              {row.model || '--'}
            </span>
          </div>
        ),
      },
      {
        key: 'gateName',
        label: t('Gate'),
        headerClassName: 'sm:w-1/4 lg:flex-1',
        cellRender: (row) => <>{row.gate?.name}</>,
      },
      {
        key: 'entryType',
        label: t('Entry type'),
        headerClassName: 'sm:w-1/4 lg:flex-1',
        cellRender: (row) => {
          const entryType = row.entryType as 'ENTER' | 'EXIT' | 'BOTH' | undefined;
          const config = {
            ENTER: {
              label: t('Check in'),
              Icon: LogIn,
              classes:
                'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
            },
            EXIT: {
              label: t('Check out'),
              Icon: LogOut,
              classes:
                'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
            },
            BOTH: {
              label: `${t('Check in')} / ${t('Check out')}`,
              Icon: ArrowLeftRight,
              classes:
                'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
            },
          } as const;

          const cfg = config[entryType ?? 'ENTER'] ?? {
            label: entryType ?? '--',
            Icon: ArrowLeftRight,
            classes:
              'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800',
          };
          const Icon = cfg.Icon;

          return (
            <div
              className={twMerge(
                'inline-flex items-center gap-2 rounded-lg border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
                cfg.classes
              )}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/70 dark:bg-white/10">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="whitespace-nowrap">{cfg.label}</span>
            </div>
          );
        },
      },
      {
        key: 'actions',
        label: t('Actions'),
        headerClassName: 'sm:w-1/4 lg:flex-1',
        cellRender: (row) => (
          <button
            type="button"
            onClick={() => employeeForDoor(row?.id)}
            className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t('Open door')}
          </button>
        ),
      },
    ],
    [t]
  );

  const dataColumn = [
    {
      id: 1,
      label: t('Device name'),
      headerClassName: 'sm:w-1/4 lg:flex-1',
    },
    {
      id: 2,
      label: t('IP address / Model'),
      headerClassName: 'sm:w-1/4 lg:flex-1',
    },
    {
      id: 3,
      label: t('Gate'),
      headerClassName: 'sm:w-1/4 lg:flex-1',
    },
    {
      id: 4,
      label: t('Entry type'),
      headerClassName: 'sm:w-1/4 lg:flex-1',
    },
    {
      id: 5,
      label: t('Actions'),
      headerClassName: 'sm:w-1/4 lg:flex-1',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  }
  return (
    <>
      <TableProvider<TItem, FilterType>
        values={{
          columns,
          filter: { search: '' },
          rows: get(data, 'data', []),
          keyExtractor: 'id',
        }}
      >
        <DataGrid
          hasCustomizeColumns={false}
          hasExport={false}
          hasSearch={false}
          dataColumn={dataColumn}
          hasCheckbox={false}
          isLoading={isLoading}
        />
      </TableProvider>
    </>
  );
};

export default DeviceList;
