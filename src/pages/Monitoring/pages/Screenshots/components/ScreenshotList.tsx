import { DynamicTable } from "@/components/Atoms/DataGrid/NewTable";
import { get } from "lodash";
import useScreenShot from "../hooks/useScreenShot";
import { createColumnsScreenshots } from "../helpers/createColumn";

const ScreenshotList = () => {
    const { columns } = createColumnsScreenshots();
    const { data } = useScreenShot();

    return (
        <DynamicTable
            data={get(data, 'data')}
            pagination={data}
            columns={columns}
            hasIndex={true}
        />
    );
};

export default ScreenshotList;
