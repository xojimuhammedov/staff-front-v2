export interface DashboardData {
    totalEmployees?: number;
    newEmployeesCount?: number;
    totalComputers?: number;
    newComputersCount?: number;
    totalDepartments?: number;
    newDepartmentsCount?: number;
    totalOrganizations?: number;
    newOrganizationsCount?: number;
}

export interface chartData {
    absent?: number;
    late?: number;
    onTime?: number;
    date?: string
}

export interface LineChartData {
    employeeCount?: number;
    data: chartData[]
}


export interface DashboardCardProps {
    totalEmployees?: number;
    newEmployeesCount?: number;
    totalComputers?: number;
    newComputersCount?: number;
    totalDepartments?: number;
    newDepartmentsCount?: number;
    totalOrganizations?: number;
    newOrganizationsCount?: number;
}

export interface StatCardProps {
    icon?: React.ReactNode;
    title: string;
    value: string;
    change?: string;
    changeType?: 'increase' | 'neutral' | 'none';
    bgColor?: string;
    iconColor?: string;
}