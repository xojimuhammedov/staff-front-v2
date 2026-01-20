import React from 'react';
import { useTranslation } from 'react-i18next';

// Ma'lumotlar modeli va funksiyalari (avvalgidek bir xil)
export interface UsageDetail {
    id: number;
    appName: string;
    category: 'Productive' | 'Unproductive' | 'Neutral';
    totalUsageTime: string;
    activityScore: number;
    scoreColor: 'productive' | 'unproductive' | 'neutral';
}

const usageData: UsageDetail[] = [
    { id: 1, appName: 'VS Code', category: 'Productive', totalUsageTime: '14h 10m', activityScore: 95, scoreColor: 'productive' },
    { id: 2, appName: 'Outlook', category: 'Productive', totalUsageTime: '9h 00m', activityScore: 88, scoreColor: 'productive' },
    { id: 3, appName: 'Jira/Confluence', category: 'Productive', totalUsageTime: '5h 00m', activityScore: 92, scoreColor: 'productive' },
    { id: 4, appName: 'YouTube', category: 'Unproductive', totalUsageTime: '3h 45m', activityScore: 55, scoreColor: 'unproductive' },
    { id: 5, appName: 'Slack', category: 'Neutral', totalUsageTime: '3h 00m', activityScore: 80, scoreColor: 'neutral' },
    { id: 6, appName: 'Social Media Sites', category: 'Unproductive', totalUsageTime: '2h 15m', activityScore: 40, scoreColor: 'unproductive' },
];

// Yordamchi funksiyalar (oldindan olingan)
const getCategoryStyles = (category: UsageDetail['category']) => {
    switch (category) {
        case 'Productive':
            return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700';
        case 'Unproductive':
            return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700';
        case 'Neutral':
            return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-text-title-dark border-gray-300 dark:border-gray-600';
    }
};

const getScoreStyles = (scoreColor: UsageDetail['scoreColor']) => {
    switch (scoreColor) {
        case 'productive':
            return 'bg-[#FBC02D] dark:bg-yellow-500';
        case 'unproductive':
            return 'bg-gray-400 dark:bg-gray-600';
        case 'neutral':
            return 'bg-[#FBC02D] dark:bg-yellow-500';
    }
};

const UsageDetailsTable: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-white dark:bg-bg-dark-bg p-4 mt-6 sm:p-6 rounded-[12px] border dark:border-gray-700 shadow-lg w-full max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-text-title-dark mb-6">{t('Usage Details')}</h2>

            {/* Jadvallarning ustun sarlavhalari - faqat Desktopda ko'rinadi */}
            <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-700 py-3 text-sm font-medium text-gray-500 dark:text-text-subtle">
                <div className="px-4 text-gray-400 dark:text-text-subtle">{t('App / Site Name')}</div>
                <div className="px-4 text-gray-400 dark:text-text-subtle">{t('Category')}</div>
                <div className="px-4 text-gray-400 dark:text-text-subtle">{t('Total Usage Time')}</div>
                <div className="px-4 text-gray-400 dark:text-text-subtle">{t('Activity Score')}</div>
            </div>

            {/* Ma'lumotlar qatorlari */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {usageData.map((detail) => (
                    <div
                        key={detail.id}
                        className="py-3
                        grid grid-cols-4 lg:gap-0 
                        lg:items-center border-b dark:border-gray-700"
                    >
                        <div className="text-sm font-medium text-gray-800 dark:text-text-title-dark px-4">
                            {detail.appName}
                        </div>

                        <div className="px-4">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getCategoryStyles(detail.category)}`}>
                                {t(detail.category)}
                            </span>
                        </div>

                        <div className="text-sm px-4">
                            <span className="text-gray-600 dark:text-text-title-dark font-medium lg:font-normal">{detail.totalUsageTime}</span>
                        </div>

                        <div className="flex items-center text-sm px-4">
                            <span className="font-semibold text-gray-800 dark:text-text-title-dark">{detail.activityScore}</span>
                            <div className="w-full lg:w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 ml-4">
                                <div
                                    className={`${getScoreStyles(detail.scoreColor)} h-1.5 rounded-full`}
                                    style={{ width: `${detail.activityScore}%` }}
                                ></div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsageDetailsTable;