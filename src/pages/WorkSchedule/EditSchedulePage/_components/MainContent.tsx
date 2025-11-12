import { lazy, LazyExoticComponent, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';

const GeneralDetails = lazy(() => import('./RuleForms/GeneralDetails'));
const EditEmployeeGroup = lazy(() => import('./RuleForms/EditEmployeeGroup'))

type RulesType = 'general-details' | 'employee-groups';

const contents: Record<RulesType, LazyExoticComponent<() => JSX.Element>> = {
  'general-details': GeneralDetails,
  'employee-groups': EditEmployeeGroup
};

const MainContent = () => {
  const [searchParams] = useSearchParams();

  const currentRuleKey = Object.hasOwn(contents, searchParams.get('current-rule') as string)
    ? searchParams.get('current-rule')
    : 'general-details';

  const Component = contents[currentRuleKey as RulesType];

  return (
    <div className="min-h-[654px] flex-1 rounded-m bg-bg-base p-l  shadow-base dark:bg-bg-dark-bg">
      <Suspense fallback={<div />}>
        <Component />
      </Suspense>
    </div>
  );
};

export default MainContent;
