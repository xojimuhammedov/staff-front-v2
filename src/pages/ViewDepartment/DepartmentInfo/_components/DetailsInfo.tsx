import React from 'react';

const DetailsInfo = ({ departmentInfo }: any) => {
    return (
        <div>
          <h2 className='text-2xl font-medium text-gray-900 dark:text-white'>Department: {departmentInfo?.fullName}</h2>
            <h4 className='text-lg text-gray-700 dark:text-white'>{departmentInfo?.shortName}</h4>
        </div>
    );
}

export default DetailsInfo;
