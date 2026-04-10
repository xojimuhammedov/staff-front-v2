import React from 'react';
import { LayoutGridIcon } from "lucide-react";
import ProductivityStats from "./ProductivityStats";
import AppsCharts from "./AppsCharts";
import UsageDetailsTable from "./UsageDetailsTable";
import { useTranslation } from "react-i18next";

const Apps = ({ user }: { user?: any }) => {
    const { t } = useTranslation();
    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <LayoutGridIcon className="h-5 w-5 text-primary" />
                    <h1 className="text-2xl font-semibold text-foreground">{t('Apps')}</h1>
                </div>
                <p className="text-muted-foreground">
                    {t('Apps Desc')}
                </p>
            </div>

            <ProductivityStats user={user} />
            <AppsCharts user={user} />
            <UsageDetailsTable user={user} />
        </div>
    );
};

export default Apps;