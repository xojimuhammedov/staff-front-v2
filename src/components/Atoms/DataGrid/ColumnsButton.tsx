import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MyDropdown, { DropdownItemWrapper } from '../MyDropdown';
import { useLocation, useSearchParams } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';

/**
 * `ColumnsButton` provides an interface for users to customize the visibility of columns in a data grid. It uses a dropdown menu to list all available columns with checkboxes, allowing users to select which columns they want to display. The component's open state is managed locally, while the columns' visibility states are managed both locally and globally via the table context. This allows for immediate feedback in the UI and persistent changes across the application. The component integrates with `react-i18next` for internationalization, supporting dynamic translations for the button text and other UI elements.
 *
 * @returns {React.ReactElement} The Customize Columns button with a dropdown menu for column visibility customization.
 *
 * Functionality:
 * - Utilizes a `MyDropdown` component to present a list of columns with checkboxes.
 * - Allows users to check or uncheck boxes to show or hide columns in the data grid.
 * - Provides "Reset" and "Apply" buttons to reset to default visibility or apply changes, respectively.
 * - Leverages the `useTableContext` for accessing and updating the columns' visibility state.
 * - Supports internationalization for text displayed within the component.
 */

const ColumnsButton = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const paramsValue: any = paramsStrToObj(location.search);
  const locationValue = paramsValue?.IsLateIn ? 'IsLateIn' : '/';
  const [open, setOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const values = params.get('filters')?.slice(0, 8) || locationValue;
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('IsLateIn');
    setSearchParams(params);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const statusData = [
    {
      id: 1,
      title: t('All them'),
      label: 'black-radio',
      className: 'text-black-600 focus:ring-black-500 dark:focus:ring-black-600',
      value: '/',
      name: '/'
    },
    {
      id: 2,
      title: t('come'),
      label: 'red-radio',
      className: 'text-red-600 focus:ring-red-500 dark:focus:ring-red-600',
      value: 'isAbsent=true',
      name: 'isAbsent'
    },
    {
      id: 3,
      title: t('Came on time'),
      label: 'green-radio',
      className: 'text-green-600 focus:ring-green-500 dark:focus:ring-green-600',
      value: 'IsLateIn=false',
      name: 'IsLateIn'
    },
    {
      id: 4,
      title: t('ComeLate'),
      label: 'orange-radio',
      className: 'text-orange-500 focus:ring-orange-500 dark:focus:ring-orange-600',
      value: 'isLateIn=true',
      name: 'isLateIn'
    }
  ];

  return (
    <MyDropdown
      open={open}
      setOpen={setOpen}
      buttonProps={{
        children: t('Status Filters'),
        variant: 'secondary',
        className: 'w-max dark:bg-bg-button',
        startIcon: <Filter />,
        endIcon: open ? <ChevronUp /> : <ChevronDown />
      }}>
      <DropdownItemWrapper className="cursor-default">
        <p className="text-c-xs-p text-text-subtle">{t('Select column to show')}</p>
      </DropdownItemWrapper>
      <div ref={dropdownRef} className="dark:bg-bg-button">
        <DropdownItemWrapper className="flex flex-row flex-col gap-4">
          {statusData.map((item: any, index: number) => (
            <div
              onClick={() => {
                handleClick();
              }}
              key={index}
              className="me-4 flex items-center">
              <input
                id={item?.label}
                type="radio"
                value=""
                name="colored-radio"
                checked={item?.name === values ? true : false}
                onChange={(evt) => {
                  if (evt.target.checked) {
                    if (item?.value) {
                      params.set('filters', item.value);
                      params.set('page', '1');
                    }
                    setParams(params);
                    setOpen(false);
                  }
                }}
                className={`h-4 w-4 border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 ${item.className}`}
              />
              <label
                htmlFor={item.label}
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                {item.title}
              </label>
            </div>
          ))}
        </DropdownItemWrapper>
      </div>
    </MyDropdown>
  );
};

export default ColumnsButton;
