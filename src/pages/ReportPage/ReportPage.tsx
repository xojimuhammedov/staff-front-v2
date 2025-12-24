import NoData from 'assets/icons/NoData';
import MyDivider from 'components/Atoms/MyDivider';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import dayjs from 'dayjs';
import { useGetAllQuery } from 'hooks/api';
import { useDownloadExcel } from 'hooks/useExcel';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TimeSheet from './_components/TimeSheet';
import Loading from 'assets/icons/Loading';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { Calendar } from 'lucide-react';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useForm } from 'react-hook-form';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyButton from 'components/Atoms/MyButton/MyButton';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

const ReportPage = () => {
    const { t } = useTranslation();
    const currentTableRef = useRef<any>(null);
    const { control, watch }: any = useForm()
    const filename = `timesheet_${dayjs(new Date()).format('YYYY-MM-DD_hh:mm:ss')}`;
    const sheet = 'users';

    const downloadExcel = useDownloadExcel({ currentTableRef, filename, sheet });
    const breadCrumbs = [
        {
            label: t('Timesheet'),
            url: '#'
        }
    ];
    

    const paramsValue = watch('date') ? {
        startDate: dayjs(watch('date')?.startDate)?.format("YYYY-MM-DD"),
        endDate: dayjs(watch('date')?.endDate)?.format("YYYY-MM-DD")
    } : {
        endDate: dayjs().format("YYYY-MM-DD"),
        startDate: dayjs().subtract(7, 'day').format("YYYY-MM-DD"),
    };

    const { data, isLoading } = useGetAllQuery({
        key: KEYS.employeeTimesheet,
        url: URLS.employeeTimesheet,
        params: {
            organizationId: 1,
            ...paramsValue
        }
    });

    if (isLoading) {
        return (
            <div className="absolute -mt-8 flex h-full w-full items-center justify-center">
                <Loading />
            </div>
        )
    }

    return (
        <PageContentWrapper>
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <h1 className="headers-core dark:text-text-title-dark text-text-base">
                        {t('Report')}
                    </h1>
                    <MyBreadCrumb items={breadCrumbs} />
                </div>
                <div className='flex items-center gap-4'>
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
                    <MyButton onClick={downloadExcel.onDownload} variant='primary'>{t("Download")}</MyButton>
                </div>
            </div>
            <MyDivider />
            <TimeSheet data={data} currentTableRef={currentTableRef} />
        </PageContentWrapper>
    );
}

export default ReportPage;
