import LineChart from 'components/Molecules/LineChart';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Productivity = () => {
    const { t } = useTranslation()
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const labels = weekdays.map((day) => t(day).slice(0, 3));
    return (
        <div className="w-3/5 bg-bg-base dark:bg-dark-dashboard-cards p-6 shadow-lg rounded-lg">
            <h2 className="text-lg font-semibold mb-6 text-gray-800 dark:text-text-title-dark">
                {t("Weekly Activity")}
            </h2>
            <LineChart 
                data={[10, 40, 32, 55, 20, 42, 35]}
                labels={labels}
                height={300}
                areaColor="#FFEB3B"   // sariq area
                lineColor="#FBC02D"
            />
        </div>
    );
}

export default React.memo(Productivity);
