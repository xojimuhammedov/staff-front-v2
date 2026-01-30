import React from 'react';
import AttendancesInfo from './_components/AttendancesInfo';
import { useDepartment } from './hooks/useDepartment';
import ProgressCard from 'pages/DashboardPage/_components/ProgressCard';
import DetailsInfo from './_components/DetailsInfo';
import PersonalCard from './_components/PersonalCard';
import Productivity from 'pages/EmployeePage/EmployeeDetails/View/_components/Productivity';
import { CheckCircle2, XCircle } from 'lucide-react';

const DepartmentInfo = () => {
    const { lineChartData, departmentInfo, topEmployee, bottomEmployee } = useDepartment()
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
            <div className="mt-8 flex w-full gap-6">
                <ProgressCard
                    topEmployee={topEmployee}
                    title='Effective employees'
                    icon={CheckCircle2}
                    iconBgColor="bg-green-100 dark:bg-green-900/30"
                    iconColor="text-green-600 dark:text-green-300"
                    isEffective={true}
                />
                <ProgressCard
                    iconBgColor="bg-red-100 dark:bg-red-900/30"
                    iconColor="text-red-600 dark:text-red-300"
                    isEffective={false}
                    icon={XCircle}
                    title="Ineffective employees"
                    topEmployee={bottomEmployee} />
            </div>
            {/* <div className="mt-8">
                <ProgressCard topEmployee={topEmployee} bottomEmployee={bottomEmployee} />
           </div> */}
        </div>
    );
}

export default DepartmentInfo;
