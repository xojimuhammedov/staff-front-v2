import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import MyDivider from 'components/Atoms/MyDivider';
import { useSearchParams } from 'react-router-dom';
import Stepper from './_components/TableForm/Stepper';
import FormDoor from './_components/TableForm/FormDoor';
import { SidebarMenuType } from 'types/sidebar';

const TablePage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  
  const sidebar_menu: SidebarMenuType[] = [
    {
      title: t('Enter a door name and description'),
      stepper_title: t('Door details'),
      items: []
    },
    {
      title: t('Select and pair with device'),
      stepper_title: t('Connect device'),
      items: []
    }
  ];

  const breadCrumbs = [
    {
      label: t('Table'),
      url: '#'
    }
  ];

  const currentStep: any = Number(searchParams.get('current-step')) || 1;
  const complete: boolean = currentStep === sidebar_menu.length ? true : false;

  return (
    <PageContentWrapper>
      <div className="flex items-center justify-between">
        <MyBreadCrumb pageTitle={t('Table')} items={breadCrumbs} />
      </div>
      <MyDivider />
      <div className="flex w-full gap-8">
        <Stepper complete={complete} currentStep={currentStep} steps={sidebar_menu} />
        <FormDoor />
      </div>
    </PageContentWrapper>
  );
};

export default TablePage;
