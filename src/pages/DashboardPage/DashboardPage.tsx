import MyBreadCrumb from "components/Atoms/MyBreadCrumb";
import PageContentWrapper from "components/Layouts/PageContentWrapper";
import { useTranslation } from "react-i18next";
import DashboardCard from "./_components/DashboardCard";
import ProgressCard from "./_components/ProgressCard";
import { useGetAllQuery } from "hooks/api";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";

interface DashboardData {
  totalEmployees?: number;
  totalComputers?: number;
  totalDepartments?: number;
  totalOrganizations?: number;
}

const DashboardPage = () => {
  const { t } = useTranslation();
  const breadCrumbs = [
    {
      label: t('Dashboard'),
      url: '#'
    }
  ];

  const { data } = useGetAllQuery<DashboardData>({
    key: KEYS.dashbord,
    url: URLS.dashbord,
    params: {}
  })


  return (
    <PageContentWrapper className="dark:bg-bg-dark-bg">
      <div className="flex flex-col">
        <h1 className="headers-core dark:text-text-title-dark text-text-base">
          {t('Dashboard')}
        </h1>
        <MyBreadCrumb items={breadCrumbs} />
      </div>
      <DashboardCard
        totalEmployees={data?.totalEmployees}
        totalComputers={data?.totalComputers}
        totalDepartments={data?.totalDepartments}
        totalOrganizations={data?.totalOrganizations}
      />
      <div className="grid grid-cols-2 mt-8 gap-6">
        <ProgressCard />
        <ProgressCard />
      </div>
    </PageContentWrapper>
  );
};

export default DashboardPage;
