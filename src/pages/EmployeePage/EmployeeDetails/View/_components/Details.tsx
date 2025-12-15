import MyAvatar from 'components/Atoms/MyAvatar';
import config from 'configs';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Details = (props: any) => {
    const { t, i18n } = useTranslation()
    return (
        <div className='flex items-center gap-4'>
            <MyAvatar size='large' imageUrl={`${config.FILE_URL}api/storage/${props?.avatar}`} className='rounded-full w-full h-full object-cover' />
            <div className='flex flex-col'>
                <h2 className='text-xl font-bold mb-2'>{props?.title}</h2>
                <p className='text-base'>{props?.position?.[`${i18n?.language}`]}</p>
                <p className='text-base '><b>{t("Department")}</b>: {props?.department?.fullName}</p>
            </div>
        </div>
    );
}

export default React.memo(Details);
