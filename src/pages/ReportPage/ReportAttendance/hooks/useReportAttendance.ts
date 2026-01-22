import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery } from 'hooks/api';
import { useSearch } from 'hooks/useSearch';
import { useLocation } from 'react-router-dom';
import { searchValue } from 'types/search';
import { paramsStrToObj } from 'utils/helper';
import { useDateParams } from './useDateParams';

export const useReportAttendance = (departmentId?: number) => {
    const location = useLocation();
    const { control, watch, paramsValue } = useDateParams(0);
    const { search, setSearch, handleSearch } = useSearch();
    const searchValue: searchValue = paramsStrToObj(location.search);

    // current-setting parametrini olib tashlaymiz, chunki bu faqat routing uchun
    const { 'current-setting': _, ...apiParams } = searchValue as any;

    const { data, isLoading, refetch } = useGetAllQuery({
        key: KEYS.attendacesForEmployee,
        url: URLS.attendacesForEmployee,
        params: {
            search: apiParams?.search,
            page: apiParams?.page || 1,
            limit: apiParams?.limit || 10,
            startDate: paramsValue.startDate,
            endDate: paramsValue.endDate,
            ...(departmentId ? { departmentId } : {}),
        }
    });

    return {
        data,
        isLoading,
        refetch,
        search,
        control,
        handleSearch,
        setSearch,
        watch,
        paramsValue
    }
}
