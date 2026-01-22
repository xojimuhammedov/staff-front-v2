import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';

export const useDateParams = (defaultDays: number = 7) => {
    const { control, watch } = useForm({
        defaultValues: {
            date: {
                endDate: dayjs().format("YYYY-MM-DD"),
                startDate: dayjs().subtract(defaultDays, 'day').format("YYYY-MM-DD"),
            }
        }
    });

    const paramsValue = watch('date') ? {
        startDate: dayjs(watch('date')?.startDate)?.format("YYYY-MM-DD"),
        endDate: dayjs(watch('date')?.endDate)?.format("YYYY-MM-DD")
    } : {
        endDate: dayjs().format("YYYY-MM-DD"),
        startDate: dayjs().subtract(defaultDays, 'day').format("YYYY-MM-DD"),
    };

    return { control, watch, paramsValue };
};