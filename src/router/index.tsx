import EmployeeDetails from 'pages/EmployeePage/EmployeeDetails';
import VisitorDetails from 'pages/VisitorPage/VisitorDetails';
import { lazy } from 'react';

const LoginPage = lazy(() => import('pages/LoginPage'))
const DashboardPage = lazy(() => import('pages/DashboardPage'))
const OrganizationPage = lazy(() => import('pages/OrganizationPage'))
const DepartmentPage = lazy(() => import('pages/DepartmentsPage'))
const UserManagment = lazy(() => import('pages/UserManagment'))
const EmployeePage = lazy(() => import('pages/EmployeePage'))
const EmployeeCreate = lazy(() => import('pages/EmployeePage/Create'))
const EditEmployee = lazy(() => import('pages/EmployeePage/Edit'))
const VisitorPage = lazy(() => import('pages/VisitorPage'))
const VisitorCreate = lazy(() => import('pages/VisitorPage/VisitorCreate'))
const PolicyPage = lazy(() => import('pages/PolicyPages/PolicyListPage'))
const PoliceCreatePage = lazy(() => import('pages/PolicyPages/CreatePolicyRulePage'))
const ProfilePage = lazy(() => import('pages/ProfilePage'))
const PolicyGroups = lazy(() => import('pages/PolicyGroups'))
const PolicyGroupCreate = lazy(() => import('pages/PolicyGroups/_components/Create'))
const PolicyGroupEdit = lazy(() => import('pages/PolicyPages/EditPolicyRulePage'))
const SettingsPage = lazy(() => import('pages/SettingsPage'))
const DoorCreate = lazy(() => import('pages/SettingsPage/_components/SettingForms/DoorCreate'))
const DoorEdit = lazy(() => import('pages/SettingsPage/DoorEdit'))
const HikvisionDoorByEmployee = lazy(() => import('pages/SettingsPage/_components/SettingForms/MainGate'))
const Attendances = lazy(() => import('pages/Attendances'))
const WorkSchedule = lazy(() => import('pages/WorkSchedule'))
const CreateSchedulePage = lazy(() => import('pages/WorkSchedule/CreateSchedulePage'))
const EditSchedulePage = lazy(() => import('pages/WorkSchedule/EditSchedulePage'))
const ViewDepartment = lazy(() => import('pages/ViewDepartment'))

const DeviceCreatePage = lazy(() => import('pages/SettingsPage/DevicePage/Create'))
const DeviceEditPage = lazy(() => import('pages/SettingsPage/DevicePage/Edit'))
const ViewDevice = lazy(() => import('pages/SettingsPage/DevicePage/_components/ViewDevice'))
const GuardPage = lazy(() => import('pages/GuardPage'))
const TablePage = lazy(() => import('pages/TablePage'))
const ReportAttendance = lazy(() => import('pages/ReportPage/ReportAttendance'))

export const PublicRoutes = [
  {
    path: '/login',
    element: <LoginPage />
  }
];

export const PrivateRoutes = [
  {
    path: '/',
    element: <DashboardPage />,
    roles: ["ADMIN", "HR", "DEPARTMENT_LEAD"], // kimlar ko‘ra oladi
  },
  {
    path: '/profile/edit',
    element: <ProfilePage />,
    roles: ["ADMIN", "HR", "DEPARTMENT_LEAD", "GUARD"],
  },
  {
    path: '/organization',
    element: <OrganizationPage />,
    roles: ["ADMIN"],
  },
  {
    path: '/view',
    element: <ViewDepartment />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: '/department',
    element: <DepartmentPage />,
    roles: ["ADMIN", "HR", "DEPARTMENT_LEAD"],
  },
  {
    path: "/users",
    element: <UserManagment />,
    roles: ["ADMIN"],
  },
  {
    path: "/employees",
    element: <EmployeePage />,
    roles: ["ADMIN", "HR", "DEPARTMENT_LEAD", "GUARD"],
  },
  {
    path: '/employees/create',
    element: <EmployeeCreate />,
    roles: ["ADMIN", "HR", "DEPARTMENT_LEAD"],
  },
  {
    path: '/employees/edit/:id',
    element: <EditEmployee />,
    roles: ["ADMIN", "HR", "DEPARTMENT_LEAD"],
  },
  {
    path: '/visitor',
    element: <VisitorPage />,
    roles: ["ADMIN", "HR", "DEPARTMENT_LEAD", "GUARD"],
  },
  {
    path: '/visitor/create',
    element: <VisitorCreate />,
    roles: ["ADMIN", "HR", "GUARD"],
  },
  {
    path: "/visitor/about/:id",
    element: <VisitorDetails />,
    roles: ["ADMIN", "HR", "DEPARTMENT_LEAD", "GUARD"],
  },
  {
    path: '/policy',
    element: <PolicyPage />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: '/policy/create',
    element: <PoliceCreatePage />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: '/policy/groups',
    element: <PolicyGroups />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: '/policy/groups/create',
    element: <PolicyGroupCreate />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: '/policy/edit/:id',
    element: <PolicyGroupEdit />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: '/settings',
    element: <SettingsPage />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: '/settings/door/create',
    element: <DoorCreate />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: "/employees/about/:id",
    element: <EmployeeDetails />,
    roles: ["ADMIN", "HR", "DEPARTMENT_LEAD", "GUARD"],
  },
  {
    path: '/settings/door/edit/:id',
    element: <DoorEdit />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: "/settings/maingate/:id",
    element: <HikvisionDoorByEmployee />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: "/attendances",
    element: <Attendances />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: '/workschedule',
    element: <WorkSchedule />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: '/workschedule/create',
    element: <CreateSchedulePage />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: '/workschedule/edit/:id',
    element: <EditSchedulePage />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: '/reports/attendance',
    element: <ReportAttendance />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: '/device/create',
    element: <DeviceCreatePage />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: '/device/edit/:id',
    element: <DeviceEditPage />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: '/settings/device/:id',
    element: <ViewDevice />,
    roles: ["ADMIN", "HR"]
  },
  {
    path: '/guards',
    element: <GuardPage />,
    roles: ["GUARD", "ADMIN"]
  },
  {
    path: '/table',
    element: <TablePage />,
    roles: ["ADMIN", "HR", "DEPARTMENT_LEAD", "GUARD"]
  }
];

