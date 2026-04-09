import { lazy, LazyExoticComponent, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';

const Apps = lazy(() => import('./Apps/Apps'))
const Sites = lazy(() => import('./Sites/Sites'))
const Screenshots = lazy(() => import('./Screenshots/Screenshots'))
const Keylogs = lazy(() => import('./Keylogs/Keylogs'))
const UserSessions = lazy(() => import('./UserSessions/UserSessions'))
const CommandHistory = lazy(() => import('./CommandHistory/CommandHistory'))

type RulesType = 'apps' | 'sites' | 'screenshots' | 'keylogs' | 'user-sessions' | 'command-history';

const contents: Partial<Record<RulesType, LazyExoticComponent<React.FC<any>>>> = {
    apps: Apps,
    sites: Sites,
    screenshots: Screenshots,
    keylogs: Keylogs,  
    'user-sessions': UserSessions,
    'command-history': CommandHistory,
};


const MainContent = ({ user }: { user?: any }) => {
    const [searchParams] = useSearchParams();

    const currentRuleKey = Object.hasOwn(contents, searchParams.get('current-setting') as string)
        ? searchParams.get('current-setting')
        : 'apps';

    const Component = contents[currentRuleKey as RulesType] || Apps;

    return (
        <div className="flex-1">
            <Suspense fallback={<div />}>
                <Component user={user} />
            </Suspense>
        </div>
    );
};

export default MainContent;
