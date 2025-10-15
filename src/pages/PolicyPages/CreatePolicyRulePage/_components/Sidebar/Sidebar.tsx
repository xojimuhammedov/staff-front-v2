import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import SidebarMenu from './SidebarMenu';


interface SidebarMenu {
  title: string;
  items: SidebarItem[];
}

interface SidebarProps {
  menus: SidebarMenu[]
}

interface SidebarItem {
  icon: string;
  name: string;
  path: string;
  isSwitch: boolean;
}

const Sidebar: FC<SidebarProps> = ({menus}) => {
  const { t } = useTranslation();

  return (
    <div className="h-max w-[320px] rounded-m bg-bg-base p-m shadow-base dark:bg-bg-dark-bg">
      {menus.map((menu:any, i:number) => (
        <SidebarMenu menu={menu} menuIndex={i}/>
      ))}
    </div>
  );
};

export default Sidebar;
