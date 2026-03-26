import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import ComputerTrackingList from './_components/ComputerTrackingList';
import { useLocation } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import { searchValue } from 'types/search';
import { MyInput } from '@/components/Atoms/Form';
import { KeyTypeEnum } from '@/enums/key-type.enum';
import { Search } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';

function ComputerPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const { search, setSearch, handleSearch } = useSearch();
  const searchValue: searchValue = paramsStrToObj(location.search);

  const breadCrumbs = [
    {
      label: t('Computers'),
      url: '/computer-tracking',
    },
  ];

  return (
    <PageContentWrapper>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="headers-core dark:text-text-title-dark text-text-base">
            {t('Computers')}
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
          </div>
        </div>
        <ComputerTrackingList searchValue={searchValue} />
    </PageContentWrapper>
  );
}

export default ComputerPage;
