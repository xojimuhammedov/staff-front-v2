import TableProvider from 'providers/TableProvider/TableProvider';
import DataGrid from 'components/Atoms/DataGrid';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { IFilter } from 'interfaces/filter.interface';
import { createColumns } from '../helpers/createColumns';
import { useNavigate } from 'react-router-dom';
import { DynamicTable } from '@/components/Atoms/DataGrid/NewTable';


const AttendanceList = ({ data, isLoading, refetch }: any) => {
  const { columns } = createColumns({ refetch })

  if (isLoading) {
    return (
      <div className="absolute flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <DynamicTable
        data={get(data, 'data', [])}
        pagination={get(data, 'meta')}
        columns={columns}
        hasIndex={true}
      />
    </>
  );
};

export default AttendanceList;
