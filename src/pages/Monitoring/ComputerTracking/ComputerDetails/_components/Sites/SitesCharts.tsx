import React, { useMemo } from 'react';
import { useGetAllQuery } from "@/hooks/api";
import { KEYS } from "@/constants/key";
import { URLS } from "@/constants/url";
import { useLocation } from 'react-router-dom';
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
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from "recharts";

const formatTime = (seconds: number) => {
    if (!seconds) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h} s ${m} d`;
    return `${m} d`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 p-3 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{label}</p>
                {payload.map((entry: any, index: number) => {
                    const labelName = entry.name === 'time' ? 'Vaqt' : entry.name === 'visits' ? 'Tashriflar' : entry.name;
                    const valueFormatted = entry.name === 'time' ? `${entry.value} daqiqa` : entry.name === 'visits' ? `${entry.value} marta` : entry.value;
                    return (
                        <p key={index} className="text-xs" style={{ color: entry.color || entry.fill }}>
                            {labelName}: <span className="font-semibold">{valueFormatted}</span>
                        </p>
                    );
                })}
            </div>
        );
    }
    return null;
};

const SitesCharts = ({ user }: { user?: any }) => {
    const location = useLocation();
    const searchValue: any = paramsStrToObj(location.search);

    const commonParams = {
        employeeId: user?.employee?.id,
        startDate: searchValue?.startDate,
        endDate: searchValue?.endDate,
    };

    // 1. Top Sites Data
    const { data: usageData } = useGetAllQuery<any>({
        key: KEYS.getUsageDetails + '_sites_charts',
        url: URLS.getUsageDetails,
        params: {
            ...commonParams,
            page: 1,
            limit: 100,
            resourceType: 'WEBSITE'
        },
        enabled: !!user?.employee?.id,
    });

    const topSitesChart = useMemo(() => {
        return (usageData?.data || []).slice(0, 5).map((app: any) => ({
            name: app.title || app.name || app.domain,
            time: Math.round((app.totalUsageTime || app.totalActiveTime || 0) / 60)
        }));
    }, [usageData]);

    // 2. Daily Visits (Hourly LineChart)
    const { data: visitedSitesData } = useGetAllQuery<any>({
        key: KEYS.getVisitedSites + '_charts',
        url: URLS.getVisitedSites,
        params: {
            ...commonParams,
            page: 1,
            limit: 100, 
        },
        enabled: !!user?.employee?.id,
    });

    const visitedSitesChart = useMemo(() => {
        if (!visitedSitesData?.data) return [];
        const hourlyData = new Map();
        
        for(let i = 0; i < 24; i++) {
            hourlyData.set(`${i.toString().padStart(2, '0')}:00`, { time: 0, visits: 0 });
        }

        visitedSitesData.data.forEach((item: any) => {
            if (item.datetime) {
                const hour = dayjs(item.datetime).format('HH:00');
                const current = hourlyData.get(hour) || { time: 0, visits: 0 };
                hourlyData.set(hour, {
                    time: current.time + Math.round((item.activeTime || 0) / 60),
                    visits: current.visits + 1
                });
            }
        });

        return Array.from(hourlyData.entries()).map(([hour, data]) => ({ hour, ...data }));
    }, [visitedSitesData]);

    // 3. Productivity Pie Chart Data (Same logic from ProductivityStats)
    const { data: rankingData } = useGetAllQuery<any>({
        key: KEYS.dashboardEmployeeProductivityRanking + '_sites_pie_charts',
        url: URLS.dashboardEmployeeProductivityRanking,
        params: {
            ...commonParams,
            type: 'TOP_PRODUCTIVE',
            resourceType: 'WEBSITE'
        },
        enabled: !!user?.employee?.id,
    });

    const productivityData = rankingData?.data?.[0] || rankingData?.[0] || null;

    const statusPieData = useMemo(() => {
        return [
            { name: 'Foydali', value: productivityData?.usefulTime || 0, color: '#10B981' }, 
            { name: 'Foydasiz', value: productivityData?.unusefulTime || 0, color: '#EF4444' }, 
            { name: 'Boshqa', value: productivityData?.otherTime || 0, color: '#9CA3AF' }, 
        ].filter(d => d.value > 0);
    }, [productivityData]);

    if (!user?.employee?.id) return null;

    return (
        <div className="space-y-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Sites Bar Chart */}
                <div className="rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#1a1c23] shadow-sm overflow-hidden lg:col-span-2">
                    <div className="p-5 pb-2 border-b border-gray-100 dark:border-neutral-800">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Eng Koʻp Tashrif Buyurilgan Saytlar (daqiqalarda)</h3>
                    </div>
                    <div className="p-5">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topSitesChart} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                                    <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={12} width={100} tickFormatter={(val: string) => val.length > 15 ? val.substring(0,15) + '...' : val} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="time" name="time" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Status Pie Chart */}
                <div className="rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#1a1c23] shadow-sm overflow-hidden">
                    <div className="p-5 pb-2 border-b border-gray-100 dark:border-neutral-800">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Samaradorlik Taqsimoti</h3>
                    </div>
                    <div className="p-5">
                        <div className="h-64">
                            {statusPieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusPieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ percent }: any) => `${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {statusPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: "var(--color-bg-base-dark, #1f2937)", 
                                                border: "1px solid #374151",
                                                borderRadius: "8px",
                                            }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value: any) => [formatTime(value as number), "Vaqt"]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-sm text-gray-400">Ma'lumot yo'q</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Visits Line Chart */}
            <div className="rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#1a1c23] shadow-sm overflow-hidden">
                <div className="p-5 pb-2 border-b border-gray-100 dark:border-neutral-800">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Kunlik Tashriflar (soat boʻyicha)</h3>
                </div>
                <div className="p-5">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={visitedSitesChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={12} />
                                <YAxis yAxisId="left" stroke="#8B5CF6" fontSize={12} orientation="left" />
                                <YAxis yAxisId="right" stroke="#10B981" fontSize={12} orientation="right" />
                                <Tooltip content={<CustomTooltip />} />
                                <Line yAxisId="left" type="monotone" dataKey="time" name="time" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                <Line yAxisId="right" type="monotone" dataKey="visits" name="visits" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SitesCharts;
