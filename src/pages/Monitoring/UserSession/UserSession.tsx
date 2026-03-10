import MyBreadCrumb from "@/components/Atoms/MyBreadCrumb";
import PageContentWrapper from "@/components/Layouts/PageContentWrapper";
import { useTranslation } from "react-i18next";
import UserSessionList from "./components/UserSessionList";

const UserSession = () => {
    const { t } = useTranslation();

    const breadCrumbs = [
        {
            label: t('User Session'),
            url: '/userSessions',
        },
    ];
    return (
        <PageContentWrapper>
            <div className="flex flex-col">
                <h1 className="headers-core dark:text-text-title-dark text-text-base">
                    {t('User Session')}
                </h1>
                <MyBreadCrumb items={breadCrumbs} />
            </div>
            <UserSessionList />
        </PageContentWrapper>
    );
};

export default UserSession;
