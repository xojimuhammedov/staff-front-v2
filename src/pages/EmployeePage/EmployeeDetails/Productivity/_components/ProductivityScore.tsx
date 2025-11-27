import React from 'react';

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
    // Calculate the percentage for the progress bar
    const progressPercentage = (score / maxScore) * 100;

    // A simple lightning bolt icon (using SVG)
    const LightningIcon = (
        <div className="bg-green-100 p-2 rounded-lg">
            <svg
                className="w-6 h-6 text-green-600"
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
        <div className="bg-[#FFF8E1] p-6 rounded-[12px] shadow-lg w-96 border">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-[#FBC02D] text-base font-medium">
                        Total Productivity Score
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Based on app usage analysis
                    </p>
                </div>
                {LightningIcon}
            </div>

            <div className='mb-8'>
                <div className="text-5xl font-bold text-green-600 mb-1">
                    {score}
                </div>
                <p className="text-gray-400 text-sm mb-4">
                    {description}
                </p>
            </div>

            {/* Progress Bar */}
            <div className='mb-4'>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                        className="bg-[#FBC02D] h-2 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <p className="text-gray-400 text-sm font-medium">
                    {progressBarText}
                </p>
            </div>
        </div>
    );
};

export default ProductivityScoreCard;