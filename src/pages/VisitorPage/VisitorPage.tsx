import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import VisitorTable from './_components/VisitorTable';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VisitorPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const breadCrumbs = [
    {
      label: t('Visitor'),
      url: '#',
    },
  ];

  return (
    <PageContentWrapper>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="headers-core dark:text-text-title-dark text-text-base">{t('Visitor')}</h1>
          <MyBreadCrumb items={breadCrumbs} />
        </div>
        <MyButton
          startIcon={<Plus />}
          onClick={() => {
            navigate('/visitor/create');
          }}
          allowedRoles={['ADMIN', 'HR', 'GUARD']}
          className={`
    mt-3 text-sm w-[180px]
    bg-white text-gray-800 border border-gray-300 hover:bg-gray-100
    dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700
    [&_svg]:stroke-gray-600 dark:[&_svg]:stroke-gray-300
  `}
        >
          {t('Create visitor')}
        </MyButton>
      </div>
      <VisitorTable />
    </PageContentWrapper>
  );
};

export default VisitorPage;
