import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import VisitorTable from './_components/VisitorTable';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { KeyTypeEnum } from 'enums/key-type.enum';
import { MyInput } from 'components/Atoms/Form';
import { useSearch } from 'hooks/useSearch';

const VisitorPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search, setSearch, handleSearch } = useSearch();
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
            startIcon={<Plus />}
            onClick={() => {
              navigate('/visitor/create');
            }}
            allowedRoles={['ADMIN', 'HR', 'GUARD', 'DEPARTMENT_LEAD']}
            variant='primary'
            className={`text-sm min-w-max [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}>
            {t('Create visitor')}
          </MyButton>
        </div>
      </div>
      <VisitorTable />
    </PageContentWrapper>
  );
};

export default VisitorPage;
