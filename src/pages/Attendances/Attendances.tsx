import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import AttendanceList from './_components/AttendanceList';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { Calendar, Search } from 'lucide-react';
import { MyInput } from 'components/Atoms/Form';
import { KeyTypeEnum } from 'enums/key-type.enum';
import ColumnsButton from 'components/Atoms/DataGrid/ColumnsButton';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery } from 'hooks/api';
import { useSearch } from 'hooks/useSearch';
import { paramsStrToObj } from 'utils/helper';
import dayjs from 'dayjs';
import { searchValue } from 'types/search';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';


const Attendances = () => {
    const { t } = useTranslation();
    const location = useLocation()
    const breadCrumbs = [
        {
            label: t('Attendances'),
            url: '#'
        }
    ];

    const { control, watch } = useForm({
        defaultValues: {
            date: {
                endDate: dayjs().format("YYYY-MM-DD"),
                startDate: dayjs().format("YYYY-MM-DD"),
            }
        }
    })
    const { search, setSearch, handleSearch } = useSearch();
    const searchValue: searchValue = paramsStrToObj(location.search)

    const paramsValue = watch('date') ? {
        startDate: dayjs(watch('date')?.startDate)?.format("YYYY-MM-DD"),
        endDate: dayjs(watch('date')?.endDate)?.format("YYYY-MM-DD")
    } : {
        endDate: dayjs().format("YYYY-MM-DD"),
        startDate: dayjs().subtract(7, 'day').format("YYYY-MM-DD"),
    }


    const { data, isLoading, refetch } = useGetAllQuery({
        key: KEYS.attendacesForEmployee,
        url: URLS.attendacesForEmployee,
        params: {
            search: searchValue?.search,
            page: searchValue?.page || 1,
            limit: searchValue?.limit || 10,
            ...searchValue,
            ...paramsValue,
        }
    });
    return (
        <PageContentWrapper>
            <div className='flex justify-between items-center'>
                <div className="flex flex-col">
                    <h1 className="headers-core dark:text-text-title-dark text-text-base">
                        {t('Attendances')}
                    </h1>
                    <MyBreadCrumb items={breadCrumbs} />
                </div>
                <div className='flex items-center gap-4'>
                    <div>
                        <MyInput
                            onKeyUp={(event) => {
                                if (event.key === KeyTypeEnum.enter) {
                                    handleSearch();
                                } else {
                                    setSearch((event.target as HTMLInputElement).value);
                                }
                            }}
                            defaultValue={search}
                            startIcon={<Search className="stroke-text-muted" onClick={handleSearch} />}
                            className="dark:bg-bg-input-dark"
                            placeholder={t('Search...')}
                        />
                    </div>
                    <div>
                        <ColumnsButton />
                    </div>
                    <div className='flex items-center w-[240px]'>
                        <MyTailwindPicker
                            useRange={true}
                            name='date'
                            asSingle={false}
                            control={control}
                            placeholder={t('Today')}
                            startIcon={<Calendar className="stroke-text-muted dark:stroke-text-title-dark" />}
                        />
                    </div>
                </div>
            </div>
            <AttendanceList data={data} isLoading={isLoading} refetch={refetch} />
        </PageContentWrapper>
    );
}

export default Attendances;
