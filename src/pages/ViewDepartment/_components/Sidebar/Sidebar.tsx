import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import SidebarMenu from './SidebarMenu';
import { SidebarMenuType } from 'types/sidebar';

type MenuType = 'simple' | 'open-close';

interface SidebarProps {
    sidebar_menu_type: MenuType;
    sidebar_menu: SidebarMenuType[]
}


const Sidebar: FC<SidebarProps> = ({ sidebar_menu_type = 'simple', sidebar_menu }) => {
    const { t } = useTranslation();

    return (
        <div className="h-max settings-sidebar w-[290px] rounded-m bg-bg-base p-m shadow-base dark:bg-bg-dark-bg">
            {sidebar_menu.map((menu, i) => (
                <SidebarMenu key={i} menu={menu} sidebar_menu_type={sidebar_menu_type} />
            ))}
        </div>
    );
};

export default Sidebar;
