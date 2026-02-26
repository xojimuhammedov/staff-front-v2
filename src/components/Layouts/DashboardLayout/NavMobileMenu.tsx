import IconByName from 'assets/icons/IconByName';
import { get } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { icons } from 'lucide-react';

type SubItem = {
  label: string;
  to: string;
  icon: keyof typeof icons;
};

type MenuItem = {
  label: string;
  to: string;
  isSubMenu: boolean;
  subRoutes?: SubItem[];
  allowedRoles?: any[]
};

const CustomDropdownMenu = ({ menuItem, setOpen }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (e: any) => {
    e.preventDefault();
    setIsOpen(prev => !prev);
  };

  const handleOptionClick = () => {
    setIsOpen(false);
    setOpen(false);
  };

  return (
    <div className="relative h-[100%]" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex h-full items-center px-[12px] text-s-p dark:text-subtext-color-dark"
      >
        {menuItem.label}

        <IconByName
          name="ChevronDown"
          className={twMerge(
            'ml-[6px] h-4 w-4 transition-all duration-300',
            isOpen ? '-rotate-180' : '',
            window.location.pathname.includes(menuItem.to) ? 'text-bg-brand' : ''
          )}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-50 w-52 bg-white shadow-md dark:bg-bg-dark-bg">
          {get(menuItem, 'subRoutes', []).map((i: SubItem, index: number) => (
            <li key={index} className="p-0 m-0">
              <Link
                to={i.to}
                onClick={handleOptionClick}
                className="flex items-center rounded-m p-3 text-s-p dark:text-subtext-color-dark"
              >
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


const NavMobileMenu = ({ setOpenModal }: any) => {
  const { t } = useTranslation();

  const menuItems: MenuItem[] = [
    {
      label: t('Dashboard'),
      to: '/',
      isSubMenu: false,
      allowedRoles: ['ADMIN', "HR", "DEPARTMENT_LEAD"]
    },
    {
      label: t('Attendances'),
      to: '/attendances',
      isSubMenu: false,
      allowedRoles: ['ADMIN', "HR", "DEPARTMENT_LEAD"]
    },
    {
      label: t('Organization'),
      to: '/organization',
      isSubMenu: false,
      allowedRoles: ['ADMIN', "HR", "DEPARTMENT_LEAD"]
    },
    {
      label: t('Department'),
      to: '/department',
      isSubMenu: false,
      allowedRoles: ["ADMIN", "HR", "DEPARTMENT_LEAD"]
    },
    {
      label: t('Employees'),
      to: '/employees',
      isSubMenu: true,
      subRoutes: [
        {
          label: t('Employees'),
          to: '/employees',
          icon: 'Users'
        },
        {
          label: t('White list'),
          to: '/employees/whiteList',
          icon: 'Table'
        },
        {
          label: t('Terminated employees'),
          to: '/employees/terminatedEmployees',
          icon: 'AppWindow'
        },
      ],
      allowedRoles: ["ADMIN", "HR", "DEPARTMENT_LEAD", "GUARD"],
    },
    {
      label: t('Computer tracking'),
      to: '/computer-tracking',
      isSubMenu: false,
      allowedRoles: ["ADMIN", "HR", "DEPARTMENT_LEAD", "GUARD"],
    },
    {
      label: t('Users'),
      to: '/users',
      isSubMenu: false,
      allowedRoles: ['ADMIN']
    },
    {
      label: t('Policy'),
      to: '/policy',
      isSubMenu: true,
      subRoutes: [
        {
          label: t('Policy list'),
          to: '/policy',
          icon: 'AppWindow'
        },
        {
          label: t('Policy groups'),
          to: '/policy/groups',
          icon: 'AppWindow'
        },
      ],
      allowedRoles: ['ADMIN']
    },
    {
      label: t('Settings'),
      to: '/settings',
      isSubMenu: false,
      allowedRoles: ['ADMIN']
    },
    {
      label: t('Visitor'),
      to: '/visitor',
      isSubMenu: false,
      allowedRoles: ["ADMIN", "HR", "DEPARTMENT_LEAD", "GUARD"]
    }
  ];

  return (
    <ul className="flex flex-col gap-5">
      {menuItems.map((menuItem, i) => (
        <li key={i} className="flex h-full items-center">
          {menuItem.isSubMenu ? (
            <CustomDropdownMenu setOpen={setOpenModal} menuItem={menuItem} />
          ) : (
            <Link
              to={menuItem.to}
              onClick={() => setOpenModal(false)}
              className="flex h-full items-center px-[12px] text-s-p dark:text-subtext-color-dark"
            >
              {menuItem.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export default NavMobileMenu;
