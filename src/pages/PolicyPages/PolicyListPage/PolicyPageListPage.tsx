import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PolicyList from './_components/PolicyList';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PolicyPageListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const breadCrumbs = [
    {
      label: t('Policy'),
      url: '#'
    }
  ];

  return (
    <PageContentWrapper>
      <div className='flex items-center justify-between'>
        <div className="flex flex-col">
          <h1 className="headers-core dark:text-text-title-dark text-text-base">
            {t('Policy')}
          </h1>
          <MyBreadCrumb items={breadCrumbs} />
        </div>
        <MyButton
          onClick={() => navigate('/policy/create')}
          startIcon={<Plus />}
          allowedRoles={['ADMIN', 'HR']}
          variant="primary"
            className={`
                text-sm w-[170px]
                bg-white text-gray-800 border border-gray-300 hover:bg-gray-100
                dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700
                [&_svg]:stroke-gray-600 dark:[&_svg]:stroke-gray-300
              `}>
          {t('Create a policy')}
        </MyButton>
      </div>
      <PolicyList />
    </PageContentWrapper>
  );
};

export default PolicyPageListPage;
