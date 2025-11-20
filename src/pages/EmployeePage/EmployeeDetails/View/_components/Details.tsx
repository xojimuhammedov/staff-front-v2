import MyAvatar from 'components/Atoms/MyAvatar';
import config from 'configs';
import React from 'react';

const Details = (props: any) => {
    return (
        <div className='flex items-center gap-4'>
            <MyAvatar size='large' imageUrl={`${config.FILE_URL}api/storage/${props?.avatar}`} className='w-full rounded-full' />
            <div className='flex flex-col'>
                <h2 className='text-xl font-bold mb-2'>{props?.title}</h2>
                <p className='text-base'>{props?.position}</p>
                <p className='text-base '><b>Department</b>: {props?.department?.fullName}</p>
            </div>
        </div>
    );
}

export default React.memo(Details);
