import { lazy, LazyExoticComponent, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';

const DepartmentList = lazy(() => import('./DepartmentList'))
const EmployeeListDepartment = lazy(() => import('./EmployeeList'))


type RulesType = 'department' | 'subdepartment' | 'employee_list';

const contents: Record<RulesType, LazyExoticComponent<() => JSX.Element>> = {
    department: DepartmentList,
    subdepartment: DepartmentList,
    employee_list: EmployeeListDepartment,
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
