import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Monitor, Wifi, WifiOff, Users, Calendar, UserCheck, UserX } from 'lucide-react';
import MyModal from '@/components/Atoms/MyModal/MyModal';
import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';
import { useGetAllQuery } from '@/hooks/api';
import { useNavigate } from 'react-router-dom';
import { KEYS } from '@/constants/key';
import { URLS } from '@/constants/url';
import { searchValue } from '@/types/search';
import { get } from 'lodash';
import dayjs from 'dayjs';


const ComputerTrackingList = ({ searchValue }: { searchValue: searchValue }) => {
  const { t, i18n } = useTranslation();
  const currentLang: any = i18n.resolvedLanguage;

  const navigate = useNavigate();
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [selectedComputer, setSelectedComputer] = useState<any>(null);

  const { data } = useGetAllQuery<any>({
    key: KEYS.getComputerList,
    url: URLS.getComputerList,
    params: {
      page: searchValue?.page,
      limit: searchValue?.limit,
      search: searchValue?.search,
      startDate: searchValue?.startDate,
      endDate: searchValue?.endDate,
    }
  });

  const { data: usersData, isLoading: isUsersLoading } = useGetAllQuery<any>({
    key: KEYS.getComputerUserList + '_dialog',
    url: URLS.getComputerUserList,
    params: {
        page: 1,
        limit: 100, // retrieve all for dialog
        computerId: selectedComputer?.id,
    },
    enabled: !!selectedComputer?.id && showUserDialog,
  });

  const selectedUsers = usersData?.data || [];

  const columns: DataGridColumnType[] = useMemo(() => [
    {
      key: 'computer',
      label: t('Computer'),
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => (
        <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
          <Monitor className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          {row?.pcName ?? '--'}
        </div>
      ),
    },
    {
      key: 'ipAddress',
      label: t('IP address'),
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => (
        <div className="text-gray-500 dark:text-gray-400 font-mono text-sm">{row?.ipAddress ?? '--'}</div>
      ),
    },
    {
      key: 'status',
      label: t('Status'),
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => {
        if (row?.isOnline) {
          return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50">
              <Wifi className="h-3 w-3" /> Online
            </div>
          );
        } else if (row?.isActive) {
          return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50">
              <WifiOff className="h-3 w-3" /> {t('Offline')}
            </div>
          );
        } else {
          return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50">
              {t('Inactive')}
            </div>
          );
        }
      },
    },
    {
      key: 'os',
      label: 'OS',
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => (
        <div className="text-gray-500 dark:text-gray-400 text-sm max-w-[200px] truncate" title={row?.os}>
          {row?.os ? row.os.replace("Microsoft ", "") : '--'}
        </div>
      ),
    },
    {
      key: '_count',
      label: t('Users'),
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-sm">
            <Users className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-900 dark:text-white font-medium">{row?._count?.computerUsers || 0}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: t('So\'nggi yangilanish'),
      headerClassName: 'dark:text-text-title-dark min-w-max',
      cellRender: (row) => (
        <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {row?.updatedAt ? dayjs(row.updatedAt).format('DD.MM.YYYY HH:mm') : '--'}
        </div>
      ),
    },
  ], [t, currentLang]);

  return (
    <>
      <DynamicTable
        data={get(data, 'data')}
        pagination={data}
        columns={columns}
        hasIndex={true}
        onRowClick={(row) => {
          if ((row?._count?.computerUsers || 0) > 1) {
            setSelectedComputer(row);
            setShowUserDialog(true);
          } else {
            navigate(`/monitoring/computerTracking/${row.id}`, { state: { computer: row } });
          }
        }}
      />

      <MyModal
        modalProps={{
          show: showUserDialog,
          onClose: () => {
            setShowUserDialog(false);
            setSelectedComputer(null);
          },
          size: 'lg',
          position: 'center',
        }}
        headerProps={{
          children: (
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('Select user')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedComputer?.pcName}</span> {t('on computer')} {selectedUsers.length} {t("users exist. Which user's data do you want to see?")}
              </p>
            </div>
          )
        }}
      >
        <div className="grid gap-2 py-4 max-h-[60vh] overflow-y-auto px-1">
          {isUsersLoading ? (
            <div className="py-8 text-center text-gray-400">{t('Loading...')}</div>
          ) : selectedUsers.map((user: any) => (
            <div
              key={user.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              onClick={() => {
                  setShowUserDialog(false);
                  navigate(`/monitoring/computerTracking/${selectedComputer?.id}`, { state: { computer: selectedComputer, selectedUserId: user.id } });
              }}
            >
              <div className="flex items-center gap-3">
                {/* Avatar with online status */}
                <div className="relative flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {String(user.name || user.username || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span 
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
                  />
                </div>
                
                {/* User info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{user.name || user.username}</p>
                    {user.isOnline && (
                      <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Online</div>
                    )}
                    {user.isAdmin && (
                      <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Admin</div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username || 'noma\'lum'}</p>
                </div>
                
                {/* Employee status indicator */}
                <div className="flex-shrink-0" title={user.employee ? t('Assigned to employee') : t('Not assigned to employee')}>
                  {user.employee ? (
                    <UserCheck className="h-5 w-5 text-green-500" />
                  ) : (
                    <UserX className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </MyModal>
    </>
  );
};

export default ComputerTrackingList;
