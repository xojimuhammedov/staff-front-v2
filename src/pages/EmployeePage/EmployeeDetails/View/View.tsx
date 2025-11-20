import { URLS } from 'constants/url';
import { useGetOneQuery } from 'hooks/api';
import React from 'react';
import { useParams } from 'react-router-dom';
import Details from './_components/Details';
import { get } from 'lodash';
import PersonalInfoCard from './_components/PersonalCard';
import LineChart from 'components/Molecules/LineChart';
import Productivity from './_components/Productivity';



function EmployeeView() {
    const { id } = useParams()

    const { data } = useGetOneQuery({
        id: id,
        url: URLS.getEmployeeList,
        params: {},
        enabled: !!id
    })

    console.log(data)
    return (
        <div>
            <Details
                avatar={get(data, 'data.photo')}
                title={get(data, 'data.name')}
                position={get(data, 'data.additionalDetails')}
                department={get(data, 'data.department')}
            />
            <div className='flex gap-8 items-center'>
                <PersonalInfoCard data={get(data, 'data')} />
                <Productivity />
            </div>
        </div>
    );
}

export default EmployeeView;
