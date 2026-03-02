
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { createColumns } from '../helpers/createColumns';
import { useNavigate } from 'react-router-dom';
import { DynamicTable } from '@/components/Atoms/DataGrid/NewTable';

const ReportAttendanceList = ({ data, isLoading }: any) => {
  const { columns } = createColumns()
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
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

export default ReportAttendanceList;
