import MyDivider from 'components/Atoms/MyDivider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ProductivityScoreCard from './_components/ProductivityScore';
import PolicyCard from './_components/PolicyCard';
import UsageBreakdownCard from './_components/UsageBreakDown';
import UsageDetailsTable from './_components/UsageDetailsTable';

const Productivity = () => {
    const { t } = useTranslation()
    return (
        <>
            <h1 className='headers-core dark:text-text-title-dark text-text-base'>{t("Attendance & Arrival/Leave Tracking")}</h1>
            <MyDivider />
            <div className='flex items-center gap-4'>
                <ProductivityScoreCard
                    score={85}
                    description="out of 100"
                    progressBarText="Excellent productivity"
                />
                <UsageBreakdownCard productivePercentage={78}
                    productiveTime="33h 10m"
                    unproductiveTime="9h 20m" />
            </div>
            <PolicyCard name={t("Useful Apps")} color='bg-[#FBC02D]' />
            <UsageDetailsTable />
        </>
    );
}

export default Productivity;
