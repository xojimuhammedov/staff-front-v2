import TableProvider from 'providers/TableProvider/TableProvider';
import DataGrid from 'components/Atoms/DataGrid';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { IFilter } from 'interfaces/filter.interface';
import { createColumns } from '../helpers/createColumns';

const VisitorAttendanceList = ({ data, isLoading, highlightedId = null }: any) => {
  const { columns, dataColumn, rowActions } = createColumns()
  const rows = (get(data, 'data', []) || []).map((row: any) => ({
    ...row,
    rowClassName:
      highlightedId && String(row?.id) === String(highlightedId)
        ? 'bg-yellow-300 odd:bg-yellow-300 dark:bg-yellow-900/30 dark:odd:bg-yellow-900/30 border-yellow-400'
        : '',
  }));

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
          filter: [],
          rows,
          keyExtractor: 'id'
        }}>
        <DataGrid
          isLoading={isLoading}
          hasAction={false}
          hasCustomizeColumns={true}
          dataColumn={dataColumn}
          rowActions={rowActions}
          pagination={data}
        />
      </TableProvider>
    </>
  );
};

export default VisitorAttendanceList;
