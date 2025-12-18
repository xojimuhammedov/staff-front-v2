import MyBreadCrumb from "components/Atoms/MyBreadCrumb";
import PageContentWrapper from "components/Layouts/PageContentWrapper";
import { useTranslation } from "react-i18next";
import DashboardCard from "./_components/DashboardCard";
import ProgressCard from "./_components/ProgressCard";
import { useGetAllQuery } from "hooks/api";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import AttendancesLine from "./_components/AttendancesLine";
import { get } from "lodash";
import dayjs from "dayjs";
import MyTailwindPicker from "components/Atoms/Form/MyTailwindDatePicker";
import { Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMemo } from "react";

interface DashboardData {
  totalEmployees?: number;
  totalComputers?: number;
  totalDepartments?: number;
  totalOrganizations?: number;
}

interface chartData {
  absent?: number;
  late?: number;
  onTime?: number;
  date?: string
}

interface LineChartData {
  employeeCount?: number;
  data: chartData[]
}

const DashboardPage = () => {
  const { t } = useTranslation();
  const breadCrumbs = [
    {
      label: t('Dashboard'),
      url: '#'
    }
  ];
  const { control, watch } = useForm()

  const paramsValue = watch('date') ? {
    startDate: dayjs(watch('date')?.startDate)?.format("YYYY-MM-DD"),
    endDate: dayjs(watch('date')?.endDate)?.format("YYYY-MM-DD")
  } : {
    endDate: dayjs().format("YYYY-MM-DD"),
    startDate: dayjs().subtract(7, 'day').format("YYYY-MM-DD"),
  }

  const { data } = useGetAllQuery<DashboardData>({
    key: KEYS.dashbord,
    url: URLS.dashbord,
    params: {
      ...paramsValue
    }
  })

  const { data: chartData } = useGetAllQuery<LineChartData>({
    key: KEYS.dashboardLineChart,
    url: URLS.dashboardLineChart,
    params: {
      ...paramsValue
    }
  });

  const lineChartData = useMemo(() => {
    const items = get(chartData, 'data', []) as chartData[];

    const dates: string[] = [];
    const absents: number[] = [];
    const lates: number[] = [];
    const onTimes: number[] = [];

    items.forEach((item) => {
      dates.push(item.date || '');
      absents.push(item.absent || 0);
      lates.push(item.late || 0);
      onTimes.push(item.onTime || 0);
    });

    return { dates, absents, lates, onTimes };
  }, [chartData]);


  return (
    <PageContentWrapper className="dark:bg-bg-dark-bg">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="headers-core dark:text-text-title-dark text-text-base">
            {t('Dashboard')}
          </h1>
          <MyBreadCrumb items={breadCrumbs} />
        </div>
        <div className="flex items-center w-[230px]">
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
        totalComputers={data?.totalComputers}
        totalDepartments={data?.totalDepartments}
        totalOrganizations={data?.totalOrganizations}
      />
      <div className="rounded-m bg-bg-base p-4 mt-8 shadow-base dark:bg-dark-dashboard-cards">
        <AttendancesLine
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
    </PageContentWrapper>
  );
};

export default DashboardPage;
