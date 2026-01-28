import React from 'react';
import { StatCardProps } from '../interface/dashboard.interface';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';


type StatCardExtendedProps = StatCardProps & {
    percent: number;
    color: 'green' | 'orange' | 'red';
    link?: string;
};

const getColorStyles = (color: StatCardExtendedProps['color']) => {
    switch (color) {
        case 'green':
            return {
                dot: 'bg-green-600',
                badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                bar: 'bg-green-600',
            };
        case 'orange':
            return {
                dot: 'bg-orange-500',
                badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
                bar: 'bg-orange-500',
            };
        case 'red':
            return {
                dot: 'bg-red-600',
                badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                bar: 'bg-red-600',
            };
        default:
            return {
                dot: 'bg-gray-400',
                badge: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
                bar: 'bg-gray-400',
            };
    }
};

const StatCard: React.FC<StatCardExtendedProps> = ({
    title,
    value,
    percent,
    color,
    link,
}) => {
    const navigate = useNavigate();
    const { dot, badge, bar } = getColorStyles(color);
    const safePercent = Number.isFinite(percent) ? Math.max(0, Math.min(100, percent)) : 0;


    return (
        <div
            className="group w-full rounded-2xl p-4 bg-bg-base dark:bg-dark-dashboard-cards shadow-base border border-transparent flex items-center gap-4 cursor-pointer select-none"
            role="button"
            tabIndex={0}
            onClick={() => link && navigate(link)}
        >
            <div className="flex flex-col gap-1 w-full min-w-0">
                <div className="flex items-start justify-between gap-3 w-full">
                    <div className="flex items-start gap-3">
                        <span className={`mt-2 h-3 w-3 rounded-full ${dot} mt-5`} />
                        <div className="text-4xl font-bold text-gray-900 dark:text-text-title-dark leading-none">
                            {value}
                        </div>
                        <div className={`inline-flex items-center gap-1 px-3 dark:text-white py-1 rounded-full text-xs font-medium whitespace-nowrap ${badge}`}>
                            {safePercent}%
                        </div>
                    </div>

                    <div className="flex items-center gap-2 min-w-[90px]">
                        <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-400 overflow-hidden">
                            <div
                                className={`h-full rounded-full ${bar}`}
                                style={{ width: `${safePercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="text-sm font-semibold text-gray-500 dark:text-text-title-dark uppercase tracking-wide truncate pl-6">
                    {title}
                </div>
            </div>
        </div>
    );
};



const AttendancesCard: React.FC<any> = ({
    overallEmployees,
    totalEmployees,
    totalLate,
    totalOnTime,
    totalAbsent,
}) => {
    const { t } = useTranslation();
    const total =
        Number(totalEmployees ?? 0) ||
        Number(totalLate ?? 0) + Number(totalOnTime ?? 0) + Number(totalAbsent ?? 0);

    const getPercent = (value: number) =>
        total > 0 ? Math.round((value / total) * 100) : 0;

    const overallTotal = Number(overallEmployees ?? 0);
    const totalEmployeesPercent =
        overallTotal > 0 ? Math.round((Number(totalEmployees ?? 0) / overallTotal) * 100) : 0;

    const stats: StatCardExtendedProps[] = [
        {
            title: t('Total employees'),
            value: String(totalEmployees ?? 0),
            percent: totalEmployeesPercent,
            color: 'green',
            link: "/employees",
        },
        {
            title: t('Late employees'),
            value: String(totalLate ?? 0),
            percent: getPercent(Number(totalLate ?? 0)),
            color: 'orange',
            link: "/attendances?arrivalStatus=LATE",
        },
        {
            title: t('On time employees'),
            value: String(totalOnTime ?? 0),
            percent: getPercent(Number(totalOnTime ?? 0)),
            color: 'green',
            link: "/attendances?arrivalStatus=ON_TIME",
        },
        {
            title: t('Absent employees'),
            value: String(totalAbsent ?? 0),
            percent: getPercent(Number(totalAbsent ?? 0)),
            color: 'red',
            link: "/attendances?arrivalStatus=ABSENT",
        }
    ];

    return (
        <>
            <h1 className='headers-core text-sm  dark:text-text-title-dark mt-4'>{t("Today attendance statistics")}</h1>
            <div className="grid mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>
        </>
    );
};

export default React.memo(AttendancesCard)