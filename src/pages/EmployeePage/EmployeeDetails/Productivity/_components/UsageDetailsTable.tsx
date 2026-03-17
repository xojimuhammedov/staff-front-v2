import React from 'react';
import { useTranslation } from 'react-i18next';

export interface UsageDetail {
    id: number;
    name: string;
    category: 'USEFUL' | 'UNUSEFUL' | 'NEUTRAL';
    type: 'APPLICATION' | 'WEBSITE';
    totalUsageTime: number;
}

const getCategoryStyles = (category: UsageDetail['category']) => {
    switch (category) {
        case 'USEFUL':
            return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700';
        case 'UNUSEFUL':
            return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700';
    }
};

const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const hDisplay = h > 0 ? h + "h " : "";
    const mDisplay = m > 0 ? m + "m " : "";
    const sDisplay = s > 0 && h === 0 ? s + "s" : "";
    return hDisplay + mDisplay + sDisplay || "0s";
}


const UsageDetailsTable: React.FC<{ data?: UsageDetail[] }> = ({ data }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white dark:bg-bg-dark-bg p-4 mt-6 sm:p-6 rounded-[12px] border dark:border-gray-700 shadow-lg w-full max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-text-title-dark mb-6">{t('Usage Details')}</h2>

            <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-700 py-3 text-sm font-medium text-gray-500 dark:text-text-subtle">
                <div className="px-4 text-gray-400 dark:text-text-title-dark">{t('App / Site Name')}</div>
                <div className="px-4 text-gray-400 dark:text-text-title-dark">{t('Category')}</div>
                <div className="px-4 text-gray-400 dark:text-text-title-dark">{t('Type')}</div>
                <div className="px-4 text-gray-400 dark:text-text-title-dark">{t('Total Usage Time')}</div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {data?.map((detail) => (
                    <div
                        key={detail.id}
                        className="py-3
                        grid grid-cols-4 lg:gap-0 
                        lg:items-center border-b dark:border-gray-700"
                    >
                        <div className="text-sm font-medium text-gray-800 dark:text-text-title-dark px-4">
                            {detail.name}
                        </div>

                        <div className="px-4">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getCategoryStyles(detail.category)}`}>
                                {t(detail.category)}
                            </span>
                        </div>
                        <div className="px-4">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border`}>
                                {t(detail.type)}
                            </span>
                        </div>

                        <div className="text-sm px-4">
                            <span className="text-gray-600 dark:text-text-title-dark font-medium lg:font-normal">{formatTime(detail.totalUsageTime)}</span>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsageDetailsTable;