import React from 'react';
import { KeyboardIcon } from "lucide-react";
import KeylogsTable from './KeylogsTable';

const Keylogs = ({ user }: { user?: any }) => {
    if (!user?.employee?.id) {
        return <div className="p-4 text-gray-500 dark:text-gray-400">Xodim biriktirilmaganligi sababli ma'lumotlar mavjud emas.</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <KeyboardIcon className="h-5 w-5 text-primary" />
                    <h1 className="text-2xl font-semibold text-foreground">Klaviatura (Keylogs)</h1>
                </div>
                <p className="text-muted-foreground">
                    Kompyuterda kiritilgan matnlar va jarayonlar haqida batafsil ma'lumot
                </p>
            </div>
            
            <KeylogsTable user={user} />
        </div>
    );
};

export default Keylogs;
