
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { createColumns } from '../helpers/createColumns';
import { DynamicTable } from '@/components/Atoms/DataGrid/NewTable';

const VisitorAttendanceList = ({ data, isLoading, highlightedId = null }: any) => {
  const { columns } = createColumns()
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
      <DynamicTable
        data={rows}
        pagination={data}
        columns={columns}
        hasIndex={true}
      />
    </>
  );
};

export default VisitorAttendanceList;
