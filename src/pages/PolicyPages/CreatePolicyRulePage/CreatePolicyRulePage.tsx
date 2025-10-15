import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyButton from 'components/Atoms/MyButton/MyButton';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
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

const CreatePolicyRulePage = () => {
  const { t } = useTranslation();
  const location = useLocation()
  const router: any = paramsStrToObj(location?.search)
  const breadCrumbs = [
    {
      label: t('Security Policy'),
      url: '#'
    },
    {
      label: t('Create rule'),
      url: '#'
    }
  ];

  const sidebar_menu: SidebarMenu[] = [
    {
      title: t('General info'),
      stepper_title: t('Schedule details'),
      items: [
        {
          icon: 'Settings2',
          name: t('Schedule and Politics details'),
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
        {/* <div className="flex items-center gap-4">
          <MyButton variant="secondary">{t('Reset default settings')}</MyButton>
          <MyButton variant="secondary" disabled startIcon={<Save />}>
            {t('Save changes')}
          </MyButton>
        </div> */}
      </div>
      <MyDivider />
      <div className="flex gap-6">
        <Sidebar menus={sidebar_menu} />
        <MainContent />
      </div>
    </PageContentWrapper>
  );
};

export default CreatePolicyRulePage;
