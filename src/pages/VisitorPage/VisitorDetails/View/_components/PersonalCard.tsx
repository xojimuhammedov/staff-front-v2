import React from 'react';
import IconByName from 'assets/icons/IconByName';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

interface VisitorInfoData {
    phone: string;
    workPlace: string;
    pinfl: string;
    passportNumber: string;
    birthday: string;
    organizationId?: number;
    attachId?: number;
    additionalDetails?: string;
}

interface PersonalInfoProps {
    data: VisitorInfoData;
    organizationName?: string;
    employeeName?: string;
}

const PersonalInfoCard: React.FC<PersonalInfoProps> = ({ data, organizationName, employeeName }) => {
    const { t } = useTranslation()

    const infoItems = [
        {
            label: t("Phone Number"),
            value: data?.phone,
            Icon: "Phone",
            iconColor: 'text-yellow-500'
        },
        {
            label: t("Work Place"),
            value: data?.workPlace,
            Icon: 'MapPin',
            iconColor: 'text-blue-500'
        },
        {
            label: t("Pinfl"),
            value: data?.pinfl,
            Icon: 'Hash',
            iconColor: 'text-gray-500'
        },
        {
            label: t("Passport Number"),
            value: data?.passportNumber,
            Icon: 'FileText',
            iconColor: 'text-purple-500'
        },
        {
            label: t("Birthday"),
            value: data?.birthday ? dayjs(data.birthday).format('DD/MM/YYYY') : '--',
            Icon: 'Calendar',
            iconColor: 'text-orange-500'
        },
        ...(organizationName ? [{
            label: t("Organization"),
            value: organizationName,
            Icon: 'Building',
            iconColor: 'text-yellow-700'
        }] : []),
        ...(employeeName ? [{
            label: t("Attached Employee"),
            value: employeeName,
            Icon: 'User',
            iconColor: 'text-green-500'
        }] : []),
    ];

    return (
        <div className="bg-[#FFF8E1] p-6 shadow-lg w-2/5 rounded-lg border border-gray-100">
            <h2 className="text-lg font-semibold mb-6 text-gray-800">
                {t("Personal Information")}
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
