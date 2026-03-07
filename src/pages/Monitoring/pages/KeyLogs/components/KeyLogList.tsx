import { DynamicTable } from "@/components/Atoms/DataGrid/NewTable";
import { get } from "lodash";
import useKeyLogs from "../hooks/useKeyLogs";
import { createColumnsKeyLogs } from "../helpers/createColumn";

const KeyLogList = () => {
    const { columns } = createColumnsKeyLogs();
    const { data } = useKeyLogs();

    return (
        <DynamicTable
            data={get(data, 'data')}
            pagination={data}
            columns={columns}
            hasIndex={true}
        />
    );
};

export default KeyLogList;
