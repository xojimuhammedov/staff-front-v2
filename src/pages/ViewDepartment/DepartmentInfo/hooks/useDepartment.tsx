import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import dayjs from 'dayjs';
import { useGetAllQuery, useGetOneQuery } from 'hooks/api';
import { get } from 'lodash';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { chartData, LineChartData } from '../interface/department.interface';
import { useLocation } from 'react-router-dom';
import { searchValue } from 'types/search';
import { paramsStrToObj } from 'utils/helper';

export const useDepartment = () => {
    const location = useLocation()
    const searchValue: searchValue = paramsStrToObj(location.search)
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

    const { data: getOne } = useGetOneQuery({
        id: Number(searchValue?.parentDepartmentId) || Number(searchValue.subdepartmentId),
        url: URLS.getAllListDepartment,
        params: {},
        enabled: !!Number(searchValue?.parentDepartmentId) || !!Number(searchValue.subdepartmentId)
    });

    const { data: chartData } = useGetAllQuery<LineChartData>({
        key: KEYS.dashboardLineChart,
        url: URLS.dashboardLineChart,
        params: {
            departmentId: Number(searchValue?.parentDepartmentId) || Number(searchValue.subdepartmentId),
            ...paramsValue,
        }
    });

    const { data: topEmployee } = useGetAllQuery<any>({
        key: KEYS.dashboardTodayTop,
        url: URLS.dashboardTodayTop,
        params: {
            departmentId: Number(searchValue?.parentDepartmentId) || Number(searchValue.subdepartmentId),
            ...paramsValue
        },
    });

    const { data: bottomEmployee } = useGetAllQuery<any>({
        key: KEYS.dashboardTodayBottom,
        url: URLS.dashboardTodayBottom,
        params: {
            departmentId: Number(searchValue?.parentDepartmentId) || Number(searchValue.subdepartmentId),
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
        lineChartData,
        control,
        departmentInfo: getOne?.data,
        topEmployee: topEmployee,
        bottomEmployee: bottomEmployee
    }
}

