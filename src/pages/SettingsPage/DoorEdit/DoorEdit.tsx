import MyDivider from 'components/Atoms/MyDivider';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router-dom';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import { paramsStrToObj } from 'utils/helper';
import Stepper from '../_components/SettingForms/Stepper';
import FormDoorEdit from './_components/FormDoorEdit';
import FormDeviceEdit from './_components/FormDeviceEdit';
import EmployeeDragDrop from './_components/EmployeeDragDrop';

interface SidebarItem {
  icon: string;
  name: string;
  path: string;
  isSwitch: boolean;
}

interface SidebarMenu {
  title: string;
  stepper_title: string;
  items: SidebarItem[];
}

function DoorEdit() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const sidebar_menu: SidebarMenu[] = [
    {
      title: t('Enter a door name and description'),
      stepper_title: t('Door details'),
      items: []
    },
    {
      title: t('Select and pair with device'),
      stepper_title: t('Connect device'),
      items: []
    },
    {
      title: t('Create employees group and link to the door'),
      stepper_title: t('Add employees'),
      items: []
    }
  ];
  const breadCrumbs = [
    {
      label: t('Settings'),
      url: '#'
    }
  ];

  const currentStep: any = Number(searchParams.get('current-step')) || 1;
  const complete: boolean = currentStep === sidebar_menu.length ? true : false;

  const handleClick = async () => {
    const step = currentStep === sidebar_menu.length ? currentStep : currentStep + 1;

    searchParams.set('current-step', `${step}`);
    // searchParams.set('current-rule', `${get(sidebar_menu[step - 1], 'items[0].path', '')}`);
    setSearchParams(searchParams);
  };

  return (
    <PageContentWrapper>
      <div className="flex items-center justify-between">
        <MyBreadCrumb pageTitle={t('Settings')} items={breadCrumbs} />
      </div>
      <MyDivider />
      <div className="flex w-full gap-8">
        <Stepper complete={complete} currentStep={currentStep} steps={sidebar_menu} />
        {currentStep === 2 ? (
          <FormDeviceEdit handleClick={handleClick} />
        ) : currentStep === 3 ? (
          <EmployeeDragDrop />
        ) : (
          <FormDoorEdit handleClick={handleClick} />
        )}
      </div>
    </PageContentWrapper>
  );
}

export default DoorEdit;
