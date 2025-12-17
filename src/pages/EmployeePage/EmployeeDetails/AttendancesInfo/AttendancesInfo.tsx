import AttendanceCard from './_components/AttendancesCard';
import MyDivider from 'components/Atoms/MyDivider';
import ArrivalDepartureTimeline from './_components/ArrivalDepartureTimeline';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useParams } from 'react-router-dom';

interface AttendanceCardData {
    averageArrivalTime?: string;
    avgArrivalEarlyMinutes?: number;
    avgArrivalLateMinutes?: number;
    averageLeaveTime?: string;
    avgLeaveOvertimeMinutes?: number;
    avgLeaveEarlyMinutes?: number;
    totalTrackedHours?: string;
    lateArrivalsCount?: string;
    earlyLeavesCount?: string;
}

const AttendancesInfo = () => {
    const { id } = useParams()
    const { data } = useGetAllQuery({
        key: KEYS.actionAttendancesList,
        url: URLS.actionAttendancesList,
        params: {
            employeeId: id,
        }
    });

    const { data: cardData } = useGetAllQuery<AttendanceCardData>({
        key: KEYS.employeeByAttendancesCard,
        url: URLS.employeeByAttendancesCard,
        params: {
            employeeId: id,
            startDate: "2025-12-15",
            endDate: "2025-12-15"
        }
    });
    return (
        <>
            <h1 className='headers-core dark:text-text-title-dark text-text-base'>Attendance & Arrival/Leave Tracking</h1>
            <p>Monitor employee attendance patterns and punctuality</p>
            <MyDivider />
            <div className='grid grid-cols-3 gap-4'>
                <AttendanceCard
                    averageArrival={cardData?.averageArrivalTime || "-"}
                    title='Average Arrival Time'
                    statusText={`${cardData?.avgArrivalEarlyMinutes ?? cardData?.avgArrivalLateMinutes ?? ""}`}
                    statusClass={cardData?.avgArrivalEarlyMinutes === 0 ? "late" : "early"} />

                <AttendanceCard
                    averageArrival={cardData?.averageLeaveTime || "-"}
                    title='Average Arrival Time'
                    statusText={`${cardData?.avgLeaveOvertimeMinutes ?? cardData?.avgLeaveEarlyMinutes ?? ""}`}
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
