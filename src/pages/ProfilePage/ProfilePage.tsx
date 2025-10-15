import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Form from './_components/Form';

const ProfilePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const breadCrumbs = [
        {
            label: t('User'),
            url: '#'
        }
    ];
    return (
        <PageContentWrapper>
            <div className="flex flex-col">
                <h1 className="headers-core text-text-base dark:text-text-title-dark">
                    {t('Edit user profile')}
                </h1>
                <MyBreadCrumb items={breadCrumbs} />
            </div>
            <MyDivider />
            <MyButton
                onClick={() => navigate('/')}
                variant="secondary"
                startIcon={<ArrowLeft />}>
                {t('Back to page')}
            </MyButton>
            <MyDivider />
            <Form />
        </PageContentWrapper>
    );
}

export default ProfilePage;
