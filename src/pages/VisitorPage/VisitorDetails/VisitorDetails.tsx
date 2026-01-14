import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import Sidebar from './_components/Sidebar/Sidebar';
import Button from 'components/Atoms/MyButton';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainContent from './_components/MainContent';

const VisitorDetails = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const breadCrumbs = [
        {
            label: t('Visitors'),
            url: '#'
        }
    ];
    return (
        <PageContentWrapper>
            <div className="flex items-center justify-between">
                <MyBreadCrumb pageTitle={t('Visitors')} items={breadCrumbs} />
                <Button onClick={() => navigate('/visitor')} variant='secondary' startIcon={<ArrowLeft />} >{t("Back to visitors list")}</Button>
            </div>
            <MyDivider />
            <div className="flex gap-6">
                <Sidebar sidebar_menu_type="simple" />
                <MainContent />
            </div>
        </PageContentWrapper>
    );
}

export default VisitorDetails;
