import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import SidebarMenu from './SidebarMenu';

type MenuType = 'simple' | 'open-close';

interface SidebarProps {
    sidebar_menu_type: MenuType;
}

interface SidebarItem {
    icon: string;
    name: string;
    path: string;
    isSwitch: boolean;
}

interface SidebarMenu {
    title: string;
    items: SidebarItem[];
}

const Sidebar: FC<SidebarProps> = ({ sidebar_menu_type = 'simple' }) => {
    const { t } = useTranslation();

    const sidebar_menu: SidebarMenu[] = [
        {
            title: t('General info'),
            items: [
                {
                    icon: 'User',
                    name: t('Employee details'),
                    path: 'details',
                    isSwitch: false
                },
                {
                    icon: 'CarTaxiFront',
                    name: t('Cars and Cards'),
                    path: 'cars',
                    isSwitch: false
                },
                {
                    icon: 'Laptop',
                    name: t('Computers'),
                    path: 'computer',
                    isSwitch: false
                },
            ]
        }
    ];

    return (
        <div className="h-max settings-sidebar w-[290px] rounded-m bg-bg-base p-m shadow-base dark:bg-bg-dark-bg">
            {sidebar_menu.map((menu, i) => (
                <SidebarMenu key={i} menu={menu} sidebar_menu_type={sidebar_menu_type} />
            ))}
        </div>
    );
};

export default Sidebar;
