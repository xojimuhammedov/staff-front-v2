import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import { MyInput } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { KeyTypeEnum } from 'enums/key-type.enum';
import { useSearch } from 'hooks/useSearch';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import EmployeeList from 'pages/EmployeePage/_components/EmployeeList';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import { searchValue } from 'types/search';

function WhiteList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const parsedSearchValue: searchValue = paramsStrToObj(location.search);
  const { search, setSearch, handleSearch } = useSearch();

  const breadCrumbs = [
    {
      label: t('Employees'),
      url: '/employees',
    },
    {
      label: t('White list'),
      url: '#',
    },
  ];

  return (
    <PageContentWrapper>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="headers-core dark:text-text-title-dark text-text-base">{t('White list')}</h1>
          <MyBreadCrumb items={breadCrumbs} />
        </div>

        <div className="flex items-center gap-4">
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
            onClick={() => navigate('/employees/create')}
            allowedRoles={['ADMIN', 'HR']}
            startIcon={<Plus />}
            variant="primary"
            className="text-sm min-w-max [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300"
          >
            {t('Create an employee')}
          </MyButton>

          <MyButton
            onClick={() => navigate('/employees')}
            variant="primary"
            startIcon={<ArrowLeft />}
            className="text-sm min-w-max [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300"
          >
            {t('Back to employees list')}
          </MyButton>
        </div>
      </div>

      <EmployeeList searchValue={parsedSearchValue} />
    </PageContentWrapper>
  );
}

export default WhiteList;
