import React from 'react';
import { useTranslation } from 'react-i18next';

interface ArrivalCardProps {
  averageArrival: string;
  statusText?: string;               
  title: string;                   
  statusClass?: 'early' | 'late' | 'on-time';
  icon?: React.ReactNode;
}

const AttendanceCard: React.FC<ArrivalCardProps> = ({
  averageArrival,
  statusText,
  statusClass,
  title,
  icon,
}) => {
  const { t } = useTranslation();

  let statusTextColor = 'text-green-600';
  let darkStatusTextColor = 'dark:text-green-400';
  
  if (statusClass === 'late') {
    statusTextColor = 'text-red-600';
    darkStatusTextColor = 'dark:text-red-400';
  } else if (statusClass === 'early') {
    statusTextColor = 'text-blue-600';
    darkStatusTextColor = 'dark:text-blue-400';
  }

  return (
    <div className="bg-white dark:bg-bg-dark-bg p-4 rounded-[12px] shadow-base border dark:border-gray-700 cursor-pointer">
      <div className="flex justify-between items-start mb-2 gap-1">
        <h3 className="text-gray-500 dark:text-text-title-dark text-sm font-medium">
          {title}
        </h3>
        {icon}
      </div>

      <div className="text-xl font-bold text-gray-900 dark:text-text-title-dark mb-1">
        {averageArrival}
      </div>

      {statusText && statusClass && (
        <p className={`text-sm dark:text-white`}>
          {statusText} {t(statusClass)}
        </p>
      )}
    </div>
  );
};

export default AttendanceCard;
