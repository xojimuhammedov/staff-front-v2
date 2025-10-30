import { lazy, LazyExoticComponent, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';

const Credentials = lazy(() => import('./Credentials/Credentials'))

type RulesType = 'details' | 'details';

const contents: Record<RulesType, LazyExoticComponent<() => JSX.Element>> = {
    details: Credentials,
};


const MainContent = () => {
    const [searchParams] = useSearchParams();


    const currentRuleKey = Object.hasOwn(contents, searchParams.get('current-setting') as string)
        ? searchParams.get('current-setting')
        : 'details';

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
