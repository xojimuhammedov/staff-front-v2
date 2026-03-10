import { useLocation } from "react-router-dom";
import { paramsStrToObj } from "utils/helper";
import { useGetAllQuery } from "@/hooks/api";
import { KEYS } from "@/constants/key";
import { URLS } from "@/constants/url";
import { searchValue } from "types/search";

export default function useVisitedSites() {
    const location = useLocation();
    const searchValue: searchValue = paramsStrToObj(location.search);

    const { data } = useGetAllQuery<any>({
        key: KEYS.getVisitedSites,
        url: URLS.getVisitedSites,
        params: {
            page: searchValue?.page,
            limit: searchValue?.limit,
            search: searchValue?.search,
        }
    })

    return {
        data
    }
}
