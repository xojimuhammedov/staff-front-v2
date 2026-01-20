import TableProvider from 'providers/TableProvider/TableProvider';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from 'components/Atoms/DataGrid';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { AreaChart } from 'lucide-react';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import { IFilter } from 'interfaces/filter.interface';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { IAction } from 'interfaces/action.interface';
import { useNavigate } from 'react-router-dom';

const VisitorActions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.getVisitorList,
    url: URLS.getVisitorList,
    params: {},
  });

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'firstName',
        label: t('Full Name'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="flex items-center gap-4 text-text-base dark:text-text-title-dark">
            {row?.firstName ?? '--'} {row?.lastName ?? '--'}
          </div>
        ),
      },
      {
        key: 'creator',
        label: t('Creator'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="text-text-base dark:text-text-title-dark">
            {row?.creator?.name || row?.creator?.username || '--'}
          </div>
        ),
      },
      {
        key: 'createdAt',
        label: t('Created Time'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="text-text-base dark:text-text-title-dark">
            {row?.createdAt ? new Date(row?.createdAt).toLocaleString() : '--'}
          </div>
        ),
      },
      {
        key: 'visiting',
        label: t('Visiting'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="text-text-base dark:text-text-title-dark">
            {row?.attached?.name ?? '--'}
          </div>
        ),
      },
      {
        key: 'workPlace',
        label: t('Work Place'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="text-text-base dark:text-text-title-dark">
            {row?.workPlace ?? '--'}
          </div>
        ),
      },
    ],
    [t]
  );

  const dataColumn = [
    {
      id: 1,
      label: t('Full Name'),
      headerClassName: 'w-1/3',
    },
    {
      id: 2,
      label: t('Creator'),
      headerClassName: 'w-1/3',
    },
    {
      id: 3,
      label: t('Created Time'),
      headerClassName: 'w-1/3',
    },
    {
      id: 4,
      label: t('Visiting'),
      headerClassName: 'w-1/3',
    },
    {
      id: 5,
      label: t('Work Place'),
      headerClassName: 'w-1/3',
    },
  ];

  const filter: IFilter[] = useMemo(() => [], [t]);

  // const rowActions: IAction[] = useMemo(
  //   () => [
  //     {
  //       icon: <AreaChart size={DEFAULT_ICON_SIZE} />,
  //       type: 'secondary',
  //       name: t('Details'),
  //       action: (row, $e) => {
  //         navigate(`/visitor/about/${row?.id}`);
  //       },
  //       allowedRoles: ['ADMIN', 'HR', 'GUARD'],
  //     },
  //   ],
  //   [t, navigate]
  // );

  return (
    <TableProvider<IEmployee, IFilter[]>
      values={{
        columns,
        filter,
        rows: get(data, 'data', []),
        keyExtractor: 'id',
      }}
    >
      <DataGrid
        isLoading={isLoading}
        hasCustomizeColumns={true}
        dataColumn={dataColumn}
        // rowActions={rowActions}
        pagination={data}
      />
    </TableProvider>
  );
};

export default VisitorActions;
