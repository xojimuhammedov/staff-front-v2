import MyButton from '../MyButton/MyButton';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Columns, ChevronDown, ChevronUp, Users } from 'lucide-react';
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

type Employee = {
  id: number | string;
  fio?: string; // yoki name
  name?: string;
  label?: string; // agar tayyor label bo'lsa
};

type Props = {
  employeeList: Employee[];
  initialSelectedIds?: Array<number | string>;
  onApply: (selectedIds: Array<number | string>) => void | Promise<void>;
  onReset?: () => void;

  // ixtiyoriy:
  buttonText?: string;
};

const EmployeeMultiSelectDropdown = ({
  employeeList,
  initialSelectedIds = [],
  onApply,
  onReset,
  buttonText,
}: Props) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [selected, setSelected] = useState<Set<number | string>>(
    () => new Set(initialSelectedIds)
  );

  // employeeList o'zgarsa, initialSelectedIds bo'yicha yangilab qo'yish
  useEffect(() => {
    setSelected(new Set(initialSelectedIds));
  }, [initialSelectedIds, employeeList]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCount = selected.size;

  const items = useMemo(() => employeeList ?? [], [employeeList]);

  const toggleOne = (id: number | string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleReset = () => {
    setSelected(new Set());
    onReset?.();
    setOpen(false);
  };

  const handleApply = async () => {
    try {
      setIsApplying(true);
      await onApply(Array.from(selected)); // <-- resolve bo'lishini kutadi
      setOpen(false);                      // <-- keyin yopiladi
    } finally {
      setIsApplying(false);
    }
  };


  return (
    <MyDropdown
      open={open}
      setOpen={setOpen}
      buttonProps={{
        children: buttonText ?? t("Select employees"),
        variant: "secondary",
        className: "w-max dark:bg-bg-button",
        startIcon: <Users />,
        endIcon: open ? <ChevronUp /> : <ChevronDown />,
      }}
    >
      <DropdownItemWrapper className="cursor-default">
        <p className="text-c-xs-p text-text-subtle">
          {t("Selected")}: {selectedCount}
        </p>
      </DropdownItemWrapper>

      <div ref={dropdownRef} className="dark:bg-bg-button">
        <div className='h-[250px] overflow-y-scroll'>
          {items.map((emp) => {
            const label = emp.label ?? emp.fio ?? emp.name ?? String(emp.id);
            const checked = selected.has(emp.id);

            return (
              <DropdownItemWrapper
                key={emp.id}
                onClick={() => toggleOne(emp.id)}
                className="flex flex-row items-center gap-2"
              >
                {/* MUHIM: controlled checkbox */}
                <MyCheckbox checked={checked} onChange={() => toggleOne(emp.id)} />
                <label className="text-c-s text-text-base dark:text-text-title-dark">
                  {label}
                </label>
              </DropdownItemWrapper>
            );
          })}
        </div>
        <div className="flex w-full flex-row items-center gap-2 p-3">
          <MyButton onClick={handleReset} variant="secondary" size="base" className="flex-1">
            {t("Reset")}
          </MyButton>

          <MyButton
            onClick={handleApply}
            disabled={isApplying}
            variant="primary"
            size="base"
            className="flex-1"
          >
            {t("Apply")}
          </MyButton>
        </div>
      </div>

    </MyDropdown>
  );
};

export default EmployeeMultiSelectDropdown;
