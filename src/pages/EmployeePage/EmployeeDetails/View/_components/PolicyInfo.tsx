import React from 'react';
import { useTranslation } from 'react-i18next';

import { Globe, AppWindow } from 'lucide-react';
import { Tooltip } from 'flowbite-react';

interface AppData {
    name?: string;
    domain?: string;
    title?: string;
    icon?: string | null;
    totalActiveTime?: number;
    totalUsageTime?: number;
    percentage?: number;
    type?: string;
    category?: string;
}

interface PolicyInfoProps {
    name: string;
    color: string;
    data?: AppData[];
}

const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const hDisplay = h > 0 ? h + "h " : "";
    const mDisplay = m > 0 ? m + "m " : "";
    const sDisplay = s > 0 && h === 0 ? s + "s" : "";
    return hDisplay + mDisplay + sDisplay || "0s";
}

const PolicyInfo = ({ name, color, data }: PolicyInfoProps) => {
    const { t } = useTranslation()
    
    const displayData = data || [];

    return (
        <div className="w-full bg-bg-base dark:bg-dark-dashboard-cards rounded-lg border border-gray-200 dark:border-gray-700 p-6 font-sans">
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
            <div className={`space-y-4`}>
                {displayData?.map((app, index) => (
                    <div key={index} className="flex items-center gap-4">
                        {app?.icon ? (
                            <img
                                src={`data:image/png;base64,${app?.icon}`}
                                alt={app?.name || app?.domain || app?.title}
                                className="w-8 h-8 rounded"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                {app?.type === 'APPLICATION' ? <AppWindow className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <div className="flex items-center gap-2 truncate pr-2">
                                    <Tooltip content={app?.title || app?.name || app?.domain || ''} placement="bottom">
                                        <span className="text-gray-700 dark:text-text-title-dark font-medium text-sm truncate cursor-pointer block max-w-[150px]">
                                            {app?.name || app?.domain || app?.title}
                                        </span>
                                    </Tooltip>
                                    
                                    {app?.type && (
                                        <span className="text-[10px] font-semibold tracking-wider text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                            {app.type}
                                        </span>
                                    )}
                                    {app?.category && (
                                        <span className={`text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded ${app.category === 'USEFUL' ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' : 'text-rose-600 bg-rose-100 dark:bg-rose-900/30'}`}>
                                            {app.category}
                                        </span>
                                    )}
                                </div>

                                {app?.percentage !== undefined ? (
                                    <span className="text-gray-600 dark:text-text-muted font-semibold shrink-0">{app.percentage}%</span>
                                ) : app?.totalUsageTime !== undefined ? (
                                    <span className="text-gray-600 dark:text-text-muted font-semibold shrink-0">{formatTime(app.totalUsageTime)}</span>
                                ) : null}
                            </div>

                            {/* Progress Bar (if percentage exists) */}
                            {app?.percentage !== undefined && (
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden mt-1">
                                    <div
                                        className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
                                        style={{ width: `${app.percentage}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default React.memo(PolicyInfo);
