import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import config from 'configs';


const EmployeeRow = ({ employee }: any) => {
    return (
        <div className="bg-gray-50 dark:bg-bg-dark-theme rounded-2xl px-4 py-2 mb-4">
            <div className="flex items-center gap-4">
                <img
                    src={`${config.FILE_URL}api/storage/${employee?.photo}`}
                    alt={employee.name}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-text-title-dark">
                        {employee.name}
                    </h3>
                    <div className="flex items-center gap-1">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                            <div
                                className="bg-green-500 dark:bg-green-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${employee?.percentage > "100" ? "100" : employee?.percentage}%` }}
                            />
                        </div>
                        <span className="text-xl font-bold text-green-500 dark:text-green-400 min-w-[80px] text-right">
                            {employee.percentage > "100" ? "100" : employee?.percentage}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProgressCard = ({ topEmployee }: any) => {
    const { t } = useTranslation();

    return (
        <div className="bg-bg-base dark:bg-dark-dashboard-cards rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 size={24} className="text-green-600 dark:text-green-300" strokeWidth={2} />
                </div>
                <div>
                    <h1 className="headers-core text-sm  dark:text-text-title-dark">
                        {t("Top Effective Employees")}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                        {t("Highest productivity scores")}
                    </p>
                </div>
            </div>

            <div className="space-y-0">
                {topEmployee?.map((employee: any) => (
                    <EmployeeRow key={employee.id} employee={employee} />
                ))}
            </div>
        </div>
    );
};

export default ProgressCard;