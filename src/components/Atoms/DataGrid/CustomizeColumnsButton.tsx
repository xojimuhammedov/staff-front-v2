import MyButton from '../MyButton/MyButton';
import { useEffect, useRef, useState } from 'react';
import { Columns, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MyDropdown, { DropdownItemWrapper } from '../MyDropdown';
import useTableContext from 'providers/TableProvider/useTableContext';
import { MyCheckbox } from '../Form';
import { TABLE_ACTION_TYPES } from 'providers/TableProvider/useTableProvider';

/**
 * `CustomizeColumnsButton` provides an interface for users to customize the visibility of columns in a data grid. It uses a dropdown menu to list all available columns with checkboxes, allowing users to select which columns they want to display. The component's open state is managed locally, while the columns' visibility states are managed both locally and globally via the table context. This allows for immediate feedback in the UI and persistent changes across the application. The component integrates with `react-i18next` for internationalization, supporting dynamic translations for the button text and other UI elements.
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

const CustomizeColumnsButton = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const { columns, columnHash, dispatch } = useTableContext();
  const [values, setValues] = useState(() => columnHash);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <MyDropdown
      open={open}
      setOpen={setOpen}
      buttonProps={{
        children: t('Customize columns'),
        variant: 'secondary',
        className: 'w-max dark:bg-bg-button',
        startIcon: <Columns />,
        endIcon: open ? <ChevronUp /> : <ChevronDown />
      }}>
      <DropdownItemWrapper className="cursor-default">
        <p className="text-c-xs-p text-text-subtle">{t('Select column to show')}</p>
      </DropdownItemWrapper>
      <div ref={dropdownRef} className="dark:bg-bg-button">
        {columns.map((column: any, i: number) => (
          <DropdownItemWrapper
            onClick={() => {
              setValues((prev: any) => ({
                ...prev,
                [column.key]: { ...column, visible: !prev[column.key].visible }
              }));
            }}
            key={i}
            className="flex flex-row items-center gap-2">
            <MyCheckbox defaultChecked={values[column.key].visible} />
            <label className="text-c-s text-text-base dark:text-text-title-dark">
              {column.label}
            </label>
          </DropdownItemWrapper>
        ))}

        <div className="flex w-full flex-row items-center gap-2 p-3">
          <MyButton
            onClick={() => {
              dispatch({ type: TABLE_ACTION_TYPES.RESET_COLUMNS_VISIBILITY });
              setValues((prev: any) =>
                Object.entries(prev).reduce(
                  (acc, [key, value]: any) => ({ ...acc, [key]: { ...value, visible: true } }),
                  {}
                )
              );
              setOpen(false);
            }}
            variant="secondary"
            size="base"
            className="flex-1">
            {t('Reset')}
          </MyButton>
          <MyButton
            onClick={() => {
              dispatch({
                type: TABLE_ACTION_TYPES.TOGGLE_MULTIPLE_COLUMNS_VISIBILITY,
                payload: values
              });
              setOpen(false);
            }}
            variant="primary"
            size="base"
            className="flex-1">
            {t('Apply')}
          </MyButton>
        </div>
      </div>
    </MyDropdown>
  );
};

export default CustomizeColumnsButton;
