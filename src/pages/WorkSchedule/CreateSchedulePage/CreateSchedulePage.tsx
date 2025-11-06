import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import MyDivider from 'components/Atoms/MyDivider';
import Sidebar from './_components/Sidebar/Sidebar';
import MainContent from './_components/MainContent';
import { useLocation } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';

interface SidebarItem {
  icon: string;
  name: string;
  path: string;
  isSwitch: boolean;
  disabled: boolean
}

interface SidebarMenu {
  title: string;
  stepper_title: string;
  items: SidebarItem[];
}

const CreateSchedulePage = () => {
  const { t } = useTranslation();
  const location = useLocation()
  const router: any = paramsStrToObj(location?.search)
  const breadCrumbs = [
    {
      label: t('Schedule detail'),
      url: '#'
    },
  ];

  const sidebar_menu: SidebarMenu[] = [
    {
      title: t('General info'),
      stepper_title: t('Schedule details'),
      items: [
        {
          icon: 'Settings2',
          name: t('Schedule details'),
          path: 'general-details',
          isSwitch: false,
          disabled: false,
        },
        {
          icon: 'Settings2',
          name: t('Employee groups'),
          path: 'employee-groups',
          isSwitch: false,
          disabled: router?.policyId ? false : true,
        }
      ]
    }
  ];

  return (
    <PageContentWrapper>
      <div className="flex items-center justify-between">
        <MyBreadCrumb pageTitle={t('Create policy rule')} items={breadCrumbs} />
      </div>
      <MyDivider />
      <div className="flex gap-6">
        <Sidebar menus={sidebar_menu} />
        <MainContent />
      </div>
    </PageContentWrapper>
  );
};

export default CreateSchedulePage;
