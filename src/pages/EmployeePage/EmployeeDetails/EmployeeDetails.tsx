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
        //   variant="secondary"
          startIcon={<ArrowLeft />}
          className={`
                text-sm w-[230px]
                bg-white text-gray-800 border border-gray-300 hover:bg-gray-100
                dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700
               [&_svg]:stroke-gray-600 dark:[&_svg]:stroke-gray-300
                    `}
        >
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
