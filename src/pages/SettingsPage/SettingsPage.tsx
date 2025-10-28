import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import MyDivider from 'components/Atoms/MyDivider';
import Sidebar from './_components/Sidebar/Sidebar';
import MainContent from './_components/MainContent';

const SettingsPage = () => {
  const { t } = useTranslation();
  const breadCrumbs = [
    {
      label: t('Settings'),
      url: '#'
    }
  ];

  return (
    <PageContentWrapper>
      <div className="flex items-center justify-between">
        <MyBreadCrumb pageTitle={t('Settings')} items={breadCrumbs} />
      </div>
      <MyDivider />
      <div className="flex gap-6">
        <Sidebar sidebar_menu_type="simple" />
        <MainContent />
      </div>
    </PageContentWrapper>
  );
};

export default SettingsPage;
