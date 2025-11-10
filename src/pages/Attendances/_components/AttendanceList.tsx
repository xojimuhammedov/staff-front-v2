import TableProvider from 'providers/TableProvider/TableProvider';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from 'components/Atoms/DataGrid';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useLocation } from 'react-router-dom';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { IFilter } from 'interfaces/filter.interface';
import { IAction } from 'interfaces/action.interface';
import { paramsStrToObj } from 'utils/helper';
import MyAvatar from 'components/Atoms/MyAvatar';
import MyBadge from 'components/Atoms/MyBadge';


const AttendanceList = () => {
  const { t } = useTranslation();
  const location = useLocation()
  const searchValue: any = paramsStrToObj(location.search)

  const { data, isLoading } = useGetAllQuery({
    key: KEYS.attendacesForEmployee,
    url: URLS.attendacesForEmployee,
    params: {
      search: searchValue?.search
    }
  });
  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'fullName',
        label: t('Employee name'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            <MyAvatar size="medium" imageUrl={`${import.meta.env.VITE_APP_URL}storage/${row?.employee?.photo}`} />
            {row?.employee?.name}
          </div>
        )
      },
      {
        key: 'department',
        label: t('Department'),
        headerClassName: 'w-1/3',
        cellRender: (row) => <div className="department-text">{row?.employee?.department?.fullName ?? '--'}</div>
      },
      {
        key: 'phone',
        label: t('Phone Number'),
        headerClassName: 'w-1/3',
        cellRender: (row) => <>{row?.employee?.phone ?? '--'}</>
      },
      {
        key: 'isActive',
        label: t('Status'),
        headerClassName: 'w-1/3',
        cellRender: (row) => {
          if (row?.arrivalStatus) {
            return (
              <MyBadge variant={row?.status === "LATE" ? "orange" : 'green'}>
                {row?.arrivalStatus}
              </MyBadge>
            );
          } else return '--';
        }
      },
    ],
    [t]
  );

  const dataColumn = [
    {
      id: 1,
      label: t('Employee name'),
      headerClassName: 'w-1/3'
    },
    {
      id: 2,
      label: t('Department'),
      headerClassName: 'w-1/3'
    },
    {
      id: 3,
      label: t('Phone Number'),
      headerClassName: 'w-1/3'
    },
    {
      id: 4,
      label: t('Status'),
      headerClassName: 'w-1/3'
    }
  ];

  const filter: IFilter[] = useMemo(
    () => [],
    [t]
  );

  const rowActions: IAction[] = useMemo(
    () => [],
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
          hasButton={false}
        />
      </TableProvider>
    </>
  );
};

export default AttendanceList;
