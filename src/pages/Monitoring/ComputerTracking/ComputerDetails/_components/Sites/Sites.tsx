import { GlobeIcon } from "lucide-react";
import SitesProductivityStats from "./SitesProductivityStats";
import SitesCharts from "./SitesCharts";
import SitesTable from "./SitesTable";
import { useTranslation } from "react-i18next";

const Sites = ({ user }: { user?: any }) => {
    const { t } = useTranslation();
    if (!user?.employee?.id) {
        return <div className="p-4 text-gray-500 dark:text-gray-400">{t("No data available because an employee is not assigned.")}</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <GlobeIcon className="h-5 w-5 text-primary" />
                    <h1 className="text-2xl font-semibold text-foreground">{t('Sites')}</h1>
                </div>
                <p className="text-muted-foreground">
                    {t('Sites Desc')}
                </p>
            </div>

            <SitesProductivityStats user={user} />
            <SitesCharts user={user} />
            <SitesTable user={user} />
        </div>
    );
};

export default Sites;
