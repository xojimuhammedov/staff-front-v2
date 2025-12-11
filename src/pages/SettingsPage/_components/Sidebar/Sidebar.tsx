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
      items: [
        {
          icon: 'Puzzle',
          name: t('Doors'),
          path: 'doors',
          isSwitch: false
        },
        {
          icon: 'Bell',
          name: t('Devices'),
          path: 'deviceControl',
          isSwitch: false
        },
        {
          icon: 'Reason type',
          name: t('Reason type'),
          path: 'reason_type',
          isSwitch: false
        },
        {
          icon: "Reason type",
          name: t("Job name"),
          path: "job_position",
          isSwitch: false
        }
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
