import MyDivider from 'components/Atoms/MyDivider';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { Clock, Calendar } from 'lucide-react';
import DateText from 'components/Atoms/DateText';
import dayjs from 'dayjs';
import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';
import { useNavigate } from 'react-router-dom';


const HistoryList = ({ data, isLoading }: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate()

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'employee',
        label: t('Employee'),
        headerClassName: 'dark:text-text-title-dark',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            {get(row, 'employee.name', '--')}
          </div>
        )
      },
      {
        key: 'oldEmployeePlan',
        label: t('Old schedule'),
        headerClassName: 'dark:text-text-title-dark',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            {get(row, 'oldEmployeePlan.name', '--')}
          </div>
        )
      },
      {
        key: 'newEmployeePlan',
        label: t('New schedule'),
        headerClassName: 'dark:text-text-title-dark',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            {get(row, 'newEmployeePlan.name', '--')}
          </div>
        )
      },
      {
        key: 'organization',
        label: t('Organization'),
        headerClassName: 'dark:text-text-title-dark',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            {get(row, 'organization.shortName', get(row, 'organization.fullName', '--'))}
          </div>
        )
      },
      {
        key: 'createdAt',
        label: t('Changed at'),
        headerClassName: 'dark:text-text-title-dark',
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
      <DynamicTable
        data={get(data, 'data', [])}
        pagination={data}
        columns={columns}
        hasIndex={true}
        onRowClick={(row) => navigate(`/employees/about/${row?.employeeId}?current-setting=schedule-history`)}
      />
    </div>
  );
};

export default HistoryList;
