import MyDivider from 'components/Atoms/MyDivider';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import dayjs from 'dayjs';
import { useGetAllQuery } from 'hooks/api';
import { useDownloadExcel } from 'hooks/useExcel';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TimeSheet from '../_components/TimeSheet';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { Calendar, Download } from 'lucide-react';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyButton from 'components/Atoms/MyButton/MyButton';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useDateParams } from '../hooks/useDateParams';
import { twMerge } from 'tailwind-merge';
import EmployeeMultiSelectDropdown from 'components/Atoms/DataGrid/CustomizeColumnsButton';
dayjs.extend(isoWeek);

const ReportInfo = () => {
    const { t } = useTranslation();
    const currentTableRef = useRef<any>(null);
    const [selectIds, setSelectIds] = useState<number[]>([])
    const { control, paramsValue } = useDateParams(7);

    const filename = `timesheet_${dayjs(new Date()).format('YYYY-MM-DD_hh:mm:ss')}`;
    const sheet = 'users';

    const downloadExcel = useDownloadExcel({ currentTableRef, filename, sheet });
    const breadCrumbs = [
        {
            label: t('Timesheet'),
            url: '#'
        }
    ];

    const employeeIdsQuery = useMemo(() => {
        return selectIds.map((id) => `employeeIds=${id}`).join("&");
    }, [selectIds]);

    const { data, refetch, isLoading } = useGetAllQuery({
        key: KEYS.employeeTimesheet,
        url: `${URLS.employeeTimesheet}?${employeeIdsQuery}`,
        params: {
            ...paramsValue
        },
        hideErrorMsg: true
    });

    const { data: employeeData } = useGetAllQuery<any>({
        key: KEYS.getEmployeeList,
        url: URLS.getEmployeeList,
        params: {
            limit: 100
        }
    });

    return (
        <>
            <div className="flex items-center justify-end gap-4">
                <div className='flex items-center gap-4'>
                    <EmployeeMultiSelectDropdown
                        employeeList={employeeData?.data}
                        initialSelectedIds={selectIds}
                        onApply={(ids: any) => {
                            // `useGetAllQuery` will refetch automatically when `employeeIdsQuery` changes.
                            setSelectIds(ids);
                        }}
                    />
                    <div className="w-[240px]">
                        <MyTailwindPicker
                            useRange={true}
                            name='date'
                            asSingle={false}
                            control={control}
                            placeholder={t('Today')}
                            startIcon={<Calendar stroke="#9096A1" />}
                        />
                    </div>
                    <MyButton
                        startIcon={<Download />}
                        onClick={downloadExcel.onDownload} variant='primary'>{t("Download")}</MyButton>
                </div>
            </div>
            <MyDivider />
            {/* <div className={'w-full max-w-full overflow-x-hidden'}>
                <TimeSheet data={data} currentTableRef={currentTableRef} />
            </div> */}
        </>
    );
}

export default ReportInfo;
