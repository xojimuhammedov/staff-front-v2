import MyBreadCrumb from "@/components/Atoms/MyBreadCrumb";
import PageContentWrapper from "@/components/Layouts/PageContentWrapper";
import { useTranslation } from "react-i18next";
import ActiveWindowList from "./components/ActiveWindowList";

const ActiveWindow = () => {
    const { t } = useTranslation();

    const breadCrumbs = [
        {
            label: t('Active Windows'),
            url: '/monitoring/activeWindows',
        },
    ];
    return (
        <PageContentWrapper>
            <div className="flex flex-col">
                <h1 className="headers-core dark:text-text-title-dark text-text-base">
                    {t('Active Windows')}
                </h1>
                <MyBreadCrumb items={breadCrumbs} />
            </div>
            <ActiveWindowList />
        </PageContentWrapper>
    );
};

export default ActiveWindow;
