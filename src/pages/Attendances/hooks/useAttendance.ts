import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import dayjs from 'dayjs';
import { useGetAllQuery } from 'hooks/api';
import { useSearch } from 'hooks/useSearch';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { searchValue } from 'types/search';
import { paramsStrToObj } from 'utils/helper';

export const useAttendance = () => {
    const location = useLocation()
    const { control, watch }: any = useForm()
    const { search, setSearch, handleSearch } = useSearch();
    const searchValue: searchValue = paramsStrToObj(location.search)
    const paramsValue = watch('date') ? {
        startDate: dayjs(watch('date')?.startDate)?.format("YYYY-MM-DD"),
        endDate: dayjs(watch('date')?.endDate)?.format("YYYY-MM-DD")
    } : {
        date: dayjs(new Date())?.format("YYYY-MM-DD")
    }

    const { data, isLoading, refetch } = useGetAllQuery({
        key: KEYS.attendacesForEmployee,
        url: URLS.attendacesForEmployee,
        params: {
            search: searchValue?.search,
            page: searchValue?.page || 1,
            limit: searchValue?.limit || 10,
            ...paramsValue,
            ...searchValue
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
        watch
    }
}

