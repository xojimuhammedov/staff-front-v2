import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import MyDivider from 'components/Atoms/MyDivider';
import Sidebar from './_components/Sidebar/Sidebar';
import MainContent from './_components/MainContent';
import { useLocation } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import { SidebarMenuType } from 'types/sidebar';


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

  const sidebar_menu: SidebarMenuType[] = [
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
        <MyBreadCrumb pageTitle={t('Create schedule rule')} items={breadCrumbs} />
      </div>
      <MyDivider />
      <div className="flex gap-6">
        <Sidebar sidebar_menu_type="simple" menus={sidebar_menu} />
        <MainContent />
      </div>
    </PageContentWrapper>
  );
};

export default CreateSchedulePage;
