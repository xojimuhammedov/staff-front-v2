import MyBreadCrumb from "components/Atoms/MyBreadCrumb";
import PageContentWrapper from "components/Layouts/PageContentWrapper";
import { useTranslation } from "react-i18next";
import DashboardCard from "./_components/DashboardCard";
import ProgressCard from "./_components/ProgressCard";

const DashboardPage = () => {
  const { t } = useTranslation();
  const breadCrumbs = [
    {
      label: t('Dashboard'),
      url: '#'
    }
  ];

  return (
    <PageContentWrapper className="dark:bg-bg-dark-bg">
      <div className="flex flex-col">
        <h1 className="headers-core dark:text-text-title-dark text-text-base">
          {t('Dashboard')}
        </h1>
        <MyBreadCrumb items={breadCrumbs} />
      </div>
      <DashboardCard />
      <div className="grid grid-cols-2 mt-8 gap-6">
        <ProgressCard />
        <ProgressCard />
      </div>
    </PageContentWrapper>
  );
};

export default DashboardPage;
