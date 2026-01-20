import policyEmployeeData from 'configs/policy';
import React from 'react';


const PolicyCard = ({ name, color }: { name: string, color: string }) => {
    return (
        <div className="w-full bg-white dark:bg-bg-dark-bg rounded-lg shadow-lg p-6 font-sans mt-6 border dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-800 dark:text-text-title-dark mb-4">{name}</h2>

            {/* App List */}
            <div className="space-y-4">
                {policyEmployeeData?.slice(0, 3)?.map((app) => (
                    <div key={app?.title} className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="text-gray-700 dark:text-text-title-dark font-medium text-sm">{app?.title}</span>
                                <span className="text-gray-600 dark:text-text-title-dark font-semibold">{app?.percent}%</span>
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
        </div>
    );
}

export default React.memo(PolicyCard);
