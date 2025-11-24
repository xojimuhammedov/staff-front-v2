import React, { FC, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useSearchParams } from 'react-router-dom';
import IconByName from 'assets/icons/IconByName';
import { MySwitch } from 'components/Atoms/Form';
import { icons } from 'lucide-react';

interface SidebarItem {
  icon: keyof typeof icons;
  name: string;
  path: string;
  isSwitch: boolean;
  disabled: boolean;
}

interface SidebarMenuProps {
  menuIndex: number;
  sidebar_menu_type: string;
  menu: {
    title: string;
    items: SidebarItem[];
  };
}

const SidebarMenu: FC<SidebarMenuProps> = ({ menu, menuIndex, sidebar_menu_type }) => {
  const { title, items } = menu;
  const [searchParams, setSearchParams] = useSearchParams();

  const selected = searchParams.get('current-rule') || 'general-details';

  const [openMenu, setOpenMenu] = useState<boolean>(sidebar_menu_type === 'simple' ? true : false);

  const handleClick = (value: string) => {
    searchParams.set('current-step', `${menuIndex + 1}`);
    searchParams.set('current-rule', value);
    setSearchParams(searchParams);
  };

  return (
    <div>
      {title && (
        <div className="my-4xs flex items-center justify-between px-xs py-2xs">
          {sidebar_menu_type !== 'simple' ? (
            <>
              <div className="text-text-muted dark:text-text-title-dark">{title}</div>
              <IconByName
                name={'ChevronDown'}
                className={twMerge(
                  'h-5 w-5 cursor-pointer text-text-muted transition-all duration-300',
                  openMenu ? '-rotate-180' : ''
                )}
                onClick={() => setOpenMenu(!openMenu)}
              />
            </>
          ) : (
            <>
              <div className={'text-text-muted dark:text-text-title-dark'}>{title}</div>
            </>
          )}
        </div>
      )}
      <ul className={twMerge('flex flex-col gap-4xs', openMenu ? 'flex' : 'hidden')}>
        {items.map((item: any, index: number) => {
          const { name, icon, path, isSwitch, disabled } = item;
          return (
            <li
              key={index}
              className={twMerge(
                'flex items-center justify-between rounded-m px-xs py-3xs ',
                selected === path
                  ? 'bg-bg-subtle text-c-m text-black'
                  : ' dark:text-text-title-dark'
              )}>
              <div
                className="flex cursor-pointer items-center gap-2"
                onClick={() => disabled ? {} : handleClick(path)}>
                <IconByName name={icon} className="h-5 w-5 text-text-subtle" />
                <span
                  className={twMerge(
                    'settings-text text-text-base',
                    selected === path ? 'text-black' : 'dark:text-white'
                  )}>
                  {name}
                </span>
              </div>
              <div className="flex items-center">
                {isSwitch && <MySwitch onChange={() => { }} />}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SidebarMenu;
