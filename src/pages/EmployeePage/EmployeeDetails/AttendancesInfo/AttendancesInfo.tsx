import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import React from 'react';
import AttendanceCard from './_components/AttendancesCard';
import MyDivider from 'components/Atoms/MyDivider';

const AttendancesInfo = () => {
    return (
        <>
            <h1 className='headers-core dark:text-text-title-dark text-text-base'>Attendance & Arrival/Leave Tracking</h1>
            <p>Monitor employee attendance patterns and punctuality</p>
            <MyDivider />
            <div className='grid grid-cols-4 gap-4'>
                <AttendanceCard
                    averageArrival="08:58 AM"
                    statusText="3 minutes early"
                    statusClass="early" />
                <AttendanceCard
                    averageArrival="08:58 AM"
                    statusText="3 minutes early"
                    statusClass="early" />
                <AttendanceCard
                    averageArrival="08:58 AM"
                    statusText="3 minutes early"
                    statusClass="early" />
                <AttendanceCard
                    averageArrival="08:58 AM"
                    statusText="3 minutes early"
                    statusClass="early" />
            </div>
        </>
    );
}

export default AttendancesInfo;
