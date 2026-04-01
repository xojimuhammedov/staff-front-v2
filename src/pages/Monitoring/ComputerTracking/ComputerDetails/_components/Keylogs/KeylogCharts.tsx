import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllQuery } from "@/hooks/api";
import { KEYS } from "@/constants/key";
import { URLS } from "@/constants/url";
import { useLocation, useParams } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import dayjs from 'dayjs';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";

const CustomTooltip = ({ active, payload, label, t }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 p-3 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-xs" style={{ color: entry.color || entry.fill }}>
                        {entry.name || t('Number')}: <span className="font-semibold">{entry.value} {t('pcs')}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const KeylogCharts = ({ user }: { user?: any }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const searchValue: any = paramsStrToObj(location.search);
    const { id } = useParams();

    const { data, isLoading } = useGetAllQuery<any>({
        key: KEYS.getKeyLogs + '_charts',
        url: URLS.getKeyLogs,
        params: {
            employeeId: user?.employee?.id,
            startDate: searchValue?.startDate,
            endDate: searchValue?.endDate,
            limit: 100,
            computerId: id,
        },
        enabled: !!user?.employee?.id,
    });

    const dailyData = useMemo(() => {
        const start = searchValue?.startDate ? dayjs(searchValue.startDate) : null;
        const end = searchValue?.endDate ? dayjs(searchValue.endDate) : null;
        
        const map = new Map();
        
        // If we have range, pre-fill it with 0
        if (start && end) {
            let current = start;
            while (current.isBefore(end) || current.isSame(end, 'day')) {
                map.set(current.format('DD.MM.YYYY'), 0);
                current = current.add(1, 'day');
            }
        }
        
        // Group by day and update map
        if (data?.data) {
            data.data.forEach((item: any) => {
                const date = dayjs(item.datetime).format('DD.MM.YYYY');
                if (map.has(date)) {
                    map.set(date, map.get(date) + 1);
                } else if (!start || !end) {
                    map.set(date, (map.get(date) || 0) + 1);
                }
            });
        }

        return Array.from(map.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => dayjs(a.date, 'DD.MM.YYYY').unix() - dayjs(b.date, 'DD.MM.YYYY').unix());
    }, [data, searchValue?.startDate, searchValue?.endDate]);

    const processStats = useMemo(() => {
        if (!data?.data) return [];
        const map = new Map();
        
        data.data.forEach((item: any) => {
            const name = item.processName && item.processName !== "Unknown" ? item.processName : (item.title || "Unknown");
            map.set(name, (map.get(name) || 0) + 1);
        });

        return Array.from(map.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [data]);

    if (isLoading && !data) {
        return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="h-64 bg-gray-50 dark:bg-neutral-800 animate-pulse rounded-lg"></div>
            <div className="h-64 bg-gray-50 dark:bg-neutral-800 animate-pulse rounded-lg"></div>
        </div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Daily Activity */}
            <div className="rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#1a1c23] shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-neutral-800">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('Daily Activity (Keylogs count)')}</h3>
                </div>
                <div className="p-4">
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCountKey" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#9CA3AF" 
                                    fontSize={10} 
                                    tickFormatter={(val) => val.split('.').slice(0, 2).join('.')} 
                                />
                                <YAxis stroke="#9CA3AF" fontSize={10} />
                                <Tooltip content={<CustomTooltip t={t} />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    name={t('Key Logs')}
                                    stroke="#3B82F6" 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#colorCountKey)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Process Distribution */}
            <div className="rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#1a1c23] shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-neutral-800">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('Process Distribution (Keylogs)')}</h3>
                </div>
                <div className="p-4">
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={processStats} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                                <XAxis type="number" stroke="#9CA3AF" fontSize={10} />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    stroke="#9CA3AF" 
                                    fontSize={10} 
                                    width={100} 
                                    tickFormatter={(val) => val.length > 15 ? val.substring(0, 13) + '...' : val} 
                                />
                                <Tooltip content={<CustomTooltip t={t} />} />
                                <Bar dataKey="count" name={t('Key Logs')} fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={15} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KeylogCharts;
