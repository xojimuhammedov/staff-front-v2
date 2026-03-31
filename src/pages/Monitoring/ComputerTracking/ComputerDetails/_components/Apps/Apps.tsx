import React from 'react';
import { LayoutGridIcon } from "lucide-react";
import ProductivityStats from "./ProductivityStats";
import AppsCharts from "./AppsCharts";
import UsageDetailsTable from "./UsageDetailsTable";

const Apps = ({ user }: { user?: any }) => {
    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <LayoutGridIcon className="h-5 w-5 text-primary" />
                    <h1 className="text-2xl font-semibold text-foreground">Ilovalar</h1>
                </div>
                <p className="text-muted-foreground">
                    Foydalanuvchi tomonidan ishlatilgan ilovalar va faol oynalar
                </p>
            </div>

            <ProductivityStats user={user} />
            <AppsCharts user={user} />
            <UsageDetailsTable user={user} />
        </div>
    );
};

export default Apps;