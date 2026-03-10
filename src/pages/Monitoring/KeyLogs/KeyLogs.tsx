import MyBreadCrumb from "@/components/Atoms/MyBreadCrumb";
import PageContentWrapper from "@/components/Layouts/PageContentWrapper";
import { useTranslation } from "react-i18next";
import KeyLogList from "./components/KeyLogList";

const KeyLogs = () => {
    const { t } = useTranslation();

    const breadCrumbs = [
        {
            label: t('Key Logs'),
            url: '/keyLogs',
        },
    ];
    return (
        <PageContentWrapper>
            <div className="flex flex-col">
                <h1 className="headers-core dark:text-text-title-dark text-text-base">
                    {t('Key Logs')}
                </h1>
                <MyBreadCrumb items={breadCrumbs} />
            </div>
            <KeyLogList />
        </PageContentWrapper>
    );
};

export default KeyLogs;
