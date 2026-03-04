
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { createColumns } from '../helpers/createColumns';
import { DynamicTable } from '@/components/Atoms/DataGrid/NewTable';
import { useNavigate } from 'react-router-dom';


const AttendanceList = ({ data, isLoading, refetch }: any) => {
  const { columns } = createColumns({ refetch })
  const navigate = useNavigate()

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
        pagination={data}
        columns={columns}
        hasIndex={true}
        onRowClick={(row) => navigate(`/employees/about/${row?.employeeId}?current-setting=attendance`)} 
      />
    </>
  );
};

export default AttendanceList;
