import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SidebarMenuType } from 'types/sidebar';
import SidebarMenu from './SidebarMenu';

type MenuType = 'simple' | 'open-close';

interface SidebarProps {
    sidebar_menu_type?: MenuType;
}

const Sidebar: FC<SidebarProps> = ({ sidebar_menu_type = 'simple' }) => {
    const { t } = useTranslation();

    const sidebar_menu: SidebarMenuType[] = [
        {
            title: t('Monitoring'),
            items: [
                {
                    icon: 'User',
                    name: t('Apps'),
                    path: 'apps',
                    isSwitch: false
                },
                {
                    icon: 'CreditCard',
                    name: t('Sites'),
                    path: 'sites',
                    isSwitch: false
                },
                {
                    icon: 'Laptop',
                    name: t('Screenshots'),
                    path: 'screenshots',
                    isSwitch: false
                },
                {
                    icon: 'CalendarClock',
                    name: t('Keylogs'),
                    path: 'keylogs',
                    isSwitch: false
                },
                {
                    icon: 'Users',
                    name: t('User Sessions'),
                    path: 'user-sessions',
                    isSwitch: false
                },
                {
                    icon: 'Terminal',
                    name: t('Command History'),
                    path: 'command-history',
                    isSwitch: false
                },
            ]
        }
    ];

    return (
        <div className="h-max settings-sidebar">
            {sidebar_menu.map((menu, i) => (
                <SidebarMenu key={i} menu={menu} sidebar_menu_type={sidebar_menu_type} />
            ))}
        </div>
    );
};

export default Sidebar;
