import React from 'react';

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
            return 'bg-green-100 text-green-700 border-green-300';
        case 'Unproductive':
            return 'bg-red-100 text-red-700 border-red-300';
        case 'Neutral':
            return 'bg-gray-100 text-gray-700 border-gray-300';
    }
};

const getScoreStyles = (scoreColor: UsageDetail['scoreColor']) => {
    switch (scoreColor) {
        case 'productive':
            return 'bg-yellow-500';
        case 'unproductive':
            return 'bg-gray-400';
        case 'neutral':
            return 'bg-yellow-500';
    }
};

const UsageDetailsTable: React.FC = () => {
    return (
        <div className="bg-white p-4 mt-6 sm:p-6 rounded-[12px] border shadow-lg w-full max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Usage Details</h2>

            {/* Jadvallarning ustun sarlavhalari - faqat Desktopda ko'rinadi */}
            <div className="grid grid-cols-4 border-b border-gray-200 py-3 text-sm font-medium text-gray-500">
                <div className="px-4 text-gray-400">App / Site Name</div>
                <div className="px-4 text-gray-400">Category</div>
                <div className="px-4 text-gray-400">Total Usage Time</div>
                <div className="px-4 text-gray-400">Activity Score</div>
            </div>

            {/* Ma'lumotlar qatorlari */}
            <div className="divide-y divide-gray-200">
                {usageData.map((detail) => (
                    <div
                        key={detail.id}
                        className="py-3
                        grid grid-cols-4 lg:gap-0 
                        lg:items-center border-b"
                    >
                        <div className="text-sm font-medium text-gray-800 px-4">
                            {detail.appName}
                        </div>

                        <div className="px-4">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getCategoryStyles(detail.category)}`}>
                                {detail.category}
                            </span>
                        </div>

                        <div className="text-sm px-4">
                            <span className="text-gray-600 font-medium lg:font-normal">{detail.totalUsageTime}</span>
                        </div>

                        <div className="flex items-center text-sm px-4">
                            <span className="font-semibold text-gray-800">{detail.activityScore}</span>
                            <div className="w-full lg:w-20 bg-gray-200 rounded-full h-1.5 ml-4">
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