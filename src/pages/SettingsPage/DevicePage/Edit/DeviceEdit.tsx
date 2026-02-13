import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import React from 'react';
import Stepper from '../Create/_components/Stepper';
import EditForm from './_components/EditForm';
import EmployeeAssign from './_components/EmployeeAssign';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { SidebarMenuType } from 'types/sidebar';
import DeviceSettings from './_components/DeviceSettings';
import { useGetAllQuery, useGetOneQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';

interface Employee {
    id: number;
    name: string;
    avatar?: string;
}

interface EmployeeResponse {
    data: Employee[];
}

const DeviceEdit = () => {
    const { t } = useTranslation();
    const { id } = useParams()
    const [searchParams, setSearchParams] = useSearchParams();
    const currentSearch = searchParams.get("search") || "";
    const sidebar_menu: SidebarMenuType[] = [
        {
            title: t('Enter a device name and description'),
            stepper_title: t('Device details'),
            items: []
        },
        {
            title: t('Enter a device details'),
            stepper_title: t('Device settings'),
            items: []
        },
        {
            title: t('Create employees group and link to the door'),
            stepper_title: t('Add employees'),
            items: []
        }
    ];
    const breadCrumbs = [
        {
            label: t('Devices'),
            url: '#'
        }
    ];

    const { data: deviceData, isLoading: deviceLoading } = useGetOneQuery({
        id: id,
        url: URLS.getDoorForDevices,
        params: {},
        enabled: !!id,
    });

    const currentStep: any = Number(searchParams.get('current-step')) || 1;
    const complete: boolean = currentStep === sidebar_menu.length ? true : false;

    const handleClick = async () => {
        const step = currentStep === sidebar_menu.length ? currentStep : currentStep + 1;

        searchParams.set('current-step', `${step}`);
        // searchParams.set('current-rule', `${get(sidebar_menu[step - 1], 'items[0].path', '')}`);
        setSearchParams(searchParams);
    };

    return (
        <PageContentWrapper>
            <div className="flex items-center justify-between">
                <MyBreadCrumb pageTitle={t('Devices')} items={breadCrumbs} />
            </div>
            <MyDivider />
            <div className="flex w-full gap-8">
                <Stepper complete={complete} currentStep={currentStep} steps={sidebar_menu} />
                {currentStep === 3 ? (
                    <EmployeeAssign
                        deviceId={Number(id)} />
                ) : currentStep === 2 ? <DeviceSettings deviceId={Number(id)} handleClick={handleClick} /> : (
                    <EditForm
                        deviceData={deviceData}
                        isLoading={deviceLoading}
                        deviceId={Number(id)} handleClick={handleClick} />
                )}
            </div>
        </PageContentWrapper>
    );
}

export default DeviceEdit;
