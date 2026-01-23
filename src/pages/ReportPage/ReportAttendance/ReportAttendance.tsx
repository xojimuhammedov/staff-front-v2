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
import { useReportAttendance } from './hooks/useReportAttendance';
import ColumnsButton from 'components/Atoms/DataGrid/ColumnsButton';
import { searchValue } from 'types/search';

const ReportAttendance = () => {
    const { t } = useTranslation();
    const { control: dateControl } = useReportAttendance();
    const { control, watch } = useForm({
        defaultValues: {
            departmentId: undefined
        }
    });

    const { data: getDepartment } = useGetAllQuery<any>({
        key: KEYS.getAllListDepartment,
        url: URLS.getAllListDepartment,
        hideErrorMsg: true,
        params: {},
    });

    const departmentId = watch('departmentId');
    const { data, isLoading, refetch } = useReportAttendance(departmentId);

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
                                    options={getDepartment?.data?.map((evt: any) => ({
                                        label: evt.fullName,
                                        value: evt.id,
                                    })) || []}
                                    value={field.value as any}
                                    onChange={(val) => field.onChange((val as ISelect)?.value ? Number((val as ISelect).value) : undefined)}
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
                            control={dateControl}
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
