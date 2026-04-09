import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { get } from 'lodash';
import { Lock, Unlock, Users } from 'lucide-react';
import { useGetAllQuery } from '@/hooks/api';
import { KEYS } from '@/constants/key';
import { URLS } from '@/constants/url';
import { paramsStrToObj } from 'utils/helper';

const UserSessions = ({ user }: { user?: any }) => {
    const { t } = useTranslation();
    const { id } = useParams();
    const location = useLocation();
    const searchValue: any = paramsStrToObj(location.search);

    const { data, isLoading } = useGetAllQuery<any>({
        key: KEYS.getUserSession,
        url: URLS.getUserSession,
        params: {
            page: 1,
            limit: 100,
            computerId: id,
            employeeId: user?.employee?.id,
            startDate: searchValue?.startDate,
            endDate: searchValue?.endDate,
        },
        enabled: !!id,
    });

    const sessions = get(data, 'data') || [];

    const groupedSessions = useMemo(() => {
        const groups: Record<string, any[]> = {};
        sessions.forEach((session: any) => {
            const dateStr = dayjs(session.datetime).format('YYYY-MM-DD');
            if (!groups[dateStr]) {
                groups[dateStr] = [];
            }
            groups[dateStr].push(session);
        });

        // Sort groups by date descending
        const sortedDates = Object.keys(groups).sort((a, b) => (dayjs(a).isBefore(dayjs(b)) ? 1 : -1));
        return sortedDates.map(date => ({
            date,
            items: groups[date].sort((a: any, b: any) => (dayjs(a.datetime).isBefore(dayjs(b.datetime)) ? 1 : -1))
        }));
    }, [sessions]);

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <Users className="h-5 w-5 text-primary" />
                    <h1 className="text-2xl font-semibold text-foreground">{t('User Sessions')}</h1>
                </div>
                <p className="text-muted-foreground">
                    {t('Foydalanuvchining kompyuterdagi sessiya tarixi (Qulflangan va Qulfdan chiqarilgan)')}
                </p>
            </div>

            {isLoading ? (
                <div className="py-8 text-center text-gray-500">{t('Yuklanmoqda...')}</div>
            ) : groupedSessions.length === 0 ? (
                <div className="py-8 text-center text-gray-500">{t('Ma\'lumot topilmadi')}</div>
            ) : (
                <div className="space-y-8">
                    {groupedSessions.map((group) => (
                        <div key={group.date} className="relative">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {dayjs(group.date).format('dddd')}
                                </h3>
                                <p className="text-sm text-gray-500">{group.date}</p>
                            </div>
                            
                            <div className="flex items-center gap-4 flex-wrap pb-4">
                                {/* Yellow dot for timeline feel, matching the UI image */}
                                <div className="h-3 w-3 rounded-full bg-yellow-500 flex-shrink-0" />
                                
                                {group.items.map((session: any, index: number) => {
                                    const timeStr = dayjs(session.datetime).format('HH:mm');
                                    const isLocked = session.sessionType === 'LOCKED';
                                    const isUnlocked = session.sessionType === 'UNLOCKED';
                                    
                                    // UI labels
                                    const label = isLocked ? t('Locked') : isUnlocked ? t('Unlocked') : session.sessionType;
                                    
                                    return (
                                        <div 
                                            key={session.id || index}
                                            className="flex flex-col rounded-lg cursor-pointer bg-gray-50 border border-gray-100 dark:bg-gray-800/50 dark:border-gray-700/50 px-4 py-3 min-w-[180px]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 flex flex-shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-600">
                                                    {isLocked ? (
                                                        <Lock className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                                    ) : (
                                                        <Unlock className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{label}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                                                        {timeStr}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserSessions;
