import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import MyDivider from 'components/Atoms/MyDivider';
import Sidebar from './_components/Sidebar/Sidebar';
import MainContent from './_components/MainContent';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditPolicyRulePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const breadCrumbs = [
    {
      label: t('Schedule'),
      url: '#',
    },
    {
      label: t('Edit rule'),
      url: '#',
    },
  ];

  return (
    <PageContentWrapper>
      <div className="flex items-center justify-between">
        <MyBreadCrumb pageTitle={t('Edit schedule')} items={breadCrumbs} />
        <MyButton
          onClick={() => navigate('/settings?current-setting=schedule')}
          variant="primary"
          startIcon={<ArrowLeft />}
          className={`text-sm min-w-max [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
        >
          {t('Back to schedule list')}
        </MyButton>
      </div>
      <MyDivider />
      <div className="flex gap-6">
        <Sidebar sidebar_menu_type="simple" />
        <MainContent />
      </div>
    </PageContentWrapper>
  );
};

export default EditPolicyRulePage;
