import TableProvider from 'providers/TableProvider/TableProvider';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from 'components/Atoms/DataGrid';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useLocation, useNavigate } from 'react-router-dom';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { IFilter } from 'interfaces/filter.interface';
import { IAction } from 'interfaces/action.interface';
import { paramsStrToObj } from 'utils/helper';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import MyButton from 'components/Atoms/MyButton/MyButton';


const WorkScheduleList = () => {
  const { t } = useTranslation();
  const location = useLocation()
  const navigate = useNavigate()
  const searchValue: any = paramsStrToObj(location.search)

  const { data, isLoading } = useGetAllQuery({
    key: KEYS.employeeSchedulePlan,
    url: URLS.employeeSchedulePlan,
    params: {
      search: searchValue?.search
    }
  });
  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'name',
        label: t('Schedule name'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            {row?.name ?? "--"}
          </div>
        )
      },
      {
        key: 'department',
        label: t('Organization'),
        headerClassName: 'w-1/3',
        cellRender: (row) => <div className="department-text">{row?.organization?.fullName ?? '--'}</div>
      },
      {
        key: 'startTime',
        label: t('Start time'),
        headerClassName: 'w-1/3',
        cellRender: (row) => <>{row?.startTime ?? '--'}</>
      },
      {
        key: 'endTime',
        label: t('End time'),
        headerClassName: 'w-1/3',
        cellRender: (row) => <>{row?.endTime ?? '--'}</>
      },
      {
        key: 'extraTime',
        label: t('Extra time'),
        headerClassName: 'w-1/3',
        cellRender: (row) => <>{row?.extraTime ?? '--'}</>
      }
    ],
    [t]
  );

  const dataColumn = [
    {
      id: 1,
      label: t('Schedule name'),
      headerClassName: 'w-1/3'
    },
    {
      id: 2,
      label: t('Organization'),
      headerClassName: 'w-1/3'
    },
    {
      id: 3,
      label: t('Start time'),
      headerClassName: 'w-1/3'
    },
    {
      id: 4,
      label: t('End time'),
      headerClassName: 'w-1/3'
    },
    {
      id: 5,
      label: t('Extra time'),
      headerClassName: 'w-1/3'
    }
  ];

  const filter: IFilter[] = useMemo(
    () => [],
    [t]
  );

  const rowActions: IAction[] = useMemo(
    () => [
      {
        icon: <Edit3 size={DEFAULT_ICON_SIZE} />,
        type: 'primary',
        name: t('Edit'),
        action: (row, $e) => {
        },
        allowedRoles: ['ADMIN', 'HR'],
      },
      {
        icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
        type: 'danger',
        name: t('Delete'),
        action: (row, $e) => {
        },
        allowedRoles: ['ADMIN', 'HR'],
      }
    ],
    [t]
  );

  if (isLoading) {
    return (
      <div className="absolute flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <TableProvider<IEmployee, IFilter[]>
        values={{
          columns,
          filter,
          rows: get(data, 'data', []),
          keyExtractor: 'id'
        }}>
        <DataGrid
          isLoading={isLoading}
          hasAction={false}
          hasCustomizeColumns={true}
          hasFilters={false}
          dataColumn={dataColumn}
          hasExport={false}
          hasCheckbox={false}
          rowActions={rowActions}
          pagination={data}
          hasButton={
            <>
              <MyButton
                onClick={() => navigate('/workschedule/create')}
                startIcon={<Plus />}
                allowedRoles={['ADMIN', 'HR']}
                variant="primary"
                className="[&_svg]:stroke-bg-white w-[170px] text-sm">
                {t('Create a schedule')}
              </MyButton>
            </>
          }
        />
      </TableProvider>
    </>
  );
};

export default WorkScheduleList;
