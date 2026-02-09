import TableProvider from 'providers/TableProvider/TableProvider';
import DataGrid from 'components/Atoms/DataGrid';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { IFilter } from 'interfaces/filter.interface';
import { createColumns } from '../helpers/createColumns';
import { useNavigate } from 'react-router-dom';


const AttendanceList = ({ data, isLoading, refetch }: any) => {
  const { columns, dataColumn } = createColumns({ refetch })
  const navigate = useNavigate();

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
          pagination={data}
          handleRowClick={(row) => navigate(`/employees/about/${row?.employee?.id}?current-setting=attendance`)}
        />
      </TableProvider>
    </>
  );
};

export default AttendanceList;
