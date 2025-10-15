import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import React from 'react';
import EmployeeGroupTable from './_components/EmployeeGroupTable';
import { useTranslation } from 'react-i18next';

const EmployeeGroup = () => {
    const { t } = useTranslation()
    const breadCrumbs = [
        {
            label: t('Employee group'),
            url: '#'
        }
    ];
    return (
        <PageContentWrapper>
            <div className="flex flex-col">
                <h1 className="headers-core dark:text-text-title-dark text-text-base">
                    {t('Employee group')}
                </h1>
                <MyBreadCrumb items={breadCrumbs} />
            </div>
            <MyDivider />
            <EmployeeGroupTable />
        </PageContentWrapper>
    );
}

export default EmployeeGroup;
