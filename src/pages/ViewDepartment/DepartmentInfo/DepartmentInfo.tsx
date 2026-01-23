import React from 'react';
import AttendancesInfo from './_components/AttendancesInfo';
import { useDepartment } from './hooks/useDepartment';
import ProgressCard from 'pages/DashboardPage/_components/ProgressCard';
import DetailsInfo from './_components/DetailsInfo';
import PersonalCard from './_components/PersonalCard';
import Productivity from 'pages/EmployeePage/EmployeeDetails/View/_components/Productivity';

const DepartmentInfo = () => {
    const { lineChartData, control, departmentInfo, topEmployee, bottomEmployee } = useDepartment()
    return (
        <div>
            <DetailsInfo departmentInfo={departmentInfo} />
            <div className='flex gap-8 items-center'>
                <PersonalCard data={departmentInfo} />
                <Productivity />
            </div>
            <div className="rounded-m bg-bg-base p-4 mt-8 shadow-base dark:bg-dark-dashboard-cards">
                <AttendancesInfo
                    absent={lineChartData.absents}
                    late={lineChartData.lates}
                    date={lineChartData.dates}
                    onTime={lineChartData.onTimes}
                />
            </div>
           <div className="mt-8">
                <ProgressCard topEmployee={topEmployee} bottomEmployee={bottomEmployee} />
           </div>
        </div>
    );
}

export default DepartmentInfo;
