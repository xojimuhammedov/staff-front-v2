import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import dayjs from 'dayjs';
import { useGetAllQuery } from 'hooks/api';
import { get } from 'lodash';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { chartData, DashboardData, LineChartData } from '../interface/dashboard.interface';

export const useDashboard = () => {
    const { control, watch } = useForm({
        defaultValues: {
            date: {
                endDate: dayjs().format("YYYY-MM-DD"),
                startDate: dayjs().subtract(7, 'day').format("YYYY-MM-DD"),
            }
        }
    })

    const paramsValue = watch('date') ? {
        startDate: dayjs(watch('date')?.startDate)?.format("YYYY-MM-DD"),
        endDate: dayjs(watch('date')?.endDate)?.format("YYYY-MM-DD")
    } : {
        endDate: dayjs().format("YYYY-MM-DD"),
        startDate: dayjs().subtract(7, 'day').format("YYYY-MM-DD"),
    }

    const { data } = useGetAllQuery<DashboardData>({
        key: KEYS.dashbord,
        url: URLS.dashbord,
        params: {
            ...paramsValue
        }
    })

    const { data: dashboardToday } = useGetAllQuery<any>({
        key: KEYS.dashboardToday,
        url: URLS.dashboardToday,
        params: {}
    })

    const { data: topEmployee } = useGetAllQuery<any>({
        key: KEYS.dashboardTodayTop,
        url: URLS.dashboardTodayTop,
        params: {
            ...paramsValue
        }
    })
    const { data: bottomEmployee } = useGetAllQuery<any>({
        key: KEYS.dashboardTodayBottom,
        url: URLS.dashboardTodayBottom,
        params: {
            ...paramsValue
        }
    })

    const { data: chartData } = useGetAllQuery<LineChartData>({
        key: KEYS.dashboardLineChart,
        url: URLS.dashboardLineChart,
        params: {
            ...paramsValue
        }
    });

    const lineChartData = useMemo(() => {
        const items = get(chartData, 'data', []) as chartData[];

        const dates: string[] = [];
        const absents: number[] = [];
        const lates: number[] = [];
        const onTimes: number[] = [];

        items.forEach((item) => {
            dates.push(item.date || '');
            absents.push(item.absent || 0);
            lates.push(item.late || 0);
            onTimes.push(item.onTime || 0);
        });

        return { dates, absents, lates, onTimes };
    }, [chartData]);


    return {
        data,
        lineChartData,
        control,
        todayData: dashboardToday,
        topEmployee,
        bottomEmployee
    }
}

