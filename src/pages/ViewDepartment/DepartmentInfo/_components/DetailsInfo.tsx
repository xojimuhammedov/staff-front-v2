import React from 'react';

const DetailsInfo = ({ departmentInfo }: any) => {
    return (
        <div>
            <h2 className='text-2xl font-medium'>Department: {departmentInfo?.fullName}</h2>
            <h4 className='text-lg'>{departmentInfo?.shortName}</h4>
        </div>
    );
}

export default DetailsInfo;
