import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { Calendar, Search } from 'lucide-react';
import { MyInput, MySelect } from 'components/Atoms/Form';
import { ISelect } from 'interfaces/select.interface';
import { KeyTypeEnum } from 'enums/key-type.enum';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery } from 'hooks/api';
import { useSearch } from 'hooks/useSearch';
import { paramsStrToObj } from 'utils/helper';
import dayjs from 'dayjs';
import { searchValue } from 'types/search';
import { useLocation } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import VisitorAttendanceList from './_components/VisitorAttendanceList';



const VisitorAttendances = () => {
    const { t } = useTranslation();
    const location = useLocation()
    const breadCrumbs = [
        {
            label: t('Actions'),
            url: '#'
        }
    ];

    const { control, watch } = useForm({
        defaultValues: {
            userType: undefined,
            date: {
                endDate: dayjs().format("YYYY-MM-DD"),
                startDate: dayjs().format("YYYY-MM-DD"),
            }
        }
    })
    const userTypeOptions: ISelect[] = [
        { label: t('All'), value: '' },
        { label: t('Employee'), value: 'EMPLOYEE' },
        { label: t('Visitor'), value: 'VISITOR' },
    ];
    const { search, setSearch, handleSearch } = useSearch();
    const searchValue: searchValue = paramsStrToObj(location.search)

    const paramsValue = watch('date') ? {
        startDate: dayjs(watch('date')?.startDate)?.format("YYYY-MM-DD"),
        endDate: dayjs(watch('date')?.endDate)?.format("YYYY-MM-DD")
    } : {
        endDate: dayjs().format("YYYY-MM-DD"),
        startDate: dayjs().subtract(7, 'day').format("YYYY-MM-DD"),
    }

    const { data, isLoading } = useGetAllQuery({
        key: KEYS.actionAllList,
        url: URLS.actionAllList,
        params: {
            search: searchValue?.search,
            page: searchValue?.page || 1,
            limit: searchValue?.limit || 10,
            userType: watch('userType') ?? undefined,
            ...paramsValue,
            ...searchValue,
        }
    });

    return (
        <PageContentWrapper>
            <div className='flex justify-between items-center'>
                <div className="flex flex-col">
                    <h1 className="headers-core dark:text-text-title-dark text-text-base">
                        {t('Actions')}
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
                    <div className='flex items-center w-[200px]'>
                        <Controller
                            name="userType"
                            control={control}
                            render={({ field }) => (
                                <MySelect
                                    options={userTypeOptions}
                                    value={
                                        userTypeOptions.find(opt => opt.value === (field.value ?? '')) ?? undefined
                                    }
                                    onChange={(val: any) =>
                                        field.onChange(
                                            val && 'value' in val ? (val.value === '' ? undefined : val.value) : undefined
                                        )
                                    }
                                    onBlur={field.onBlur}
                                    isClearable
                                    allowedRoles={['ADMIN', 'HR']}
                                    placeholder={t('Select user type')}
                                />
                            )}
                        />
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
            <VisitorAttendanceList data={data} isLoading={isLoading} />
        </PageContentWrapper>
    );
}

export default VisitorAttendances;
