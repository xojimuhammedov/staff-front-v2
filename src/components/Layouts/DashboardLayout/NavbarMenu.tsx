import IconByName from 'assets/icons/IconByName';
import clsx from 'clsx';
import { get } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { icons } from 'lucide-react';
import storage from 'services/storage';

type SubItem = {
  label: string;
  to: string;
  icon: keyof typeof icons;
};

type MenuItem = {
  label: string;
  to: string;
  isSubMenu: boolean;
  icon: keyof typeof icons;
  subRoutes?: SubItem[];
  allowedRoles?: any[]
};

type CustomDropdownMenuProps = {
  menuItem: MenuItem;
};

const CustomDropdownMenu: React.FC<CustomDropdownMenuProps> = ({ menuItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative h-[100%]" ref={dropdownRef}>
      <NavLink
        onClick={(event) => {
          toggleDropdown();
          event.preventDefault();
        }}
        className={({ isActive }) =>
          clsx([
            'flex h-full items-center gap-2 px-[12px] py-1.5 text-s-p dark:text-subtext-color-dark',
            isActive &&
              'border-b-2 border-yellow-500 text-yellow-600 dark:border-yellow-400 dark:text-yellow-400'
          ])
        }
        to={menuItem.to}>
        {({ isActive }) => (
          <>
            <IconByName
              name={menuItem.icon}
              className={twMerge(
                'h-4 w-4 text-text-subtle dark:text-subtext-color-dark',
                isActive ? 'text-yellow-600 dark:text-yellow-400' : ''
              )}
            />
            {menuItem.label}
            <IconByName
              name={'ChevronDown'}
              className={twMerge(
                'ml-[6px] h-4 w-4 cursor-pointer text-text-subtle transition-all duration-300 dark:text-subtext-color-dark',
                isOpen ? '-rotate-180' : '',
                isActive ? 'text-yellow-600 dark:text-yellow-400' : ''
              )}
            />
          </>
        )}
      </NavLink>

      {isOpen && (
        <ul className="shadow-gray-150 absolute w-72 rounded-lg bg-white shadow-md dark:bg-bg-dark-bg">
          {get(menuItem, 'subRoutes', []).map((i: SubItem, index: number) => {
            return (
              <li key={index} onClick={() => handleOptionClick()}>
                <NavLink
                  className={({ isActive }) =>
                    clsx([
                      'flex items-center gap-2 rounded-m p-3 text-s-p font-normal dark:text-subtext-color-dark',
                      isActive &&
                        'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
                    ])
                  }
                  to={i.to}>
                  {({ isActive }) => (
                    <>
                      <IconByName
                        name={i.icon}
                        className={clsx(
                          'h-4 w-4 cursor-pointer text-text-subtle dark:text-subtext-color-dark',
                          isActive ? 'text-yellow-700 dark:text-yellow-400' : ''
                        )}
                      />
                      {i.label}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const NavbarMenu = () => {
  const { t } = useTranslation();
  const userData: any = storage.get("userData")
  const userRole = JSON.parse(userData)?.role

  const menuItems: MenuItem[] = [
    {
      label: t('Dashboard'),
      to: '/',
      isSubMenu: false,
      icon: 'LayoutDashboard',
      allowedRoles: ['ADMIN', "HR", "DEPARTMENT_LEAD"]
      
    },
    {
      label: t('Attendances'),
      to: '/attendances',
      isSubMenu: false,
      icon: 'CalendarCheck2',
      allowedRoles: ['ADMIN', "HR"]
    },
    {
      label: t('Organization'),
      to: '/organization',
      isSubMenu: false,
      icon: 'Building2',
      allowedRoles: ['ADMIN']
    },
    {
      label: t('Department'),
      to: '/department',
      isSubMenu: false,
      icon: 'Users',
      allowedRoles: ["ADMIN", "HR", "DEPARTMENT_LEAD"]
    },
    {
      label: t('Employees'),
      to: '/employees',
      isSubMenu: false,
      icon: 'UserRound',
      allowedRoles: ["ADMIN", "HR", "DEPARTMENT_LEAD", "GUARD"],
    },
    {
      label: t('Reports'),
      to: '/reports',
      isSubMenu: true,
      icon: 'FileBarChart2',
      subRoutes: [
        {
          label: t('Table'),
          to: '/reports/table',
          icon: 'Table'
        },
        {
          label: t('Attendance report'),
          to: '/reports/attendance',
          icon: 'AppWindow'
        },
      ],
      allowedRoles: ['ADMIN', "HR"]
    },
    {
      label: t('Users'),
      to: '/users',
      isSubMenu: false,
      icon: 'Users',
      allowedRoles: ['ADMIN']
    },
    // {
    //   label: t('Policy'),
    //   to: '/policy',
    //   isSubMenu: true,
    //   subRoutes: [
    //     {
    //       label: t('Policy list'),
    //       to: '/policy',
    //       icon: 'AppWindow'
    //     },
    //     {
    //       label: t('Policy groups'),
    //       to: '/policy/groups',
    //       icon: 'AppWindow'
    //     },
    //   ],
    //   allowedRoles: ['ADMIN']
    // },
    {
      label: t('Settings'),
      to: '/settings',
      isSubMenu: false,
      icon: 'Settings',
      allowedRoles: ['ADMIN']
    },
    {
      label: t('Visitor'),
      to: '/visitor',
      isSubMenu: false,
      icon: 'User',
      allowedRoles: ["ADMIN", "HR", "DEPARTMENT_LEAD", "GUARD"]
    },
    {
      label: t('Guard'),
      to: '/guards',
      isSubMenu: false,
      icon: 'Shield',
      allowedRoles: ["GUARD"]
    }
  ];

  const filteredMenuItems = menuItems?.filter((item: any) =>
    item.allowedRoles?.includes(userRole)
  );

  return (
    <ul className="navbar-menu-list flex h-full items-center">
      {filteredMenuItems?.map((menuItem, i) => {
        return (
          <li key={i} className="flex h-full items-center">
            {menuItem.isSubMenu ? (
              <>
                <CustomDropdownMenu menuItem={menuItem} />
              </>
            ) : (
              <>
                <NavLink
                  className={({ isActive }) =>
                    clsx([
                      'flex h-full items-center gap-2 px-[12px] py-1.5 text-s-p dark:text-subtext-color-dark',
                      isActive &&
                        'border-b-2 border-yellow-500 text-yellow-600 dark:border-yellow-400 dark:text-yellow-400'
                    ])
                  }
                  to={menuItem.to}>
                  {({ isActive }) => (
                    <>
                      <IconByName
                        name={menuItem.icon}
                        className={twMerge(
                          'h-4 w-4 text-text-subtle dark:text-subtext-color-dark',
                          isActive ? 'text-yellow-600 dark:text-yellow-400' : ''
                        )}
                      />
                      {menuItem.label}
                    </>
                  )}
                </NavLink>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default NavbarMenu;
