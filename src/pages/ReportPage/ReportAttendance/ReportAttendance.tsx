import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import ReportAttendanceList from './_components/ReportAttendanceList';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { Calendar } from 'lucide-react';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery } from 'hooks/api';
import { useForm, Controller } from 'react-hook-form';
import { MySelect } from 'components/Atoms/Form';
import { ISelect } from 'interfaces/select.interface';
import ColumnsButton from 'components/Atoms/DataGrid/ColumnsButton';
import { searchValue } from 'types/search';
import { paramsStrToObj } from 'utils/helper';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

const ReportAttendance = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const searchValue: searchValue = paramsStrToObj(location.search);

    const { 'current-setting': _, ...apiParams } = searchValue as any;
    const { control, watch } = useForm({
        defaultValues: {
            departmentId: undefined,
            date: {
                endDate: dayjs().format("YYYY-MM-DD"),
                startDate: dayjs().format("YYYY-MM-DD"),
            }
        }
    });

    const departmentId = watch('departmentId');

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
            search: apiParams?.search,
            page: apiParams?.page || 1,
            limit: apiParams?.limit || 10,
            departmentId: departmentId,
            ...searchValue,
            ...paramsValue,
        }
    });

    const { data: getDepartment } = useGetAllQuery<any>({
        key: KEYS.getAllListDepartment,
        url: URLS.getAllListDepartment,
        hideErrorMsg: true,
        params: {},
    });

    const departmentOptions = [
        {
            label: t('All'),
            value: undefined,
        },
        ...(getDepartment?.data?.map((evt: any) => ({
            label: evt.fullName,
            value: evt.id,
        })) || []),
    ];

    return (
        <PageContentWrapper>
            <div className='flex justify-between items-center'>
                <div className="flex flex-col">
                </div>
                <div className='flex items-center gap-4'>
                    <div className='flex items-center w-[240px]'>
                        <Controller
                            name="departmentId"
                            control={control}
                            render={({ field }) => (
                                <MySelect
                                    options={departmentOptions}
                                    value={
                                        departmentOptions.find(opt => opt.value === field.value) || null
                                    }
                                    onChange={(val: any) =>
                                        field.onChange(
                                            val && 'value' in val ? val.value : undefined
                                        )
                                    }
                                    onBlur={field.onBlur}
                                    isClearable
                                    allowedRoles={['ADMIN', 'HR']}
                                    placeholder={t('Select department')}
                                />
                            )}
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
                            startIcon={<Calendar stroke="#9096A1" />}
                        />
                    </div>
                </div>
            </div>
            <ReportAttendanceList data={data} isLoading={isLoading} refetch={refetch} />
        </PageContentWrapper>
    );
}

export default ReportAttendance;
