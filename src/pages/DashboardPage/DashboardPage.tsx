import MyBreadCrumb from "components/Atoms/MyBreadCrumb";
import PageContentWrapper from "components/Layouts/PageContentWrapper";
import { useTranslation } from "react-i18next";
import DashboardCard from "./_components/DashboardCard";
import ProgressCard from "./_components/ProgressCard";
import AttendancesLine from "./_components/AttendancesLine";
import MyTailwindPicker from "components/Atoms/Form/MyTailwindDatePicker";
import { Calendar } from "lucide-react";
import { useDashboard } from "./hooks/useDashboard";
import AttendancesCard from "./_components/AttendancesCard";


import { CheckCircle2, XCircle } from 'lucide-react';

const DashboardPage = () => {
  const { t } = useTranslation();
  const breadCrumbs = [
    {
      label: t('Dashboard'),
      url: '#'
    }
  ];

  const { data, control, lineChartData, todayData, topEmployee, bottomEmployee } = useDashboard()

  return (
    <PageContentWrapper className="dark:bg-bg-dark-bg">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="headers-core dark:text-text-title-dark text-text-base">
            {t('Dashboard')}
          </h1>
          <MyBreadCrumb items={breadCrumbs} />
        </div>
        <div className="flex items-center w-[240px]">
          <MyTailwindPicker
            useRange={true}
            name='date'
            asSingle={false}
            control={control}
            placeholder={t('Today')}
            startIcon={<Calendar stroke="#9096A1" />}
          />
        </div>
      </div>
      <DashboardCard
        totalEmployees={data?.totalEmployees}
        newEmployeesCount={data?.newEmployeesCount}
        totalComputers={data?.totalComputers}
        newComputersCount={data?.newComputersCount}
        totalDepartments={data?.totalDepartments}
        newDepartmentsCount={data?.newDepartmentsCount}
        totalOrganizations={data?.totalOrganizations}
        newOrganizationsCount={data?.newOrganizationsCount}
      />
      <AttendancesCard
        overallEmployees={data?.totalEmployees}
        totalEmployees={todayData?.total}
        totalLate={todayData?.late}
        totalOnTime={todayData?.onTime}
        totalAbsent={todayData?.absent}
      />
      <div className="rounded-m bg-bg-base p-4 mt-8 shadow-base dark:bg-dark-dashboard-cards">
        <AttendancesLine
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
          icon={XCircle} title="Ineffective employees"
          topEmployee={bottomEmployee} />
      </div>
    </PageContentWrapper>
  );
};

export default DashboardPage;
