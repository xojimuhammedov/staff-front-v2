import React from 'react';

// Define the shape of the component's props
interface ArrivalCardProps {
    averageArrival: string;
    statusText?: string;
    title: string;
    statusClass?: 'early' | 'late' | 'on-time'; // For styling
    icon?: any;
}

const AttendanceCard: React.FC<ArrivalCardProps> = ({
    averageArrival,
    statusText,
    statusClass,
    title,
    icon
}) => {
    // Determine the color based on the statusClass
    let statusTextColor = 'text-green-600'; // Default to early/on-time color
    if (statusClass === 'late') {
        statusTextColor = 'text-red-600';
    } else if (statusClass === 'early') {
        statusTextColor = 'text-blue-600';
    }

    return (
        <div className="bg-white p-4 rounded-[12px] shadow-lg border cursor-pointer">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-gray-500 text-base font-medium">
                    {title}
                </h3>
                {icon}
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
                {averageArrival}
            </div>
            {statusText && statusClass && (
                <p className={`text-sm text-gray-500`}>{statusText} minutes {statusClass}</p>
            )}
        </div>
    );
};

export default AttendanceCard;
