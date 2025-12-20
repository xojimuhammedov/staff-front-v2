import TableProvider from 'providers/TableProvider/TableProvider';
import DataGrid from 'components/Atoms/DataGrid';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { IFilter } from 'interfaces/filter.interface';
import { useAttendance } from '../hooks/useAttendance';
import { createColumns } from '../helpers/createColumns';


const AttendanceList = () => {
  const { data, isLoading, refetch } = useAttendance()
  const { columns, dataColumn, rowActions } = createColumns(refetch)

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
          rows: get(data, 'data', []),
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

export default AttendanceList;
