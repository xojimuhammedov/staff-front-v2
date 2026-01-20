import TableProvider from 'providers/TableProvider/TableProvider';
import DataGrid from 'components/Atoms/DataGrid';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { IFilter } from 'interfaces/filter.interface';
import { createReportAttendanceColumns } from '../helpers/createReportAttendanceColumns';

const ReportAttendanceList = ({ data, isLoading, refetch }: any) => {
  const { columns, dataColumn, rowActions } = createReportAttendanceColumns({ refetch })

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

export default ReportAttendanceList;
