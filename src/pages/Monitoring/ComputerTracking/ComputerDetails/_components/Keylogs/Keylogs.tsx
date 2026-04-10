import React from 'react';
import { KeyboardIcon } from "lucide-react";
import KeylogsTable from './KeylogsTable';
import KeylogCharts from './KeylogCharts';
import { useTranslation } from "react-i18next";

const Keylogs = ({ user }: { user?: any }) => {
    const { t } = useTranslation();
    if (!user?.employee?.id) {
        return <div className="p-4 text-gray-500 dark:text-gray-400">{t("No data available because an employee is not assigned.")}</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <KeyboardIcon className="h-5 w-5 text-primary" />
                    <h1 className="text-2xl font-semibold text-foreground">{t('Keylogs')}</h1>
                </div>
                <p className="text-muted-foreground">
                    {t('Keylogs Desc Detail')}
                </p>
            </div>

            <KeylogCharts user={user} />
            
            <KeylogsTable user={user} />
        </div>
    );
};

export default Keylogs;
