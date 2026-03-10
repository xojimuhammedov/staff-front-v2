import { DynamicTable } from "@/components/Atoms/DataGrid/NewTable";
import { get } from "lodash";
import useVisitedSites from "../hooks/useVisitedSites";
import { createColumnsVisitedSites } from "../helpers/createColumn";

const VisitedSitesList = () => {
    const { columns } = createColumnsVisitedSites();
    const { data } = useVisitedSites();

    return (
        <DynamicTable
            data={get(data, 'data')}
            pagination={data}
            columns={columns}
            hasIndex={true}
        />
    );
};

export default VisitedSitesList;
