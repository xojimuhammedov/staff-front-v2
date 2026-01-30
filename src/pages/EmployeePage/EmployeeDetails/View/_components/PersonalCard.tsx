import React from 'react';
import IconByName from 'assets/icons/IconByName';
import { useTranslation } from 'react-i18next';

interface Schedule {
    startTime: string,
    endTime: string,
    weekdays: string
}

interface CredentialType {
    type: string,
    code: string
}

interface PersonalInfoData {
    phone: string;
    carPlateNumber: string;
    workSchedule: string;
    address: string;
    department: any;
    todayActiveTime: string;
    plan: Schedule,
    credentials?: CredentialType[]
}

interface PersonalInfoProps {
    data: PersonalInfoData;
}

const PersonalInfoCard: React.FC<PersonalInfoProps> = ({ data }) => {
    const { t } = useTranslation()
    const formatWeekdaysRange = (weekdaysString: string) => {
        if (!weekdaysString) return '-';
        const days = weekdaysString
            .split(',')
            .map(d => d.trim())
            .filter(Boolean)
            .map((day) => t(day));
        return days.length > 1
            ? `${days[0]} - ${days[days?.length - 1]}`
            : days[0] || '-';
    };

    const carCode = data?.credentials?.find((item: CredentialType) => item?.type === "CAR")
    const infoItems = [
        {
            label: t("PHONE"),
            value: data?.phone,
            Icon: "Phone",
            iconColor: 'text-yellow-500' 
        },
        {
            label: t("CAR PLATE NUMBER"),
            value: carCode?.code,
            Icon: 'Car',
            iconColor: 'text-gray-500'
        },
        {
            label: t("WORK SCHEDULE"),
            value: `${formatWeekdaysRange(data?.plan?.weekdays)}, ${data?.plan?.startTime} - ${data?.plan?.endTime}`,
            Icon: 'Clock',
            iconColor: 'text-orange-500'
        },
        {
            label: t("ADDRESS"),
            value: data?.address,
            Icon: 'MapPin',
            iconColor: 'text-blue-500'
        },
        {
            label: t("DEPARTMENT"),
            value: data?.department?.fullName,
            Icon: 'Building',
            iconColor: 'text-yellow-700'
        },
    ];

    return (
        <div className="bg-[#FFF8E1] dark:bg-dark-dashboard-cards p-6 shadow-lg w-2/5 rounded-lg border border-gray-100 dark:border-dark-line">
            <h2 className="text-lg font-semibold mb-6 text-gray-800 dark:text-text-title-dark">
                {t("Personal Information")}
            </h2>
            {
                infoItems?.map((item) => (
                    <div className="flex items-start my-4 space-x-4">
                           <IconByName 
                            name={item?.Icon} 
                            width={'22px'} 
                            className="text-gray-700 dark:text-white"
                            stroke="currentColor"
                        />
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 dark:text-text-muted uppercase tracking-wider">
                                {item.label}
                            </span>
                            <span className="text-lg font-normal text-gray-900 dark:text-text-title-dark mt-0.5">
                                {item?.value}
                            </span>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default React.memo(PersonalInfoCard);