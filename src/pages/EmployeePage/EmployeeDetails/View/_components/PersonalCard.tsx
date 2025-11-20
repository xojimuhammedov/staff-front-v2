import React from 'react';
import IconByName from 'assets/icons/IconByName';

interface PersonalInfoData {
    phone: string;
    carPlateNumber: string;
    workSchedule: string;
    address: string;
    department: any;
    todayActiveTime: string;
}

interface PersonalInfoProps {
    data: PersonalInfoData;
}

const PersonalInfoCard: React.FC<PersonalInfoProps> = ({ data }) => {
    const infoItems = [
        {
            label: "PHONE",
            value: data?.phone,
            Icon: "Phone",
            iconColor: 'text-yellow-500' // Rasmdagi kabi rangni ta'minlash uchun
        },
        {
            label: "CAR PLATE NUMBER",
            value: "HRN 996 09",
            Icon: 'Car',
            iconColor: 'text-gray-500'
        },
        {
            label: "WORK SCHEDULE",
            value: 'Mon - Fri, 9:00 AM - 6:00 PM',
            Icon: 'Clock',
            iconColor: 'text-orange-500'
        },
        {
            label: "ADDRESS",
            value: data?.address,
            Icon: 'MapPin',
            iconColor: 'text-blue-500'
        },
        {
            label: "DEPARTMENT",
            value: data?.department?.fullName,
            Icon: 'Building',
            iconColor: 'text-yellow-700'
        },
    ];

    return (
        <div className="bg-[#FFF8E1] p-6 shadow-lg w-2/5 rounded-lg border border-gray-100">
            <h2 className="text-lg font-semibold mb-6 text-gray-800">
                Personal Information
            </h2>
            {
                infoItems?.map((item) => (
                    <div className="flex items-start my-4 space-x-4">
                        <IconByName name={item?.Icon} width={'22px'} />
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {item.label}
                            </span>
                            <span className="text-lg font-normal text-gray-900 mt-0.5">
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