import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import EmployeeList from './_components/EmployeeList';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { MyInput } from 'components/Atoms/Form';
import { KeyTypeEnum } from 'enums/key-type.enum';
import { useSearch } from 'hooks/useSearch';
import { useLocation, useNavigate } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import { searchValue } from 'types/search';

function EmployeePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchValue: searchValue = paramsStrToObj(location.search);
  const { search, setSearch, handleSearch } = useSearch();
  const breadCrumbs = [
    {
      label: t('Employees'),
      url: '#',
    },
  ];
  return (
    <PageContentWrapper>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="headers-core dark:text-text-title-dark text-text-base">
            {t('Employees')}
          </h1>
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
          <div className="flex items-center gap-4">
            <MyButton
              onClick={() => {
                navigate('/employees/create');
              }}
              allowedRoles={['ADMIN', 'HR']}
              startIcon={<Plus />}
              variant='primary'
              className={`text-sm w-[230px] [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
            >
              {t('Create an employee')}
            </MyButton>
            {searchValue?.subdepartmentId && (
              <MyButton
                onClick={() => navigate('/employees')}
                className={`text-sm w-[230px] [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
                variant="secondary"
                startIcon={<ArrowLeft />}
              >
                {t('Back to employees list')}
              </MyButton>
            )}
          </div>
        </div>
      </div>
      <EmployeeList searchValue={searchValue} />
    </PageContentWrapper>
  );
}

export default EmployeePage;
