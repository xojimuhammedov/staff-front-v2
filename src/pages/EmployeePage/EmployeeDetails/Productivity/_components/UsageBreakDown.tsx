import React from 'react';

interface UsageBreakdownCardProps {
    productivePercentage: number;
    productiveTime: string;
    unproductiveTime: string;
}

const UsageBreakdownCard: React.FC<UsageBreakdownCardProps> = ({
    productivePercentage,
    productiveTime,
    unproductiveTime,
}) => {
    const unproductivePercentage = 100 - productivePercentage;

    const circumference = 2 * Math.PI * 40;
    const productiveDashoffset = circumference - (productivePercentage / 100) * circumference;

    return (
        <div className="bg-white p-6 rounded-[12px] shadow-lg w-full max-w-2xl border">
            <h3 className="text-gray-800 text-lg font-semibold mb-4">Usage Breakdown</h3>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="relative flex items-center justify-center w-36 h-36 md:w-48 md:h-48">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="16"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#FBC02D" // Yellow-500 for the productive part
                            strokeWidth="16"
                            strokeDasharray={circumference}
                            strokeDashoffset={productiveDashoffset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-gray-800">
                            {productivePercentage}%
                        </span>
                        <span className="text-sm text-gray-500">
                            Productive
                        </span>
                    </div>
                </div>

                <div className="md:w-auto">
                    <div className="mb-4">
                        <div className="flex items-center mb-1">
                            <span className="w-3 h-3 rounded-full bg-[#FBC02D] mr-2"></span>
                            <span className="text-gray-700 font-medium">Useful Apps & Websites</span>
                        </div>
                        <p className="text-gray-600 ml-5">{productiveTime}</p>
                        <p className="text-gray-500 text-sm ml-5">{productivePercentage}% of total time</p>
                    </div>

                    <div>
                        <div className="flex items-center mb-1">
                            <span className="w-3 h-3 rounded-full bg-gray-300 mr-2"></span>
                            <span className="text-gray-700 font-medium">Unproductive Apps & Sites</span>
                        </div>
                        <p className="text-gray-600 ml-5">{unproductiveTime}</p>
                        <p className="text-gray-500 text-sm ml-5">{unproductivePercentage}% of total time</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsageBreakdownCard;