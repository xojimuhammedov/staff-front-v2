import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import React from 'react';
import Stepper from './_components/Stepper';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { SidebarMenuType } from 'types/sidebar';
import Form from './_components/Form';
import EmployeeAssign from './_components/EmployeeAssign';

const CreatePage = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const sidebar_menu: SidebarMenuType[] = [
        {
            title: t('Enter a device name and description'),
            stepper_title: t('Device details'),
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

    const currentStep: any = Number(searchParams.get('current-step')) || 1;
    const complete: boolean = currentStep === sidebar_menu.length ? true : false;
    return (
        <PageContentWrapper>
            <div className="flex items-center justify-between">
                <MyBreadCrumb pageTitle={t('Devices')} items={breadCrumbs} />
            </div>
            <MyDivider />
            <div className="flex w-full gap-8">
                <Stepper complete={complete} currentStep={currentStep} steps={sidebar_menu} />
                {currentStep === 2 ? (
                    <EmployeeAssign />
                )  : (
                    <Form />
                )}
            </div>
        </PageContentWrapper>
    );
}

export default CreatePage;
