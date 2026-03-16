import { URLS } from 'constants/url';
import { useGetAllQuery, useGetOneQuery } from 'hooks/api';
import React from 'react';
import { useParams } from 'react-router-dom';
import Details from './_components/Details';
import { get } from 'lodash';
import PersonalInfoCard from './_components/PersonalCard';
import LineChart from 'components/Molecules/LineChart';
import Productivity from './_components/Productivity';
import PolicyInfo from './_components/PolicyInfo';
import { useTranslation } from 'react-i18next';
import { KEYS } from '@/constants/key';



function EmployeeView() {
    const { id } = useParams()
    const { t } = useTranslation()
    const { data: unproductiveApps } = useGetAllQuery({
        key: KEYS.getUnproductiveApps,
        url: URLS.getUnproductiveApps,
        params: { employeeId: id }
    })
    const { data: usefulSites } = useGetAllQuery({
        key: KEYS.getUsefulSites,
        url: URLS.getUsefulSites,
        params: { employeeId: id }
    })
    const { data: unproductiveSites } = useGetAllQuery({
        key: KEYS.getUnproductiveSites,
        url: URLS.getUnproductiveSites,
        params: { employeeId: id }
    })
    const { data: usageDetails } = useGetAllQuery({
        key: KEYS.getUsageDetails,
        url: URLS.getUsageDetails,
        params: { employeeId: id }
    })
    const { data } = useGetOneQuery({
        id: id,
        url: URLS.getEmployeeList,
        params: {},
        enabled: !!id
    })
    return (
        <div>
            <Details
                avatar={get(data, 'data.photo')}
                title={get(data, 'data.name')}
                position={get(data, 'data.job')}
                department={get(data, 'data.department')}
            />
            <div className='flex gap-8 mt-8 items-center'>
                <PersonalInfoCard data={get(data, 'data')} />
                <Productivity />
            </div>
            <div className='grid grid-cols-2 gap-8 mt-4'>
                <PolicyInfo name={t("Useful Apps")} color='bg-[#FBC02D]' />
                <PolicyInfo name={t("Unproductive Apps")} color="bg-[#E11D48]" data={get(unproductiveApps, 'data')} />
            </div>
            <div className='grid grid-cols-2 gap-8 mt-4'>
                <PolicyInfo name={t("Useful Websites")} color='bg-[#FBC02D]' data={get(usefulSites, 'data')} />
                <PolicyInfo name={t("Unproductive Sites")} color="bg-[#E11D48]" data={get(unproductiveSites, 'data')} />
            </div>
            <div className='grid grid-cols-1 gap-8 mt-4'>
                <PolicyInfo name={t("Usage Details")} color='bg-[#3b82f6]' data={get(usageDetails, 'data')} showFullList />
            </div>
        </div>
    );
}

export default EmployeeView;
