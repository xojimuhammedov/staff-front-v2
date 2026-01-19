import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import Sidebar from './_components/Sidebar/Sidebar';
import MainContent from './_components/MainContent';

const ReportSidebar = () => {
    const { t } = useTranslation()
    const breadCrumbs = [
        {
            label: t('Report'),
            url: '#'
        }
    ];
    return (
        <PageContentWrapper>
            <div className="flex items-center justify-between">
                <MyBreadCrumb pageTitle={t('Report')} items={breadCrumbs} />
            </div>
            <MyDivider />
            <div className="flex gap-6">
                <Sidebar sidebar_menu_type="simple" />
                <MainContent />
            </div>
        </PageContentWrapper>
    );
}

export default ReportSidebar;
