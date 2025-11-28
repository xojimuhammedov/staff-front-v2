import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import SidebarMenu from './SidebarMenu';
import { SidebarMenuType } from 'types/sidebar';

type MenuType = 'simple' | 'open-close';

interface SidebarProps {
  sidebar_menu_type: MenuType;
}

const Sidebar: FC<SidebarProps> = ({ sidebar_menu_type = 'simple' }) => {
  const { t } = useTranslation();

  const sidebar_menu: SidebarMenuType[] = [
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
    <div className="h-max w-[320px] rounded-m bg-bg-base p-m shadow-base">
      {sidebar_menu.map((menu: any, i: number) => (
        <SidebarMenu menu={menu} menuIndex={i} />
      ))}
    </div>
  );
};

export default Sidebar;
