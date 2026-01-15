import { URLS } from 'constants/url';
import { useGetOneQuery, useGetAllQuery } from 'hooks/api';
import React from 'react';
import { useParams } from 'react-router-dom';
import Details from './_components/Details';
import { get } from 'lodash';
import PersonalInfoCard from './_components/PersonalCard';
import { useTranslation } from 'react-i18next';
import { KEYS } from 'constants/key';

function VisitorView() {
    const { id } = useParams()
    const { t } = useTranslation()
    const { data } = useGetOneQuery({
        id: id,
        url: URLS.getVisitorList,
        params: {},
        enabled: !!id
    })

    const { data: organizationData } = useGetAllQuery<any>({
        key: KEYS.getAllListOrganization,
        url: URLS.getAllListOrganization,
        params: {},
        hideErrorMsg: true,
    });

    const { data: employeeData } = useGetAllQuery<any>({
        key: KEYS.getEmployeeList,
        url: URLS.getEmployeeList,
        params: {},
    });

    const getOrganizationName = (orgId?: number) => {
        if (!orgId) return undefined;
        return organizationData?.data?.find((org: any) => org.id === orgId)?.fullName;
    };

    const getEmployeeName = (empId?: number) => {
        if (!empId) return undefined;
        return employeeData?.data?.find((emp: any) => emp.id === empId)?.name;
    };

    const visitorData = get(data, 'data');
    const organizationName = getOrganizationName(visitorData?.organizationId);
    const employeeName = getEmployeeName(visitorData?.attachId);

    return (
        <div>
            <Details
                title={`${get(data, 'data.firstName')} ${get(data, 'data.lastName')}`}
                email={get(data, 'data.middleName')}
                phone={get(data, 'data.phone')}
            />
            <div className='mt-8'>
                <PersonalInfoCard 
                    data={visitorData} 
                    organizationName={organizationName}
                    employeeName={employeeName}
                />
            </div>
        </div>
    );
}

export default VisitorView;
