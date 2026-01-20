import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { useTranslation } from 'react-i18next';
import DeviceList from './_components/DeviceList';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { Plus } from 'lucide-react';
import { KEYS } from 'constants/key';
import { useGetAllQuery } from 'hooks/api';
import { URLS } from 'constants/url';
import { useNavigate } from 'react-router-dom';

const DevicePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.getDoorForDevices,
    url: URLS.getDoorForDevices,
    params: {},
  });

  return (
    <>
      <div className={'flex justify-between'}>
        <LabelledCaption
          title={t('Device control')}
          subtitle={t('System notifications for selected employees')}
        />
        <MyButton
          onClick={() => {
            navigate('/device/create');
          }}
          allowedRoles={['ADMIN', 'HR']}
          startIcon={<Plus />}
          className={`
                text-sm w-[160px]
                bg-white text-gray-800 border border-gray-300 hover:bg-gray-100
                dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700
                [&_svg]:stroke-gray-600 dark:[&_svg]:stroke-gray-300
              `}
        >
          {t('Create device')}
        </MyButton>
      </div>
      <MyDivider />
      <DeviceList data={data} isLoading={isLoading} refetch={refetch} />
    </>
  );
};

export default DevicePage;
