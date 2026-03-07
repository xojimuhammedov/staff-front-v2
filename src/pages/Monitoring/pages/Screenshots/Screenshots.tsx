import MyBreadCrumb from "@/components/Atoms/MyBreadCrumb";
import PageContentWrapper from "@/components/Layouts/PageContentWrapper";
import { useTranslation } from "react-i18next";
import ScreenshotList from "./components/ScreenshotList";

const Screenshots = () => {
    const { t } = useTranslation();

    const breadCrumbs = [
        {
            label: t('Screenshots'),
            url: '/screenshots',
        },  
    ];
    return (
        <PageContentWrapper>
            <div className="flex flex-col">
                <h1 className="headers-core dark:text-text-title-dark text-text-base">
                    {t('Screenshots')}
                </h1>
                <MyBreadCrumb items={breadCrumbs} />
            </div>
            <ScreenshotList />
        </PageContentWrapper>
    );
};

export default Screenshots;
