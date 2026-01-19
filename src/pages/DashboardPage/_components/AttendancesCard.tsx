import React from 'react';
import { StatCardProps } from '../interface/dashboard.interface';
import { useTranslation } from 'react-i18next';



const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
}) => {

    return (
        <div className="bg-bg-base dark:bg-dark-dashboard-cards rounded-2xl p-6 shadow-lg">
            <div className="text-sm font-semibold text-gray-500 dark:text-text-title-dark uppercase tracking-wide mb-2">
                {title}
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-text-title-dark mb-3">
                {value}
            </div>
        </div>
    );
};



const AttendancesCard: React.FC<any> = ({ totalEmployees, totalLate, totalOnTime, totalAbsent }) => {
    const { t } = useTranslation();
    const stats = [
        {
            title: t('Total employees'),
            value: String(totalEmployees ?? 0),
        },
        {
            title: t('Late employees'),
            value: String(totalLate ?? 0),
        },
        {
            title: t('On time employees'),
            value: String(totalOnTime ?? 0),
        },
        {
            title: t('Absent employees'),
            value: String(totalAbsent ?? 0),
        }
    ];

    return (
        <>
            <h2 className='mt-4 font-bold text-xl'>{t("Today Attendance Statistics")}</h2>
            <div className="grid mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>
        </>
    );
};

export default React.memo(AttendancesCard)