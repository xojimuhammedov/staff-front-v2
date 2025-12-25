import React from "react";
import { CarFront, Clock, CreditCard, LockKeyhole, UserRound } from "lucide-react";
import dayjs from "dayjs";

// --------------------
// Types
// --------------------
type EventType = "ENTER" | "EXIT";

interface TimelineEvent {
    entryType: EventType;
    actionTime: string;
    actionType: string;
}

interface TimelineDay {
    day: string;
    date: string;
    events: TimelineEvent[];
}

// --------------------
// Mock Data
// --------------------
// const mockTimeline: TimelineDay[] = [
//     {
//         day: "Monday",
//         date: "Nov 18, 2025",
//         events: [
//             { type: "arrival", time: "08:55", method: "Face ID" },
//             { type: "departure", time: "18:05", method: "Car Plate" },
//         ],
//     },
//     {
//         day: "Tuesday",
//         date: "Nov 19, 2025",
//         events: [
//             { type: "arrival", time: "09:02", method: "Car Plate" },
//             { type: "departure", time: "17:50", method: "Face ID" },
//         ],
//     },
//     {
//         day: "Wednesday",
//         date: "Nov 20, 2025",
//         events: [
//             { type: "arrival", time: "08:58", method: "Face ID" },
//             { type: "departure", time: "18:00", method: "Face ID" },
//             { type: "arrival", time: "18:00", method: "Face ID" },
//             { type: "departure", time: "18:00", method: "Face ID" },
//         ],
//     },
//     {
//         day: "Thursday",
//         date: "Nov 21, 2025",
//         events: [
//             { type: "arrival", time: "08:50", method: "Car Plate" },
//             { type: "departure", time: "18:15", method: "Car Plate" },
//         ],
//     },
//     {
//         day: "Friday",
//         date: "Nov 22, 2025",
//         events: [
//             { type: "arrival", time: "08:59", method: "Face ID" },
//             { type: "departure", time: "17:55", method: "Face ID" },
//         ],
//     },
// ];

// --------------------
// Components
// --------------------
interface EventCardProps {
    event: TimelineEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const isArrival = event?.entryType === "ENTER";

    // console.log(event?.actionType)

    return (
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2 shadow-sm">
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${isArrival ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                    }`}
            >
                {/* <Clock size={14} /> */}
                {
                    event.actionType === "PHOTO" ? <UserRound size={20} /> : event.actionType === "CAR" ? <CarFront size={20} /> : event.actionType === "PERSONAL_CODE" ? <LockKeyhole size={20} /> : event.actionType === "CARD" ? <CreditCard size={20} /> : <Clock size={20} />
                }
            </div>
            <div>
                <p className="text-sm font-medium capitalize">{event?.entryType === "ENTER" ? "Arrival" : "Departure"}</p>
                <p className="text-xs text-gray-500">
                    {dayjs(event?.actionTime).format("HH:mm")} via {event?.actionType}
                </p>
            </div>
        </div>
    );
};

// --------------------
// Main UI
// --------------------
export default function ArrivalDepartureTimeline({ data }: any) {
    return (
        <div className="mt-8">
            <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">
                <h2 className="text-lg font-semibold">Arrival & Departure Timeline</h2>

                {data?.map((day: any) => (
                    <div key={day?.id} className="space-y-3">
                        <div>
                            <p className="font-bold text-lg">{day?.dayName}</p>
                            <p className="text-xs text-gray-500">{day.date}</p>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center gap-4">
                            {/* Indicator */}
                            <div className="flex flex-col items-center">
                                <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                                <div className="flex-1 w-px bg-gray-200" />
                            </div>

                            {/* Events */}
                            <div className="flex flex-wrap gap-4">
                                {day?.actions?.map((event: TimelineEvent, index: number) => (
                                    <EventCard key={index} event={event} />
                                ))}
                            </div>
                        </div>

                        <div className="border-b" />
                    </div>
                ))}
            </div>
        </div>
    );
}
