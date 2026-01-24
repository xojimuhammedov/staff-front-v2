import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { useTranslation } from 'react-i18next';
import DeviceList from './_components/DeviceList';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { Plus, Search } from 'lucide-react';
import { KEYS } from 'constants/key';
import { useGetAllQuery } from 'hooks/api';
import { URLS } from 'constants/url';
import { useLocation, useNavigate } from 'react-router-dom';
import { MyInput } from 'components/Atoms/Form';
import { KeyTypeEnum } from 'enums/key-type.enum';
import { paramsStrToObj } from 'utils/helper';
import { searchValue } from 'types/search';
import { useSearch } from 'hooks/useSearch';

const DevicePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation()
  const { search, setSearch, handleSearch } = useSearch();
  const searchValue: searchValue = paramsStrToObj(location.search)

  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.getDoorForDevices,
    url: URLS.getDoorForDevices,
    params: {
      search: searchValue?.search
    },
  });

  return (
    <>
      <div className={'flex justify-between'}>
        <LabelledCaption
          title={t('Device control')}
          subtitle={t('System notifications for selected employees')}
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
          <MyButton
            onClick={() => {
              navigate('/device/create');
            }}
            allowedRoles={['ADMIN', 'HR']}
            startIcon={<Plus />}
            variant='primary'
            className={`text-sm min-w-max [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
          >
            {t('Create device')}
          </MyButton>
        </div>
      </div>
      <MyDivider />
      <DeviceList data={data} isLoading={isLoading} refetch={refetch} />
    </>
  );
};

export default DevicePage;
