import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import MyDivider from 'components/Atoms/MyDivider';
import { useSearchParams } from 'react-router-dom';
import Stepper from './_components/Stepper';
import FormTable from './TableForm/FormTable';
import { SidebarMenuType } from 'types/sidebar';
import TableData from './_components/TableData';

const TablePage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const sidebar_menu: SidebarMenuType[] = [
    {
      title: t('Enter a table data details'),
      stepper_title: t('Table details'),
      items: []
    },
    {
      title: t('Select information for employees'),
      stepper_title: t('Table data'),
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
        {
          currentStep === 2 ? <TableData /> : <FormTable />
        }
      </div>
    </PageContentWrapper>
  );
};

export default TablePage;
