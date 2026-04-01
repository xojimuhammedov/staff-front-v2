import React from 'react';
import { ImageIcon } from "lucide-react";
import ScreenshotsTable from './ScreenshotsTable';
import ScreenshotCharts from './ScreenshotCharts';

const Screenshots = ({ user }: { user?: any }) => {
    if (!user?.employee?.id) {
        return <div className="p-4 text-gray-500 dark:text-gray-400">Xodim biriktirilmaganligi sababli ma'lumotlar mavjud emas.</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    <h1 className="text-2xl font-semibold text-foreground">Skrinshotlar</h1>
                </div>
                <p className="text-muted-foreground">
                    Xodim kompyuteridan olingan skrinshotlar ro'yxati
                </p>
            </div>

            <ScreenshotCharts user={user} />
            
            <ScreenshotsTable user={user} />
        </div>
    );
};

export default Screenshots;
