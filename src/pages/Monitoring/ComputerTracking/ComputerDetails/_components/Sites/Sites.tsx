import React from 'react';
import { GlobeIcon } from "lucide-react";
import SitesProductivityStats from "./SitesProductivityStats";
import SitesCharts from "./SitesCharts";
import SitesTable from "./SitesTable";

const Sites = ({ user }: { user?: any }) => {
    if (!user?.employee?.id) {
        return <div className="p-4 text-gray-500 dark:text-gray-400">Xodim biriktirilmaganligi sababli ma'lumotlar mavjud emas.</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <GlobeIcon className="h-5 w-5 text-primary" />
                    <h1 className="text-2xl font-semibold text-foreground">Saytlar</h1>
                </div>
                <p className="text-muted-foreground">
                    Foydalanuvchi tomonidan tashrif buyurilgan veb-saytlar ro'yxati
                </p>
            </div>

            <SitesProductivityStats user={user} />
            <SitesCharts user={user} />
            <SitesTable user={user} />
        </div>
    );
};

export default Sites;
