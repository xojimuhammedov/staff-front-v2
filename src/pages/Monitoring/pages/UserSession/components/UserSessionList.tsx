import { DynamicTable } from "@/components/Atoms/DataGrid/NewTable";
import { get } from "lodash";
import useUserSession from "../hooks/useUserSession";
import { createColumnsUserSession } from "../helpers/createColumn";

const UserSessionList = () => {
    const { columns } = createColumnsUserSession();
    const { data } = useUserSession();

    return (
        <DynamicTable
            data={get(data, 'data')}
            pagination={data}
            columns={columns}
            hasIndex={true}
        />
    );
};

export default UserSessionList;
