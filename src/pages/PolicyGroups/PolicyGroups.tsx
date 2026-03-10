import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import GroupTable from './_components/GroupTable';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PolicyGroups = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const breadCrumbs = [
    {
      label: t('Policy groups'),
      url: '#',
    },
  ];
  return (
    <PageContentWrapper>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="headers-core dark:text-text-title-dark text-text-base">
            {t('Policy groups')}
          </h1>
          <MyBreadCrumb items={breadCrumbs} />
        </div>
        <MyButton
          onClick={() => navigate('/policy/groups/create')}
          startIcon={<Plus />}
          variant='primary'
          className={`text-sm min-w-max [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
        >
          {t('Create group')}
        </MyButton>
      </div>
      <GroupTable />
    </PageContentWrapper>
  );
};

export default PolicyGroups;
