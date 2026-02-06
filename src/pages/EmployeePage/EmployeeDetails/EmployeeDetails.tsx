import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import Sidebar from './_components/Sidebar/Sidebar';
import Button from 'components/Atoms/MyButton';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainContent from './_components/MainContent';

const EmployeeDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const breadCrumbs = [
    {
      label: t('Controlled employees'),
      url: '#',
    },
  ];
  return (
    <PageContentWrapper>
      <div className="flex items-center justify-between">
        <MyBreadCrumb pageTitle={t('Controlled employees')} items={breadCrumbs} />
        <Button
          onClick={() => navigate('/employees')}
          startIcon={<ArrowLeft />}
          variant="primary"
          className={`text-sm min-w-max [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}>
          {t('Back to employees list')}
        </Button>
      </div>
      <MyDivider />
      <div className="flex gap-6">
        <Sidebar sidebar_menu_type="simple" />
        <MainContent />
      </div>
    </PageContentWrapper>
  );
};

export default EmployeeDetails;
