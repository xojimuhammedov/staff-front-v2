import React from 'react';
import { Users, Monitor, Grid3x3, Building2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DashboardCardProps, StatCardProps } from '../interface/dashboard.interface';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const StatCard: React.FC<StatCardProps & { link?: string }> = ({
  icon,
  title,
  value,
  change,
  changeType,
  bgColor,
  iconColor,
  link,
}) => {
  const navigate = useNavigate();
  const getChangeStyles = () => {
    switch (changeType) {
      case 'increase':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300';
      case 'neutral':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getChangeIcon = () => {
    if (changeType === 'increase') {
      return <TrendingUp size={14} className="text-green-600 dark:text-white" />;
    }

    return '';
  };

  return (
    <div
      className="group w-full rounded-2xl p-4
        bg-bg-base dark:bg-dark-dashboard-cards
        shadow-base border border-transparent
        flex items-center gap-4
        cursor-pointer select-none"
      role="button"
      tabIndex={0}
      onClick={() => link && navigate(link)}
    >
      <div
        className={`
      ${bgColor} border
      w-16 h-16 rounded-[20px]
      flex items-center justify-center
      shrink-0
  
    `}
      >
        <div className={`${iconColor}`}>{icon}</div>
      </div>

      <div className="flex flex-col gap-1 w-full min-w-0">
        <div className="flex items-start justify-between gap-3 w-full">
          <div className="text-4xl font-bold text-gray-900 dark:text-text-title-dark leading-none">
            {value}
          </div>

          <div
            className={`
                        inline-flex items-center gap-1 px-3 py-1 rounded-full
                        text-xs font-medium whitespace-nowrap
                        ${getChangeStyles()}
                        transition-colors duration-200`}
          >
            {changeType !== 'none' && <span>{getChangeIcon()}</span>}
            <span>{change}</span>
          </div>
        </div>

        <div className="text-sm font-semibold text-gray-500 dark:text-text-title-dark uppercase tracking-wide truncate">
          {title}
        </div>
      </div>
    </div>
  );
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  totalEmployees,
  totalComputers,
  totalDepartments,
  totalOrganizations,
  newEmployeesCount,
  newComputersCount,
  newDepartmentsCount,
  newOrganizationsCount,
}) => {
  const { t } = useTranslation();
  const stats = [
    {
      icon: <Users size={28} strokeWidth={2} />,
      title: t('Total Employees'),
      value: String(totalEmployees ?? 0),
      change: Number(newEmployeesCount) > 0 ? `+${newEmployeesCount}` : '0',
      changeType: Number(newEmployeesCount) > 0 ? ('increase' as const) : ('neutral' as const),
      bgColor: 'border-purple-600',
      iconColor: 'text-purple-600',
      link: '/employees',
    },
    {
      icon: <Monitor size={28} strokeWidth={2} />,
      title: t('Total Computers'),
      value: String(totalComputers ?? 0),
      change: Number(newComputersCount ?? 0) > 0 ? `+${newComputersCount}` : '0',
      changeType: Number(newComputersCount ?? 0) > 0 ? ('increase' as const) : ('neutral' as const),
      bgColor: 'border-pink-600',
      iconColor: 'text-pink-600',
      link: '/device',
    },
    {
      icon: <Grid3x3 size={28} strokeWidth={2} />,
      title: t('Total Departments'),
      value: String(totalDepartments ?? 0),
      change: Number(newDepartmentsCount) > 0 ? `+${newDepartmentsCount}` : '0',
      changeType: Number(newDepartmentsCount) > 0 ? ('increase' as const) : ('neutral' as const),
      bgColor: 'border-blue-600',
      iconColor: 'text-blue-600',
      link: '/department',
    },
    {
      icon: <Building2 size={28} strokeWidth={2} />,
      title: t('Total Organizations'),
      value: String(totalOrganizations ?? 0),
      change: Number(newOrganizationsCount) > 0 ? `+${newOrganizationsCount}` : '0',
      changeType: Number(newOrganizationsCount) > 0 ? ('increase' as const) : ('neutral' as const),
      bgColor: 'border-yellow-600',
      iconColor: 'text-yellow-600',
      link: '/organization',
    },
  ];

  return (
    <div className="grid mt-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default React.memo(DashboardCard);
