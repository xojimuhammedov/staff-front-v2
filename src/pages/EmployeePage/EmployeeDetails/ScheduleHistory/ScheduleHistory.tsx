import React from 'react';
import { useTranslation } from 'react-i18next';
import MyDivider from 'components/Atoms/MyDivider';
import SchedulePlanCard from './_components/ScheduleCard';
import { useParams } from 'react-router-dom';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery } from 'hooks/api';

const ScheduleHistory = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const { data, isLoading } = useGetAllQuery<any>({
        key: KEYS.employeePlanHistoryChangeSchedules,
        url: URLS.employeePlanHistoryChangeSchedules,
        params: {
            employeeId: id
        }
    });

    return (
        <>
            <h1 className='headers-core dark:text-text-title-dark text-text-base'>{t("Schedule history")}</h1>
            <MyDivider />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-2xl">
                {data?.data?.map((item: any) => (
                    <SchedulePlanCard
                        plan={item?.oldEmployeePlan}
                        label={t("Previous Schedule")}
                        variant="old"
                    />
                ))}
                {data?.data?.map((item: any) => (
                    <SchedulePlanCard
                        plan={item?.newEmployeePlan}
                        label={t("New Schedule")}
                        variant="new"
                    />
                ))}
            </div>
        </>
    );
};

export default ScheduleHistory;