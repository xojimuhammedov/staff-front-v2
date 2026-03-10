import { DynamicTable } from "@/components/Atoms/DataGrid/NewTable";
import { get } from "lodash";
import useActiveWindow from "../hooks/useActiveWindow";
import { createColumnsActiveWindow } from "../helpers/createColumn";

const ActiveWindowList = () => {
    const { columns } = createColumnsActiveWindow();
    const { data } = useActiveWindow();

    return (
        <DynamicTable
            data={get(data, 'data')}
            pagination={data}
            columns={columns}
            hasIndex={true}
        />
    );
};

export default ActiveWindowList;
