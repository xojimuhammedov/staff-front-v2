import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import EmployeeList from './_components/EmployeeList';

function EmployeePage() {
  const { t } = useTranslation();
  const breadCrumbs = [
    {
      label: t('Employees'),
      url: '#'
    }
  ];
  return (
    <PageContentWrapper>
      <div className="flex flex-col">
        <h1 className="headers-core dark:text-text-title-dark text-text-base">
          {t('Employees')}
        </h1>
        <MyBreadCrumb items={breadCrumbs} />
      </div>
      <MyDivider />
      <EmployeeList />
    </PageContentWrapper>
  );
}

export default EmployeePage
