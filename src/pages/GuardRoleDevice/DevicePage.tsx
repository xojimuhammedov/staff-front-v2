import { useTranslation } from 'react-i18next';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import MyDivider from 'components/Atoms/MyDivider';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import DeviceList from './DeviceList';
import { useLocation } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import { searchValue } from 'types/search';

const GuardDevicePage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchValue: searchValue = paramsStrToObj(location.search);

  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.getDoorForDevices,
    url: URLS.getDoorForDevices,
    params: {
      search: searchValue?.search,
    },
  });

  return (
    <PageContentWrapper>
      <div className="flex justify-between">
        <LabelledCaption
          title={t('Device control')}
          subtitle={t('System notifications for selected employees')}
        />
      </div>
      <MyDivider />
      <DeviceList data={data} isLoading={isLoading} refetch={refetch} />
    </PageContentWrapper>
  );
};

export default GuardDevicePage;
