import MyBreadCrumb from "@/components/Atoms/MyBreadCrumb";
import PageContentWrapper from "@/components/Layouts/PageContentWrapper";
import { useTranslation } from "react-i18next";
import VisitedSitesList from "./components/VisitedSitesList";

const VisitedSites = () => {
    const { t } = useTranslation();

    const breadCrumbs = [
        {
            label: t('Visited Sites'),
            url: '/monitoring/visited-sites',
        },
    ];
    return (
        <PageContentWrapper>
            <div className="flex flex-col">
                <h1 className="headers-core dark:text-text-title-dark text-text-base">
                    {t('Visited Sites')}
                </h1>
                <MyBreadCrumb items={breadCrumbs} />
            </div>
            <VisitedSitesList />
        </PageContentWrapper>
    );
};

export default VisitedSites;
