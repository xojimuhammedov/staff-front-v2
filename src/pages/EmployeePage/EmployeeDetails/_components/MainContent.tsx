import { lazy, LazyExoticComponent, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';

const Credentials = lazy(() => import('../Credentials/Credentials'))
const EmployeeView = lazy(() => import('../View'))
const AttendancesInfo = lazy(() => import('../AttendancesInfo'))
const Productivity = lazy(() => import('../Productivity'))

type RulesType = 'view' | 'details' | 'attendance' | 'productivity';

const contents: Record<RulesType, LazyExoticComponent<() => JSX.Element>> = {
    view: EmployeeView,
    details: Credentials,
    attendance: AttendancesInfo,
    productivity: Productivity
};


const MainContent = () => {
    const [searchParams] = useSearchParams();


    const currentRuleKey = Object.hasOwn(contents, searchParams.get('current-setting') as string)
        ? searchParams.get('current-setting')
        : 'view';

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
