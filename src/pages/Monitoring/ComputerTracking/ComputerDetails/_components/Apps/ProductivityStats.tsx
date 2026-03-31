import React from 'react';
import { useGetAllQuery } from "@/hooks/api";
import { KEYS } from "@/constants/key";
import { URLS } from "@/constants/url";
import { TrendingUp, CheckCircle, XCircle, Circle, Clock, Calendar, LayoutGrid } from "lucide-react";

const formatTime = (seconds: number) => {
    if (!seconds) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h} s ${m} d`;
    return `${m} d`;
};

import { useLocation } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';

const ProductivityStats = ({ user }: { user?: any }) => {
    const location = useLocation();
    const searchValue: any = paramsStrToObj(location.search);

    const { data: rankingData, isLoading } = useGetAllQuery<any>({
        key: KEYS.dashboardEmployeeProductivityRanking,
        url: URLS.dashboardEmployeeProductivityRanking,
        params: {
            employeeId: user?.employee?.id,
            resourceType: "APPLICATION",
            type: 'TOP_PRODUCTIVE',
            startDate: searchValue?.startDate,
            endDate: searchValue?.endDate,
        },
        enabled: !!user?.employee?.id,
    });

    const { data: usageData } = useGetAllQuery<any>({
        key: KEYS.getUsageDetails + '_charts',
        url: URLS.getUsageDetails,
        params: {
            employeeId: user?.employee?.id,
            startDate: searchValue?.startDate,
            endDate: searchValue?.endDate,
            resourceType: "APPLICATION",
            page: 1,
            limit: 5,
        },
        enabled: !!user?.employee?.id,
    });

    const employeeData = rankingData?.data?.[0] || rankingData?.[0] || null;
    const topAppName = (usageData?.data || [])[0]?.title || (usageData?.data || [])[0]?.name || '--';
    const appsCount = usageData?.total || 0;

    if (isLoading) {
        return <div className="p-4">Yuklanmoqda...</div>;
    }

    if (!user?.employee?.id) {
        return <div className="p-4 text-gray-500 dark:text-gray-400">Xodim biriktirilmaganligi sababli ma'lumotlar mavjud emas.</div>;
    }

    if (!employeeData) {
        return <div className="p-4 text-gray-500 dark:text-gray-400">Ma'lumot topilmadi</div>;
    }

    const {
        productivityScore = 0,
        usefulTime = 0,
        unusefulTime = 0,
        otherTime = 0,
        totalActiveTime = 0,
        activeDays = 0,
    } = employeeData;

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[rgb(var(--color-bg-base-dark))] shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Samaradorlik</p>
                                <p className="text-2xl font-bold text-green-500">{productivityScore}%</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-green-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[rgb(var(--color-bg-base-dark))] shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Foydali</p>
                                <p className="text-2xl font-bold text-green-500">{formatTime(usefulTime)}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
                        </div>
                    </div>
                </div>

                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[rgb(var(--color-bg-base-dark))] shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Foydasiz</p>
                                <p className="text-2xl font-bold text-red-500">{formatTime(unusefulTime)}</p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-500 opacity-50" />
                        </div>
                    </div>
                </div>

                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[rgb(var(--color-bg-base-dark))] shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Boshqa</p>
                                <p className="text-2xl font-bold text-gray-500">{formatTime(otherTime)}</p>
                            </div>
                            <Circle className="h-8 w-8 text-gray-500 opacity-50" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[rgb(var(--color-bg-base-dark))] shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Umumiy vaqti</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(totalActiveTime)}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[rgb(var(--color-bg-base-dark))] shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Faol kunlar</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeDays} kun</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[rgb(var(--color-bg-base-dark))] shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Ilovalar Soni</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{appsCount}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                <LayoutGrid className="h-6 w-6 text-yellow-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[rgb(var(--color-bg-base-dark))] shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Eng Ko‘p Ishlatilgan</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white truncate max-w-[150px]" title={topAppName}>
                                    {topAppName}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-purple-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductivityStats;
