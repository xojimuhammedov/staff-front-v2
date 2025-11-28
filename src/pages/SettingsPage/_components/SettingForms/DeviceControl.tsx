import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { useTranslation } from 'react-i18next';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useMemo } from 'react';
import TableProvider from 'providers/TableProvider/TableProvider';
import DataGrid from 'components/Atoms/DataGrid';
import { useDeleteQuery, useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import MyBadge from 'components/Atoms/MyBadge';
import Loading from 'assets/icons/Loading';
import { IAction } from 'interfaces/action.interface';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { Trash2 } from 'lucide-react';

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

const DeviceControl = () => {
  const { t } = useTranslation();

  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.getDoorForDevices,
    url: URLS.getDoorForDevices,
    params: {}
  });

  const { mutate: deleteRequest } = useDeleteQuery({
    listKeyId: KEYS.getDoorForDevices
  });

  const deleteItem = (id: number) => {
    deleteRequest(
      {
        url: `${URLS.getDoorForDevices}/${id}`
      },
      {
        onSuccess: () => {
          refetch();
        }
      }
    );
  };

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'name',
        label: t('Device name'),
        headerClassName: 'sm:w-1/4 lg:flex-1'
      },
      {
        key: 'type',
        label: t('Device type'),
        headerClassName: 'sm:w-1/4 lg:flex-1'
      },
      {
        key: 'isActive',
        label: t('Status'),
        headerClassName: 'sm:w-1/4 lg:flex-1',
        cellRender: (row) => (
          <>
            <MyBadge variant={row.isActive ? 'green' : 'neutral'}>
              {row.isActive ? t("Success") : t("Badge")}
            </MyBadge>
          </>
        )
      },
      {
        key: 'ipAddress',
        label: t('Ip address'),
        headerClassName: 'sm:w-1/4 lg:flex-1'
      },
    ],
    [t]
  );

  const dataColumn = [
    {
      id: 1,
      label: t('Device name'),
      headerClassName: 'sm:w-1/4 lg:flex-1'
    },
    {
      id: 2,
      label: t('Device type'),
      headerClassName: 'sm:w-1/4 lg:flex-1'
    },
    {
      id: 3,
      label: t('Status'),
      headerClassName: 'sm:w-1/4 lg:flex-1'
    },
    {
      id: 4,
      label: t('Ip address'),
      headerClassName: 'sm:w-1/4 lg:flex-1'
    },
  ];

  const rowActions: IAction[] = useMemo(
    () => [
      {
        icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
        type: 'danger',
        name: t('Delete'),
        action: (row) => {
          deleteItem(row?.id)
        }
      }
    ],
    [t]
  );

  if (isLoading) {
    return (
      <div className="absolute flex h-full w-[calc(100%-350px)] items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <div className={'flex justify-between'}>
        <LabelledCaption
          title={t('Device control')}
          subtitle={t('System notifications for selected employees')}
        />
      </div>

      <MyDivider />
      <TableProvider<TItem, FilterType>
        values={{
          columns,
          filter: { search: '' },
          rows: get(data, 'data', []),
          keyExtractor: 'id'
        }}>
        <DataGrid
          hasCustomizeColumns={false}
          hasExport={false}
          hasSearch={false}
          rowActions={rowActions}
          dataColumn={dataColumn}
          hasCheckbox={false}
          isLoading={isLoading}
        />
      </TableProvider>
    </div>
  );
};

export default DeviceControl;
