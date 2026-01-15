import MyAvatar from 'components/Atoms/MyAvatar';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';

const Details = (props: any) => {
    const { t } = useTranslation()
    return (
        <div className='flex items-center gap-4'>
            <div className='w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                <User size={48} className='text-gray-400' />
            </div>
            <div className='flex flex-col'>
                <h2 className='text-xl font-bold mb-2'>{props?.title || '--'}</h2>
                <p className='text-base text-gray-600 dark:text-gray-400'>{props?.email || '--'}</p>
              <p className='text-base '><b>{t("Department")}</b>: {props?.department?.fullName}</p>
            </div>
        </div>
    );
}

export default React.memo(Details);
