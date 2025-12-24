import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { useTranslation } from 'react-i18next';
import DeviceList from './_components/DeviceList';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { Plus } from 'lucide-react';
import FormDeviceModal from './_components/Create';
import MyModal from 'components/Atoms/MyModal';
import { useState } from 'react';
import { KEYS } from 'constants/key';
import { useGetAllQuery } from 'hooks/api';
import { URLS } from 'constants/url';

const DevicePage = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false)

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
                        setOpen(true)
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

            <MyModal
                modalProps={{
                    show: Boolean(open),
                    onClose: () => setOpen(false),
                    size: 'md'
                }}
                headerProps={{
                    children: (
                        <h2 className="text-20 leading-32 font-inter tracking-tight text-black">
                            {t('Create new device')}
                        </h2>
                    )
                }}
                bodyProps={{
                    children: <FormDeviceModal refetch={refetch} setOpenModal={setOpen} />,
                    className: 'py-[15px]'
                }}
            />
        </>
    );
};

export default DevicePage;
