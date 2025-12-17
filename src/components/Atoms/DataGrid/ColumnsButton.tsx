import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MyDropdown, { DropdownItemWrapper } from '../MyDropdown';
import { useSearchParams } from 'react-router-dom';

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
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentFilters = Object.fromEntries(searchParams.entries());
  const comeStatus = currentFilters['arrivalStatus'] || null;
  const leftStatus = currentFilters['goneStatus'] || null;

  const isAllSelected = !comeStatus && !leftStatus;


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = (type: 'goneStatus' | 'arrivalStatus', value: string | null) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(type, value);
    } else {
      newParams.delete(type);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
    setOpen(false);
  };

  const handleAllStatuses = () => {
    const newParams = new URLSearchParams(searchParams);

    newParams.delete('arrivalStatus');
    newParams.delete('goneStatus');
    newParams.set('page', '1');

    setSearchParams(newParams);
    setOpen(false);
  };

  const statusOptions = [
    { value: 'ON_TIME', label: t('On Time'), color: 'green' },
    { value: 'ABSENT', label: t('Absent'), color: 'red' },
    { value: 'LATE', label: t('Late'), color: 'orange' },
  ];

  const statusOptionsLeft = [
    { value: 'ON_TIME', label: t('On Time'), color: 'green' },
    { value: 'EARLY', label: t('Early'), color: 'blue' },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600 focus:ring-green-500 dark:focus:ring-green-600';
      case 'red':
        return 'text-red-600 focus:ring-red-500 dark:focus:ring-red-600';
      case 'orange':
        return 'text-orange-600 focus:ring-orange-500 dark:focus:ring-orange-600';
      case 'blue':
        return 'text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600';
      default:
        return 'text-gray-600 focus:ring-gray-500';
    }
  };
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
      <div ref={dropdownRef} className="py-2">
        <DropdownItemWrapper className="cursor-default px-4 py-2">
          <p className="text-sm font-medium text-text-subtle">{t('Come Status')}</p>
        </DropdownItemWrapper>

        <DropdownItemWrapper className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
          <div className="flex items-center">
            <input
              id="all-status"
              type="radio"
              name="all-status"
              checked={isAllSelected}
              onChange={handleAllStatuses}
              className="h-4 w-4 border-gray-300 bg-gray-100 focus:ring-2
              text-gray-600 focus:ring-gray-500
              dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
            />
            <label
              htmlFor="all-status"
              className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer w-full"
            >
              {t('All')}
            </label>
          </div>
        </DropdownItemWrapper>

        {statusOptions.map((option) => (
          <DropdownItemWrapper key={`arrivalStatus-${option.value}`} className="px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
            <div className="flex items-center">
              <input
                id={`arrivalStatus-${option.value}`}
                type="radio"
                name="come-status"
                checked={comeStatus === option.value}
                onChange={() =>
                  handleStatusChange(
                    'arrivalStatus',
                    comeStatus === option.value ? null : option.value
                  )
                }
                className={`h-4 w-4 border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 ${getColorClasses(
                  option.color
                )}`}
              />
              <label
                htmlFor={`arrivalStatus-${option.value}`}
                className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer w-full"
              >
                {option.label}
              </label>
            </div>
          </DropdownItemWrapper>
        ))}

        {/* Divider */}
        <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

        {/* Left Status Group */}
        <DropdownItemWrapper className="cursor-default px-4 py-2">
          <p className="text-sm font-medium text-text-subtle">{t('Left Status')}</p>
        </DropdownItemWrapper>

        {statusOptionsLeft.map((option) => (
          <DropdownItemWrapper key={`goneStatus-${option.value}`} className="px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
            <div className="flex items-center">
              <input
                id={`goneStatus-${option.value}`}
                type="radio"
                name="left-status"
                checked={leftStatus === option.value}
                onChange={() =>
                  handleStatusChange(
                    'goneStatus',
                    leftStatus === option.value ? null : option.value
                  )
                }
                className={`h-4 w-4 border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 ${getColorClasses(
                  option.color
                )}`}
              />
              <label
                htmlFor={`goneStatus-${option.value}`}
                className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer w-full"
              >
                {option.label}
              </label>
            </div>
          </DropdownItemWrapper>
        ))}
      </div>
    </MyDropdown>
  );
};

export default ColumnsButton;
