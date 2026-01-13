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
    const navigate = useNavigate()

    const { data, isLoading, refetch } = useGetAllQuery({
        key: KEYS.getDoorForDevices,
        url: URLS.getDoorForDevices,
        params: {}
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
                        navigate("/device/create")
                    }}
                    allowedRoles={['ADMIN', "HR"]}
                    startIcon={<Plus />}
                    variant="primary"
                    className="[&_svg]:stroke-bg-white w-[160px] text-sm">
                    {t('Create device')}
                </MyButton>
            </div>
            <MyDivider />
            <DeviceList data={data} isLoading={isLoading} refetch={refetch} />
        </>
    );
};

export default DevicePage;
