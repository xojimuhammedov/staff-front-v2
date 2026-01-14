import { lazy, LazyExoticComponent, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';

const AttendancesInfo = lazy(() => import('../AttendancesInfo'));

type RulesType = 'attendance';

const contents: Record<RulesType, LazyExoticComponent<() => JSX.Element>> = {
  attendance: AttendancesInfo,
};

const MainContent = () => {
  const [searchParams] = useSearchParams();

  const currentRuleKey = Object.hasOwn(contents, searchParams.get('current-setting') as string)
    ? searchParams.get('current-setting')
    : 'attendance';

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
