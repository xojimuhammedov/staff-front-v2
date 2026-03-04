import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useDeleteQuery, usePostQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { IAction } from 'interfaces/action.interface';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { ArrowLeftRight, Edit, ExternalLink, Eye, LogIn, LogOut, Trash2 } from 'lucide-react';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';


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
        headerClassName: 'dark:text-text-title-dark',
        cellRender: (row) => <div className='dark:text-text-title-dark'>{row.name}</div>,
      },
      {
        key: 'deviceType',
        label: t('IP address / Model'),
        headerClassName: 'dark:text-text-title-dark',
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
        headerClassName: 'dark:text-text-title-dark',
        cellRender: (row) => <div className='dark:text-text-title-dark'>{row.gate?.name}</div>,
      },
      {
        key: 'entryType',
        label: t('Entry type'),
        headerClassName: 'dark:text-text-title-dark',
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
    ],
    [t]
  );

  const rowActions: IAction[] = useMemo(
    () => [
      {
        icon: <Eye size={DEFAULT_ICON_SIZE} />,
        type: 'secondary',
        name: t('View device'),
        action: (row) => {
          navigate(`/settings/device/${row.id}`);
        },
      },
      {
        icon: <Edit size={DEFAULT_ICON_SIZE} />,
        type: 'danger',
        name: t('Edit'),
        action: (row) => {
          navigate(`/device/edit/${row?.id}`);
        },
      },
      {
        icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
        type: 'danger',
        name: t('Delete'),
        action: (row) => {
          setDeviceId(row?.id);
          setShow(true);
        },
      },
      {
        icon: <ExternalLink size={DEFAULT_ICON_SIZE} />,
        type: 'danger',
        name: t('Open door'),
        action: (row) => {
          employeeForDoor(row?.id);
        },
      },
    ],
    [t]
  );

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  }
  return (
    <>
      <DynamicTable
        data={get(data, 'data', [])}
        pagination={data}
        columns={columns}
        rowActions={rowActions}
        hasIndex={true}
        onRowClick={(row) => navigate(`/device/edit/${row?.id}`)}
      />

      <ConfirmationModal
        title={t('Are you sure you want to delete this device?')}
        subTitle={t(
          'This action cannot be undone. The device will be deleted and all linked devices will be removed.'
        )}
        open={show}
        setOpen={setShow}
        confirmationDelete={deleteItem}
      />
    </>
  );
};

export default DeviceList;
