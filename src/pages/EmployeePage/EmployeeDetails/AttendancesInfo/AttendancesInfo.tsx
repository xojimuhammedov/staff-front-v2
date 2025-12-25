import AttendanceCard from './_components/AttendancesCard';
import MyDivider from 'components/Atoms/MyDivider';
import ArrivalDepartureTimeline from './_components/ArrivalDepartureTimeline';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useParams } from 'react-router-dom';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { timeLine } from 'utils/helper';

interface AttendanceCardData {
    averageArrivalTime?: any;
    avgArrivalEarlyMinutes?: number | null;
    avgArrivalLateMinutes?: number;
    averageLeaveTime?: any;
    avgLeaveOvertimeMinutes?: number;
    avgLeaveEarlyMinutes?: number;
    totalTrackedHours?: string;
    lateArrivalsCount?: string;
    earlyLeavesCount?: string;
}

const AttendancesInfo = () => {
    const { t } = useTranslation()
    const { control, watch } = useForm({
        defaultValues: {
            date: {
                endDate: dayjs().format("YYYY-MM-DD"),
                startDate: dayjs().subtract(3, 'day').format("YYYY-MM-DD"),
            }
        }
    })
    const { id } = useParams()

    const paramsValue = watch('date') ? {
        startDate: dayjs(watch('date')?.startDate)?.format("YYYY-MM-DD"),
        endDate: dayjs(watch('date')?.endDate)?.format("YYYY-MM-DD")
    } : {
        endDate: dayjs().format("YYYY-MM-DD"),
        startDate: dayjs().subtract(3, 'day').format("YYYY-MM-DD"),
    }
    const { data } = useGetAllQuery({
        key: KEYS.actionAttendancesList,
        url: URLS.actionAttendancesList,
        params: {
            employeeId: id,
            ...paramsValue
        }
    });

    const { data: cardData } = useGetAllQuery<AttendanceCardData>({
        key: KEYS.employeeByAttendancesCard,
        url: URLS.employeeByAttendancesCard,
        params: {
            employeeId: id,
            ...paramsValue
        }
    });
    return (
        <>
            <div className='flex items-center justify-between'>
                <div className='flex flex-col gap-2'>
                    <h1 className='headers-core dark:text-text-title-dark text-text-base'>Attendance & Arrival/Leave Tracking</h1>
                    <p>Monitor employee attendance patterns and punctuality</p>
                </div>
                <div className="flex items-center w-[240px]">
                    <MyTailwindPicker
                        useRange={true}
                        name='date'
                        asSingle={false}
                        control={control}
                        placeholder={t('Today')}
                        startIcon={<Calendar stroke="#9096A1" />}
                    />
                </div>
            </div>
            <MyDivider />
            <div className='grid grid-cols-5 gap-4'>
                <AttendanceCard
                    averageArrival={timeLine(cardData?.averageArrivalTime) || "-"}
                    title='Average Arrival Time'
                    statusText={`${cardData?.avgArrivalEarlyMinutes === 0 ? cardData?.avgArrivalLateMinutes : cardData?.avgArrivalEarlyMinutes}`}
                    statusClass={cardData?.avgArrivalEarlyMinutes === 0 ? "late" : "early"} />

                <AttendanceCard
                    averageArrival={timeLine(cardData?.averageLeaveTime) || "-"}
                    title='Average Arrival Time'
                    statusText={`${cardData?.avgLeaveOvertimeMinutes === 0 ? cardData?.avgLeaveEarlyMinutes : cardData?.avgLeaveOvertimeMinutes}`}
                    statusClass={cardData?.avgLeaveOvertimeMinutes === 0 ? "early" : "late"} />

                <AttendanceCard
                    averageArrival={cardData?.totalTrackedHours || "-"}
                    title='Total tracked hours' />

                {
                    cardData?.lateArrivalsCount ? <AttendanceCard
                        averageArrival={cardData?.lateArrivalsCount || "-"}
                        title='Late Arrivals' /> : ""
                }

                {
                    cardData?.earlyLeavesCount ? <AttendanceCard
                        averageArrival={cardData?.earlyLeavesCount || "-"}
                        title='Early Leaves' /> : ""
                }
            </div>
            <ArrivalDepartureTimeline data={data} />
        </>
    );
}

export default AttendancesInfo;
