import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PolicyList from './_components/SchedulList';

const SchedulePageListPage = () => {
  const { t } = useTranslation();
  const breadCrumbs = [
    {
      label: t('Schedule'),
      url: '#'
    }
  ];

  return (
    <PageContentWrapper>
      <div className="flex flex-col">
        <h1 className="headers-core dark:text-text-title-dark text-text-base">
          {t('Schedule')}
        </h1>
        <MyBreadCrumb items={breadCrumbs} />
      </div>
      <MyDivider />
      <PolicyList />
    </PageContentWrapper>
  );
};

export default SchedulePageListPage;
