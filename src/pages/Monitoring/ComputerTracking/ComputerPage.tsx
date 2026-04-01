import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import ComputerTrackingList from './_components/ComputerTrackingList';
import { useLocation } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import { searchValue } from 'types/search';
import { MyInput } from '@/components/Atoms/Form';
import { KeyTypeEnum } from '@/enums/key-type.enum';
import { Search, Calendar } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import MyTailwindPicker from '@/components/Atoms/Form/MyTailwindDatePicker';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

function ComputerPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { search, setSearch, handleSearch } = useSearch();
  const searchValue: searchValue = paramsStrToObj(location.search);

  const { control, watch } = useForm({
    defaultValues: {
      date: {
        startDate: searchValue?.startDate || null,
        endDate: searchValue?.endDate || null
      }
    }
  });

  const dateValue = watch('date');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentStartDate = params.get('startDate');
    const currentEndDate = params.get('endDate');

    const newStartDate = dateValue?.startDate ? dayjs(dateValue.startDate).format('YYYY-MM-DD') : null;
    const newEndDate = dateValue?.endDate ? dayjs(dateValue.endDate).format('YYYY-MM-DD') : null;

    if (newStartDate !== currentStartDate || newEndDate !== currentEndDate) {
      if (newStartDate) {
        params.set('startDate', newStartDate);
      } else {
        params.delete('startDate');
      }
      if (newEndDate) {
        params.set('endDate', newEndDate);
      } else {
        params.delete('endDate');
      }
      params.set('page', '1');
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [dateValue, location.search, navigate]);

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
          <div>
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
          <div className="w-[240px]">
            <MyTailwindPicker
              useRange={true}
              name="date"
              asSingle={false}
              control={control}
              showShortcuts={true}
              placeholder={t('Today')}
              startIcon={<Calendar className="stroke-text-muted dark:stroke-text-title-dark" />}
            />
          </div>
        </div>
      </div>
      <ComputerTrackingList searchValue={searchValue} />
    </PageContentWrapper>
  );
}

export default ComputerPage;
