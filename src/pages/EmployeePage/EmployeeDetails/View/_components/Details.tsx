import MyAvatar from 'components/Atoms/MyAvatar';
import config from 'configs';
import React from 'react';
import AvatarIcon from 'assets/icons/avatar.jpg';
import { useTranslation } from 'react-i18next';

const Details = (props: any) => {
    const { t, i18n } = useTranslation()
    const currentLang = i18n.resolvedLanguage;
    return (
        <div className='flex items-center gap-4'>
            <MyAvatar size='large' imageUrl={props?.avatar ? `${config.FILE_URL}api/storage/${props?.avatar}` : AvatarIcon} className='rounded-full  object-cover' />
            <div className='flex flex-col'>
                <h2 className='text-2xl  text-gray-900 dark:text-white'>{props?.title}</h2>
                <p className='text-sm text-gray-900 dark:text-white'>{props?.position?.[`${currentLang}`]}</p>
                <p className='text-base text-gray-700 dark:text-white'><b>{t("Department")}</b>: {props?.department?.fullName}</p>
            </div>
        </div>
    );
}

export default React.memo(Details);
