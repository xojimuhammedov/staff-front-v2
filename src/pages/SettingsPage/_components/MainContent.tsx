import { lazy, LazyExoticComponent, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';

const DevicePage = lazy(() => import('../DevicePage'));
const DoorsPage = lazy(() => import('./SettingForms/DoorsPage'));
const ReasonType = lazy(() => import('../ReasonType'))
const JobPosition = lazy(() => import('../JobPosition'))

type RulesType = 'deviceControl' | 'doors' | 'reason_type' | 'job_position';

const contents: Record<RulesType, LazyExoticComponent<() => JSX.Element>> = {
  deviceControl: DevicePage,
  doors: DoorsPage,
  reason_type: ReasonType,
  job_position: JobPosition
};

const MainContent = () => {
  const [searchParams] = useSearchParams();

  const currentRuleKey = Object.hasOwn(contents, searchParams.get('current-setting') as string)
    ? searchParams.get('current-setting')
    : 'doors';

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
