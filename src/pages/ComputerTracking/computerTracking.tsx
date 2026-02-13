import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import ComputerTrackingList from './_components/ComputerTrackingList';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { useSearch } from 'hooks/useSearch';
import { useLocation, useNavigate } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import { searchValue } from 'types/search';
import { useForm } from 'react-hook-form';

function ComputerTracking() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchValue: searchValue = paramsStrToObj(location.search);
  const { control, watch } = useForm({
    defaultValues: {
      departmentId: undefined,
    }
  });

  const { search, setSearch, handleSearch } = useSearch();
  
  const breadCrumbs = [
    {
      label: t('Computer Tracking'),
      url: '/computer-tracking',
    },
  ];

  return (
    <PageContentWrapper>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="headers-core dark:text-text-title-dark text-text-base">
            {t('Computer Tracking')}
          </h1>
          <MyBreadCrumb items={breadCrumbs} />
        </div>
        <div className="flex items-center gap-4">
          {/* <MyInput
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
            placeholder={t('Search computers...')}
          /> */}
          <div className="flex items-center gap-4">
            {/* <MyButton
              onClick={() => {
                navigate('/computer-tracking/create');
              }}
              allowedRoles={['ADMIN', 'HR']}
              startIcon={<Plus />}
              variant='primary'
              className={`text-sm min-w-max [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
            >
              {t('Add Computer')}
            </MyButton> */}
            {searchValue?.subdepartmentId && (
              <MyButton
                onClick={() => navigate('/computer-tracking')}
                startIcon={<ArrowLeft />}
                variant="primary"
                className={`text-sm min-w-max [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
              >
                {t('Back to computer list')}
              </MyButton>
            )}
          </div>
        </div>
      </div>
      <ComputerTrackingList searchValue={searchValue} />
    </PageContentWrapper>
  );
}

export default ComputerTracking;
