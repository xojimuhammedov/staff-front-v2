import React from 'react';
import { ImageIcon } from "lucide-react";
import ScreenshotsTable from './ScreenshotsTable';
import ScreenshotCharts from './ScreenshotCharts';
import { useTranslation } from "react-i18next";

const Screenshots = ({ user }: { user?: any }) => {
    const { t } = useTranslation();
    if (!user?.employee?.id) {
        return <div className="p-4 text-gray-500 dark:text-gray-400">{t("No data available because an employee is not assigned.")}</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    <h1 className="text-2xl font-semibold text-foreground">{t('Screenshots')}</h1>
                </div>
                <p className="text-muted-foreground">
                    {t('Screenshots Desc')}
                </p>
            </div>

            <ScreenshotCharts user={user} />
            
            <ScreenshotsTable user={user} />
        </div>
    );
};

export default Screenshots;
