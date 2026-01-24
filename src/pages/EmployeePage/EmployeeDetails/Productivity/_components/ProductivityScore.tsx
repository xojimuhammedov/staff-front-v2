import React from 'react';
import { useTranslation } from 'react-i18next';

interface ProductivityScoreCardProps {
    score: number;
    maxScore?: number; // Optional, defaults to 100
    description: string;
    progressBarText: string;
}

const ProductivityScoreCard: React.FC<ProductivityScoreCardProps> = ({
    score,
    maxScore = 100,
    description,
    progressBarText,
}) => {
    const { t } = useTranslation();
    // Calculate the percentage for the progress bar
    const progressPercentage = (score / maxScore) * 100;

    // A simple lightning bolt icon (using SVG)
    const LightningIcon = (
        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
            <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                />
            </svg>
        </div>
    );

    return (
        <div className="bg-[#FFF8E1] dark:bg-bg-dark-bg p-6 rounded-[12px] shadow-lg w-96 border dark:border-gray-700">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-[#FBC02D] dark:text-yellow-400 text-base font-medium">
                        {t('Total Productivity Score')}
                    </h3>
                    <p className="text-gray-500 dark:text-text-title-dark text-sm">
                        {t('Based on app usage analysis')}
                    </p>
                </div>
                {LightningIcon}
            </div>

            <div className='mb-8'>
                <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {score}
                </div>
                <p className="text-gray-400 dark:text-text-title-dark text-sm mb-4">
                    {description}
                </p>
            </div>

            {/* Progress Bar */}
            <div className='mb-4'>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div
                        className="bg-[#FBC02D] dark:bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <p className="text-gray-400 dark:text-text-title-dark text-sm font-medium">
                    {progressBarText}
                </p>
            </div>
        </div>
    );
};

export default ProductivityScoreCard;