import React from 'react';
import AttendancesInfo from './_components/AttendancesInfo';
import { useDepartment } from './hooks/useDepartment';
import ProgressCard from 'pages/DashboardPage/_components/ProgressCard';
import DetailsInfo from './_components/DetailsInfo';
import PersonalCard from './_components/PersonalCard';

const DepartmentInfo = () => {
    const { lineChartData, control, departmentInfo } = useDepartment()
    return (
        <div>
            <DetailsInfo departmentInfo={departmentInfo} />
            <PersonalCard data={departmentInfo} />
            <div className="rounded-m bg-bg-base p-4 mt-8 shadow-base dark:bg-dark-dashboard-cards">
                <AttendancesInfo
                    absent={lineChartData.absents}
                    late={lineChartData.lates}
                    date={lineChartData.dates}
                    onTime={lineChartData.onTimes}
                />
            </div>
            <div className="grid grid-cols-2 mt-8 gap-6">
                <ProgressCard />
                <ProgressCard />
            </div>
        </div>
    );
}

export default DepartmentInfo;
