import React, { FC, useState, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { useSearchParams } from 'react-router-dom';
import IconByName from 'assets/icons/IconByName';
import { MySwitch } from 'components/Atoms/Form';
import { icons } from 'lucide-react';

type MenuType = 'simple' | 'open-close';

interface SidebarItem {
  icon: keyof typeof icons;
  name: string;
  path: string;
  isSwitch: boolean;
}

interface SidebarMenuProps {
  menuIndex: number;
  menu: {
    title: string;
    items: SidebarItem[];
  };
}

const SidebarMenu: FC<SidebarMenuProps> = ({ menu, menuIndex }) => {
  const { items } = menu;

  const [searchParams, setSearchParams] = useSearchParams();

  const selected = searchParams.get('current-rule') || 'general-details';

  const handleClick = (value: string) => {
    searchParams.set('current-step', `${menuIndex + 1}`);
    searchParams.set('current-rule', value);
    setSearchParams(searchParams);
  };

  return (
    <div>
      <ul className={twMerge('flex flex-col gap-4xs ')}>
        {items.map((item: SidebarItem, index: number) => {
          const { name, icon, path, isSwitch } = item;
          return (
            <li
              className={twMerge(
                'flex items-center justify-between rounded-m px-xs py-3xs dark:bg-bg-darkBg ',
                selected === path ? 'bg-bg-subtle' : ''
              )}>
              <div
                className="flex cursor-pointer items-center gap-2"
                onClick={() => handleClick(path)}>
                <IconByName name={icon} className="h-5 w-5 text-text-subtle" />
                <span className="text-text-base dark:text-text-title-dark">{name}</span>
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
