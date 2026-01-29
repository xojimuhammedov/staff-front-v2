import React, { FC, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import IconByName from 'assets/icons/IconByName';
import { MySwitch } from 'components/Atoms/Form';
import { useSearchParamsContext } from 'context/RouteContext';

type MenuType = 'simple' | 'open-close';

interface SidebarItem {
  icon: string;
  name: string;
  path: string;
  isSwitch: boolean;
}

interface SidebarMenuProps {
  sidebar_menu_type: MenuType;
  menu: {
    title: string;
    items: SidebarItem[];
  };
}

const SidebarMenu: FC<SidebarMenuProps> = ({ menu, sidebar_menu_type }) => {
  const { title, items } = menu;
  const { searchParams, handleClick }: any = useSearchParamsContext();

  const selected = searchParams.get('current-setting') || 'doors';

  const [openMenu, setOpenMenu] = useState<boolean>(sidebar_menu_type === 'simple' ? true : false);

  return (
    <div>
      {title && (
        <div className="my-4xs flex items-center justify-between px-xs py-2xs">
          {sidebar_menu_type !== 'simple' ? (
            <>
              <div className="text-text-muted dark:text-text-title-dark">{title}</div>
              <IconByName
                name={'ChevronDown'}
                size={16}
                className={twMerge(
                  'cursor-pointer text-text-muted dark:text-text-title-dark transition-all duration-300',
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
          const { name, icon, path, isSwitch } = item;
          return (
            <li
              key={index}
              className={twMerge(
                'flex items-center justify-between rounded-m px-xs py-3xs',
                selected === path
                  ? 'bg-bg-subtle dark:bg-gray-800 text-c-m text-black dark:text-text-title-dark'
                  : 'text-text-base dark:text-text-title-dark'
              )}>
              <div
                className="flex cursor-pointer items-center gap-2"
                onClick={() => handleClick(path)}>
                <IconByName
                  name={icon}
                  size={16}
                  className={twMerge(
                    'text-text-subtle dark:text-subtext-color-dark',
                    selected === path ? 'text-bg-brand' : ''
                  )}
                />
                <span
                  className={twMerge(
                    'settings-text',
                    selected === path 
                      ? 'text-black dark:text-text-title-dark font-medium' 
                      : 'text-text-base dark:text-text-title-dark'
                  )}>
                  {name}
                </span>
              </div>
              <div className="flex items-center">
                {isSwitch && <MySwitch onChange={() => {}} />}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SidebarMenu;
