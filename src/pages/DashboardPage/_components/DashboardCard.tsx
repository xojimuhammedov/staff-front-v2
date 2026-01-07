import React from 'react';
import { Users, Monitor, Grid3x3, Building2 } from 'lucide-react';
import { DashboardCardProps, StatCardProps } from '../interface/dashboard.interface';


const StatCard: React.FC<StatCardProps> = ({
    icon,
    title,
    value,
    change,
    changeType,
    bgColor,
    iconColor
}) => {
    const getChangeStyles = () => {
        switch (changeType) {
            case 'increase':
                return 'bg-green-100 text-green-600';
            case 'neutral':
                return 'bg-gray-100 text-gray-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getChangeIcon = () => {
        if (changeType === 'increase') {
            return '↑';
        } else if (changeType === 'neutral') {
            return '';
        }
        return '';
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className={`${bgColor} w-16 h-16 rounded-[20px] flex items-center justify-center mb-4`}>
                <div className={iconColor}>
                    {icon}
                </div>
            </div>
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {title}
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-3">
                {value}
            </div>
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getChangeStyles()}`}>
                {changeType !== 'none' && <span>{getChangeIcon()}</span>}
                <span>{change}</span>
            </div>
        </div>
    );
};



const DashboardCard: React.FC<DashboardCardProps> = ({ totalEmployees, totalComputers, totalDepartments, totalOrganizations, newEmployeesCount, newComputersCount, newDepartmentsCount, newOrganizationsCount }) => {
    const stats = [
        {
            icon: <Users size={28} strokeWidth={2} />,
            title: 'Total Employees',
            value: String(totalEmployees ?? 0),
            change: `${newEmployeesCount} last 30 days`,
            changeType: 'increase' as const,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600'
        },
        {
            icon: <Monitor size={28} strokeWidth={2} />,
            title: 'Total Computers',
            value: String(totalComputers ?? 0),
            change: `${newComputersCount ?? ""} this month`,
            changeType: 'increase' as const,
            bgColor: 'bg-pink-100',
            iconColor: 'text-pink-600'
        },
        {
            icon: <Grid3x3 size={28} strokeWidth={2} />,
            title: 'Total Departments',
            value: String(totalDepartments ?? 0),
            change: `${newDepartmentsCount} this month`,
            changeType: 'increase' as const,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            icon: <Building2 size={28} strokeWidth={2} />,
            title: 'Total Organizations',
            value: String(totalOrganizations ?? 0),
            change: `${newOrganizationsCount} this month`,
            changeType: 'increase' as const,
            bgColor: 'bg-yellow-100',
            iconColor: 'text-yellow-600'
        }
    ];

    return (
        <div className="grid mt-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default React.memo(DashboardCard)