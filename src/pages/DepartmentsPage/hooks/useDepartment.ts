import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useLocation } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import { searchValue } from 'types/search';

export const useDepartment = () => {
    const location = useLocation()
    const searchValue: searchValue = paramsStrToObj(location.search)
    const { data, refetch, isLoading } = useGetAllQuery<any>({
        key: KEYS.getAllListDepartment,
        url: URLS.getAllListDepartment,
        params: {
            search: searchValue.search,
            organizationId: searchValue.organizationId,
            parentId: searchValue.subdepartmentId,
            isSubDepartment: false
        }
    })

    return {
        searchValue,
        data: data?.data,
        refetch,
        isLoading,
    }
}

