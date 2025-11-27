import { LogOut } from 'lucide-react';
import React from 'react';

// Define the shape of the component's props
interface ArrivalCardProps {
    averageArrival: string;
    statusText: string;
    statusClass: 'early' | 'late' | 'on-time'; // For styling
}

const AttendanceCard: React.FC<ArrivalCardProps> = ({
    averageArrival,
    statusText,
    statusClass,
}) => {
    // Determine the color based on the statusClass
    let statusTextColor = 'text-green-600'; // Default to early/on-time color
    if (statusClass === 'late') {
        statusTextColor = 'text-red-600';
    } else if (statusClass === 'on-time') {
        statusTextColor = 'text-blue-600';
    }

    return (
        <div className="bg-white p-4 rounded-[12px] shadow-lg border cursor-pointer">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-gray-500 text-base font-medium">
                    Average Arrival Time
                </h3>
                <LogOut color='green' />
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
                {averageArrival}
            </div>
            <p className={`text-sm text-gray-500`}>{statusText}</p>
        </div>
    );
};

export default AttendanceCard;