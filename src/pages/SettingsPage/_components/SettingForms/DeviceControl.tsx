import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { useTranslation } from 'react-i18next';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useMemo } from 'react';
import TableProvider from 'providers/TableProvider/TableProvider';
import DataGrid from 'components/Atoms/DataGrid';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import MyBadge from 'components/Atoms/MyBadge';

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

const Notifications = () => {
  const { t } = useTranslation();

  const { data, isLoading } = useGetAllQuery({
    key: KEYS.getDoorForDevices,
    url: URLS.getDoorForDevices,
    params: {
      populate: '*'
    }
  });

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'door.name',
        label: t('Door name'),
        headerClassName: 'w-44'
      },
      {
        key: 'isActive',
        label: t('Status'),
        headerClassName: 'w-44',
        cellRender: (row) => (
          <>
            <MyBadge variant={row.isActive ? 'green' : 'neutral'}>
              {row.isActive ? t("Success") : t("Badge")}
            </MyBadge>
          </>
        )
      },
      {
        key: 'ip',
        label: t('Ip address'),
        headerClassName: 'flex-1'
      },
    ],
    [t]
  );

  const dataColumn = [
    {
      id: 1,
      label: t('Door name'),
      headerClassName: 'w-44'
    },
    {
      id: 2,
      label: t('Status'),
      headerClassName: 'w-44'
    },
    {
      id: 3,
      label: t('Ip address'),
      headerClassName: 'flex-1'
    },
  ];

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
          rows: get(data, 'data.data', []),
          keyExtractor: 'id'
        }}>
        <DataGrid
          hasCustomizeColumns={false}
          hasExport={false}
          hasSearch={false}
          dataColumn={dataColumn}
          hasCheckbox={false}
          isLoading={isLoading}
          pagination={get(data, 'data.meta.pagination', {})}
        />
      </TableProvider>
    </div>
  );
};

export default Notifications;
