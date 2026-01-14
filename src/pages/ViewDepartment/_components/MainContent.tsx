import { lazy, LazyExoticComponent, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';

const SubDepartmentList = lazy(() => import('./DepartmentList'))
const DepartmentList = lazy(() => import('./DepartmentList'))
const EmployeeListDepartment = lazy(() => import('./EmployeeList'))
const EmployeeListSubDepartment = lazy(() => import('./EmployeeList'))
const ParentDepartmentInfo = lazy(() => import('../DepartmentInfo/DepartmentInfo'))
const SubDepartmentInfo = lazy(() => import('../DepartmentInfo/DepartmentInfo'))


type RulesType = 'department' | 'subdepartment' | 'employee_list' | 'sub_employee_list' | 'departmentInfo' | 'subdepartmentInfo';

const contents: Record<RulesType, LazyExoticComponent<() => JSX.Element>> = {
    department: DepartmentList,
    subdepartment: SubDepartmentList,
    employee_list: EmployeeListDepartment,
    departmentInfo: ParentDepartmentInfo,
    subdepartmentInfo: SubDepartmentInfo,
    sub_employee_list: EmployeeListSubDepartment
};

const MainContent = () => {
    const [searchParams] = useSearchParams();

    const currentRuleKey = Object.hasOwn(contents, searchParams.get('current-setting') as string)
        ? searchParams.get('current-setting')
        : 'department';

    const Component = contents[currentRuleKey as RulesType];

    return (
        <div className="min-h-[654px] flex-1 rounded-m bg-bg-base p-l shadow-base dark:bg-bg-dark-bg">
            <Suspense fallback={<div />}>
                <Component />
            </Suspense>
        </div>
    );
};

export default MainContent;
