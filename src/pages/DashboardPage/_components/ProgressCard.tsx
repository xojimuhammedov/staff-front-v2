import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import config from 'configs';
import AvatarIcon from '../../../assets/icons/avatar.jpg';


const EmployeeRow = ({ employee, isEffective = true }: any) => {
    return (
        <div className="bg-gray-50 dark:bg-bg-dark-theme rounded-2xl px-4 py-2 mb-4">
            <div className="flex items-center gap-4">
                <img
                    src={employee?.photo ? `${config.FILE_URL}api/storage/${employee?.photo}` : AvatarIcon}
                    alt={employee.name}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-text-title-dark">
                        {employee.name}
                    </h3>
                    <div className="flex items-center gap-1 pb-1">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                            <div
                                className={`${isEffective ? 'bg-green-500 dark:bg-green-400' : 'bg-[#F71E4F] dark:bg-[#F71E4F]'} h-full rounded-full transition-all duration-500`}
                                style={{ width: `${employee?.percentage > "100" ? "100" : employee?.percentage}%` }}
                            />
                        </div>
                        <span className={`text-xl font-bold ${isEffective ? 'text-green-500 dark:text-green-400' : 'text-[#F71E4F] dark:text-[#F71E4F]'} min-w-[80px] text-right`}>
                            {employee.percentage > "100" ? "100" : employee?.percentage}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EmployeeColumn = ({ employees, title, icon: Icon, iconBgColor, iconColor, isEffective }: any) => {
    const { t } = useTranslation();

    return (
        <div className="flex-1">
            <div className="flex items-center gap-4 mb-8">
                <div className={`${iconBgColor} w-12 h-12 rounded-2xl flex items-center justify-center`}>
                    <Icon size={24} className={iconColor} strokeWidth={2} />
                </div>
                <div>
                    <h1 className="headers-core text-sm dark:text-text-title-dark">
                        {t(title)}
                    </h1>
                </div>
            </div>
            <div className="space-y-0">
                {employees?.map((employee: any) => (
                    <EmployeeRow key={employee.id} employee={employee} isEffective={isEffective} />
                ))}
            </div>
        </div>
    );
};

const ProgressCard = ({ topEmployee, bottomEmployee }: any) => {
    return (
        <div className="bg-bg-base dark:bg-dark-dashboard-cards rounded-2xl p-4 shadow-lg">
            <div className="flex gap-6">
                <EmployeeColumn
                    employees={topEmployee}
                    title="Effective employees"
                    icon={CheckCircle2}
                    iconBgColor="bg-green-100 dark:bg-green-900/30"
                    iconColor="text-green-600 dark:text-green-300"
                    isEffective={true}
                />
                <EmployeeColumn
                    employees={bottomEmployee}
                    title="Uneffective employees"
                    icon={XCircle}
                    iconBgColor="bg-red-100 dark:bg-red-900/30"
                    iconColor="text-red-600 dark:text-red-300"
                    isEffective={false}
                />
            </div>
        </div>
    );
};

export default ProgressCard;