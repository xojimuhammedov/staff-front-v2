import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import React from 'react';
import { useTranslation } from 'react-i18next';
import UserTable from './_components/UserTable';

const UserManagment = () => {
    const {t} = useTranslation()
    const breadCrumbs = [
        {
          label: t('Users'),
          url: '#'
        }
    ];
    return (
        <PageContentWrapper>
            <div className="flex flex-col">
                <h1 className="headers-core dark:text-text-title-dark text-text-base">{t('Users')}</h1>
                <MyBreadCrumb items={breadCrumbs} />
            </div>
            <MyDivider />
            <UserTable />
        </PageContentWrapper>
    );
}

export default UserManagment;
