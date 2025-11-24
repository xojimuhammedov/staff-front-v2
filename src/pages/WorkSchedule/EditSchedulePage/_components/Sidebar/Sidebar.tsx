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
  stepper_title: string;
  items: SidebarItem[];
}

const Sidebar: FC<SidebarProps> = ({ sidebar_menu_type = 'simple' }) => {
  const { t } = useTranslation();

  const sidebar_menu: SidebarMenu[] = [
    {
      title: t('General info'),
      stepper_title: t('Schedule details'),
      items: [
        {
          icon: 'Settings2',
          name: t('Schedule details'),
          path: 'general-details',
          isSwitch: false,
        },
        {
          icon: 'Settings2',
          name: t('Employee groups'),
          path: 'employee-groups',
          isSwitch: false,
        }
      ]
    }
  ];

  return (
    <div className="h-max w-[320px] rounded-m bg-bg-base p-m shadow-base dark:bg-bg-dark-bg">
      {sidebar_menu.map((menu: any, i: number) => (
        <SidebarMenu menu={menu} menuIndex={i} />
      ))}
    </div>
  );
};

export default Sidebar;
