import React from 'react';
import { useTranslation } from 'react-i18next';
import MyDivider from 'components/Atoms/MyDivider';
import SchedulePlanCard from './_components/ScheduleCard';
import { useParams } from 'react-router-dom';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery } from 'hooks/api';
import { ArrowRight, ArrowDown } from 'lucide-react';

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
            <div className="flex flex-col gap-6 w-full max-w-3xl">
                {data?.data?.map((item: any, index: number) => (
                    <div key={index} className="flex flex-col md:flex-row items-center gap-4 w-full">
                        <div className="flex-1 w-full">
                            <SchedulePlanCard
                                plan={item?.oldEmployeePlan}
                                label={t("Previous Schedule")}
                                variant="old"
                            />
                        </div>
                        
                        <div className="hidden md:flex items-center justify-center text-[#fe5d37] dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 p-2 rounded-full border border-orange-200 dark:border-orange-900/50 shadow-sm flex-shrink-0">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                        <div className="flex md:hidden items-center justify-center text-[#fe5d37] dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 p-2 rounded-full border border-orange-200 dark:border-orange-900/50 shadow-sm my-1 flex-shrink-0">
                            <ArrowDown className="w-5 h-5" />
                        </div>

                        <div className="flex-1 w-full">
                            <SchedulePlanCard
                                plan={item?.newEmployeePlan}
                                label={t("New Schedule")}
                                variant="new"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ScheduleHistory;