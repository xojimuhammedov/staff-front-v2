import MyDivider from 'components/Atoms/MyDivider';
import { useTranslation } from 'react-i18next';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useMemo } from 'react';
import TableProvider from 'providers/TableProvider/TableProvider';
import DataGrid from 'components/Atoms/DataGrid';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { Clock, Calendar } from 'lucide-react';
import DateText from 'components/Atoms/DateText';
import dayjs from 'dayjs';

type FilterType = {
  search: string;
};

type TItem = {
  id: number;
};

const HistoryList = ({ data, isLoading }: any) => {
  const { t } = useTranslation();

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'employee',
        label: t('Employee'),
        headerClassName: 'sm:w-1/4 lg:flex-1',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            {get(row, 'employee.name', '--')}
          </div>
        )
      },
      {
        key: 'oldEmployeePlan',
        label: t('Old schedule'),
        headerClassName: 'sm:w-1/4 lg:flex-1',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            {get(row, 'oldEmployeePlan.name', '--')}
          </div>
        )
      },
      {
        key: 'newEmployeePlan',
        label: t('New schedule'),
        headerClassName: 'sm:w-1/4 lg:flex-1',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            {get(row, 'newEmployeePlan.name', '--')}
          </div>
        )
      },
      {
        key: 'organization',
        label: t('Organization'),
        headerClassName: 'sm:w-1/4 lg:flex-1',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            {get(row, 'organization.shortName', get(row, 'organization.fullName', '--'))}
          </div>
        )
      },
      {
        key: 'createdAt',
        label: t('Changed at'),
        headerClassName: 'sm:w-1/4 lg:flex-1',
        cellRender: (row) => {
          const dateValue = get(row, 'actionTime', get(row, 'createdAt'));
          const hasDate = Boolean(dateValue);
          return (
            <div className="flex flex-col text-text-base dark:text-text-title-dark">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-text-muted dark:text-white" />
                <span>{hasDate ? dayjs(dateValue).format('HH:mm') : '--'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted dark:text-text-subtle">
                <Calendar className="h-4 w-4 dark:text-white" />
                <span className='dark:text-white'>
                  <DateText value={dateValue} />
                </span>
              </div>
            </div>
          );
        }
      }
    ],
    [t]
  );

  const dataColumn = [
    { id: 1, label: t('Employee'), headerClassName: 'sm:w-1/4 lg:flex-1' },
    { id: 2, label: t('Old schedule'), headerClassName: 'sm:w-1/4 lg:flex-1' },
    { id: 3, label: t('New schedule'), headerClassName: 'sm:w-1/4 lg:flex-1' },
    { id: 4, label: t('Organization'), headerClassName: 'sm:w-1/4 lg:flex-1' },
    { id: 5, label: t('Changed at'), headerClassName: 'sm:w-1/4 lg:flex-1' }
  ];

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <MyDivider />
      <TableProvider<TItem, FilterType>
        values={{
          columns,
          filter: { search: '' },
          rows: get(data, 'data', get(data, 'items', [])),
          keyExtractor: 'id'
        }}>
        <DataGrid
          hasCustomizeColumns={false}
          hasExport={false}
          hasSearch={false}
          hasCheckbox={false}
          isLoading={isLoading}
          dataColumn={dataColumn}
          pagination={data}
        />
      </TableProvider>
    </div>
  );
};

export default HistoryList;
