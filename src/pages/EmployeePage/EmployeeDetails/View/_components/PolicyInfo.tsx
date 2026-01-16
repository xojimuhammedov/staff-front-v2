import policyEmployeeData from 'configs/policy';
import React from 'react';
import { useTranslation } from 'react-i18next';


const PolicyInfo = ({ name, color }: { name: string, color: string }) => {
    const {t} = useTranslation()
    return (
        <div className="w-full bg-bg-base dark:bg-dark-dashboard-cards rounded-lg shadow-lg p-6 font-sans">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-base font-semibold text-gray-800 dark:text-text-title-dark">{name}</h2>
            </div>

            {/* App List */}
            <div className="space-y-4">
                {policyEmployeeData?.slice(0, 3)?.map((app) => (
                    <div key={app?.title} className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="text-gray-700 dark:text-text-title-dark font-medium text-sm">{app?.title}</span>
                                <span className="text-gray-600 dark:text-text-muted font-semibold">{app?.percent}%</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
                                    style={{ width: `${app.percent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total Useful Time */}
            <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-text-muted font-medium">{t("Total Useful Time")}</span>
                    <span className="text-lg font-bold text-gray-800 dark:text-text-title-dark">100%</span>
                </div>
            </div>
        </div>
    );
}

export default React.memo(PolicyInfo);
