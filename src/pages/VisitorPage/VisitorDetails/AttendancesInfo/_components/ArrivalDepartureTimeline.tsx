import React from 'react';
import { CarFront, Clock, CreditCard, LockKeyhole, QrCode, UserRound } from 'lucide-react';
import dayjs from 'dayjs';
import { t } from 'i18next';

// --------------------
// Types
// --------------------
type EventType = 'ENTER' | 'EXIT';

interface TimelineEvent {
  entryType: EventType;
  actionTime: string;
  actionType: string;
}

interface EventCardProps {
  event: any;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const isArrival = event?.entryType === 'ENTER';

  return (
    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
          isArrival ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        }`}
      >
        {event?.credential?.type === 'PHOTO' ? (
          <UserRound size={20} />
        ) : event?.credential?.type === 'CAR' ? (
          <CarFront size={20} />
        ) : event?.credential?.type === 'PERSONAL_CODE' ? (
          <LockKeyhole size={20} />
        ) : event?.credential?.type === 'CARD' ? (
          <CreditCard size={20} />
        ) : event?.credential?.type === 'QR' ? (
          <QrCode />
        ) : (
          <Clock />
        )}
      </div>
      <div>
        <p className="text-sm font-medium capitalize text-text-base dark:text-text-title-dark">
          {event?.entryType === 'ENTER' ? t('Arrival') : t('Departure')}
        </p>
        <p className="text-xs text-gray-500 dark:text-text-subtle">
          {dayjs(event?.actionTime).format('HH:mm')} {event?.credential?.type}
        </p>
      </div>
    </div>
  );
};

export default function ArrivalDepartureTimeline({ data }: any) {
  return (
    <div className="mt-8">
      <div className="bg-white dark:bg-bg-dark-bg rounded-2xl border dark:border-gray-700 shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-semibold text-text-base dark:text-text-title-dark">{t("Arrival & Departure Timeline")}</h2>

        {data?.map((day: any) => (
          <div key={day?.id} className="space-y-3">
            <div>
              <p className="font-bold text-lg text-text-base dark:text-text-title-dark">
                {day?.dayName ? t(day.dayName) : '--'}
              </p>
              <p className="text-xs text-gray-500 dark:text-text-title-dark">{day.date}</p>
            </div>

            {/* Timeline */}
            <div className="flex items-center gap-4">
              {/* Indicator */}
              <div className="flex flex-col items-center">
                <span className="w-3 h-3 bg-yellow-400 dark:bg-yellow-500 rounded-full" />
                <div className="flex-1 w-px bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Events */}
              <div className="flex flex-wrap gap-4">
                {day?.actions?.map((event: TimelineEvent, index: number) => (
                  <EventCard key={index} event={event} />
                ))}
              </div>
            </div>
            <div className="border-b dark:border-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );
}
