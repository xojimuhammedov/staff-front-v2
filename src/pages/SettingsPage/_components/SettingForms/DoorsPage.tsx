import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { useTranslation } from 'react-i18next';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useMemo, useState } from 'react';
import TableProvider from 'providers/TableProvider/TableProvider';
import DataGrid from 'components/Atoms/DataGrid';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { useDeleteQuery, useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import { IAction } from 'interfaces/action.interface';
import { Edit3, Plus, Trash2, Eye } from 'lucide-react';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import storage from 'services/storage';

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

const DoorsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const page: any = paramsStrToObj(location.search);

  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.getDoorForDevices,
    url: URLS.getDoorForDevices,
    params: {
      pagination: {
        pageSize: Number(page?.pageSize) || 10,
        page: Number(page?.page) || 1
      },
    }
  });

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'name',
        label: t('Door name'),
        headerClassName: 'sm:w-1/4 lg:flex-1',
        cellRender: (row) => <div className="dark:text-text-title-dark">{row?.name ?? '--'}</div>
      },
      {
        key: 'countDevices',
        label: t('Devices')
      },
      {
        key: 'countOfAllowedEmps',
        label: t('Allowed employees')
      }
    ],
    [t]
  );

  const dataColumn = [
    {
      id: 1,
      label: t('Door name'),
      headerClassName: 'sm:w-1/4 lg:flex-1'
    },
    {
      id: 2,
      label: t('Devices')
    },
    {
      id: 3,
      label: t('Allowed employees')
    }
  ];

  const rowActions: IAction[] = useMemo(
    () => [
      {
        icon: <Eye size={DEFAULT_ICON_SIZE} />,
        type: 'primary',
        name: t('View door'),
        action: (row, $e) => {
          navigate(`/settings/maingate/${row.id}`);
        }
      },
      {
        icon: <Edit3 size={DEFAULT_ICON_SIZE} />,
        type: 'primary',
        name: t('Edit'),
        action: (row, $e) => {
          navigate(`/settings/door/edit/${row?.id}`);
        }
      },
      {
        icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
        type: 'danger',
        name: t('Delete'),
        action: (row, $e) => {
        }
      }
    ],
    [t]
  );
  return (
    <div>
      <div className={'flex justify-between'}>
        <LabelledCaption
          title={t('Doors')}
          subtitle={t('System notifications for selected employees')}
        />
      </div>

      <MyDivider />
      <TableProvider<TItem, FilterType>
        values={{
          columns,
          filter: { search: '' },
          rows: get(data, 'data.data.doorList', []),
          keyExtractor: 'id'
        }}>
        <DataGrid
          hasCustomizeColumns={false}
          hasExport={false}
          hasCheckbox={false}
          dataColumn={dataColumn}
          isLoading={isLoading}
          pagination={get(data, 'data.data.pagination', {})}
          rowActions={rowActions}
          hasButton={
            <>
              <MyButton
                onClick={() => navigate('/settings/door/create')}
                startIcon={<Plus />}
                variant="primary"
                className="[&_svg]:stroke-bg-white w-[210px]">
                {t('Add new door')}
              </MyButton>
            </>
          }
        />
      </TableProvider>
    </div>
  );
};

export default DoorsPage;
