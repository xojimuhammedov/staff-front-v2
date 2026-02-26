import HistoryList from './_components/HistoryList';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { MyInput } from 'components/Atoms/Form';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { KeyTypeEnum } from 'enums/key-type.enum';
import { useLocation } from 'react-router-dom';
import { useSearch } from 'hooks/useSearch';
import { searchValue } from 'types/search';
import { paramsStrToObj } from 'utils/helper';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';

const ScheduleHistory = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { search, setSearch, handleSearch } = useSearch();
  const searchParamsValue: searchValue = paramsStrToObj(location.search);

  const { data, isLoading } = useGetAllQuery({
    key: KEYS.employeePlanHistoryChangeSchedules,
    url: URLS.employeePlanHistoryChangeSchedules,
    params: {
      search: searchParamsValue?.search,
      page: searchParamsValue?.page || 1,
      limit: searchParamsValue?.limit || 10
    }
  });

  return (
    <>
      <div className={'flex justify-between'}>
        <LabelledCaption
          title={t('Schedule history')}
          subtitle={t('Employee schedule change logs')}
        />
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
        </div>
      </div>
      <HistoryList data={data} isLoading={isLoading} />
    </>
  );
};

export default ScheduleHistory;
