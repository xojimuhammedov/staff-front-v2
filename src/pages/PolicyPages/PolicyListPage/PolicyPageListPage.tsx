import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PolicyList from './_components/PolicyList';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MyInput } from '@/components/Atoms/Form';
import { KeyTypeEnum } from '@/enums/key-type.enum';
import { useSearch } from '@/hooks/useSearch';

const PolicyPageListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const { search, handleSearch, setSearch } = useSearch();
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
        <div className='flex items-center gap-4'>
          <MyInput
            onKeyUp={(event) => {
              if (event.key === KeyTypeEnum.enter) {
                handleSearch();
              } else {
                setSearch((event.target as HTMLInputElement).value);
              }
            }}
            defaultValue={search}
            startIcon={<Search className="stroke-text-muted" onClick={handleSearch} />}
            className="dark:bg-bg-input-dark"
            placeholder={t('Search...')}
          />
          <MyButton
            onClick={() => navigate('/policy/create')}
            allowedRoles={['ADMIN', 'HR']}
            startIcon={<Plus />}
            variant='primary'
            className={`text-sm min-w-max [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}>
            {t('Create a policy')}
          </MyButton>
        </div>
      </div>
      <PolicyList />
    </PageContentWrapper>
  );
};

export default PolicyPageListPage;
