import TableProvider from 'providers/TableProvider/TableProvider';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from 'components/Atoms/DataGrid';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { IFilter } from 'interfaces/filter.interface';

const TableList = () => {
  const { t } = useTranslation();

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'id',
        label: t('ID'),
        headerClassName: 'w-1/4',
        cellRender: (row) => (
          <div className="text-text-base dark:text-text-title-dark">
            {row?.id ?? '--'}
          </div>
        ),
      },
      {
        key: 'name',
        label: t('Name'),
        headerClassName: 'w-1/4',
        cellRender: (row) => (
          <div className="text-text-base dark:text-text-title-dark">
            {row?.name ?? '--'}
          </div>
        ),
      },
      {
        key: 'description',
        label: t('Description'),
        headerClassName: 'w-1/4',
        cellRender: (row) => (
          <div className="text-text-base dark:text-text-title-dark">
            {row?.description ?? '--'}
          </div>
        ),
      },
      {
        key: 'status',
        label: t('Status'),
        headerClassName: 'w-1/4',
        cellRender: (row) => (
          <div className="text-text-base dark:text-text-title-dark">
            {row?.status ?? '--'}
          </div>
        ),
      },
    ],
    [t]
  );

  const dataColumn = [
    {
      id: 1,
      label: t('ID'),
      headerClassName: 'w-1/4',
    },
    {
      id: 2,
      label: t('Name'),
      headerClassName: 'w-1/4',
    },
    {
      id: 3,
      label: t('Description'),
      headerClassName: 'w-1/4',
    },
    {
      id: 4,
      label: t('Status'),
      headerClassName: 'w-1/4',
    },
  ];

  const filter: IFilter[] = useMemo(() => [], [t]);

  return (
    <TableProvider<any, IFilter[]>
      values={{
        columns,
        filter,
        rows: [],
        keyExtractor: 'id',
      }}
    >
      <DataGrid
        isLoading={false}
        hasCustomizeColumns={true}
        dataColumn={dataColumn}
      />
    </TableProvider>
  );
};

export default TableList;
