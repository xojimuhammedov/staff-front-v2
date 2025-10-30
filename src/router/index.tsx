import EmployeeDetails from 'pages/EmployeePage/EmployeeDetails';
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
const PolicyPage = lazy(() => import('pages/PolicyPages/PolicyListPage'))
const PoliceCreatePage = lazy(() => import('pages/PolicyPages/CreatePolicyRulePage'))
const ProfilePage = lazy(() => import('pages/ProfilePage'))
const PolicyGroups = lazy(() => import('pages/PolicyGroups'))
const PolicyGroupCreate = lazy(() => import('pages/PolicyGroups/_components/Create'))
const PolicyGroupEdit = lazy(() => import('pages/PolicyPages/EditPolicyRulePage'))
const EmployeeGroup = lazy(() => import('pages/EmployeeGroup'))
const EmployeeGroupCreate = lazy(() => import('pages/EmployeeGroup/_components/Create'))
const EmployeeGroupEdit = lazy(() => import('pages/EmployeeGroup/_components/Edit'))
const SettingsPage = lazy(() => import('pages/SettingsPage'))
const DoorCreate = lazy(() => import('pages/SettingsPage/_components/SettingForms/DoorCreate'))

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
    roles: ["ADMIN", "HR", "DEPARTMENT_LEAD", "GUARD"], // kimlar ko‘ra oladi
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
    roles: ["ADMIN", "HR", "DEPARTMENT_LEAD", "GUARD"],
  },
  {
    path: '/employees/edit/:id',
    element: <EditEmployee />,
    roles: ["ADMIN", "HR", "DEPARTMENT_LEAD", "GUARD"],
  },
  {
    path: '/visitor',
    element: <VisitorPage />,
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
    path: '/employee-group',
    element: <EmployeeGroup />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: '/employee-group/create',
    element: <EmployeeGroupCreate />,
    roles: ["ADMIN", "HR"],
  },
  {
    path: '/employee-group/:id',
    element: <EmployeeGroupEdit />,
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
    path:"/employees/about/:id",
    element: <EmployeeDetails />,
    roles: ["ADMIN", "HR", "DEPARTMENT_LEAD", "GUARD"],
  }
];

