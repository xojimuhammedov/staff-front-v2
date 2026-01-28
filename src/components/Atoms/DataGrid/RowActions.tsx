import { useMemo, useState } from 'react';
import { DropdownItemWrapper } from '../MyDropdown';
import { IAction } from '../../../interfaces/action.interface';
import MyDropdownTwo from '../MyDropdown/MyDropdownTwo';
import storage from 'services/storage';
import EllipsisVertical from 'assets/icons/EllipsisVertical';

interface RowActionProps {
  actions: IAction[];
  allowedRoles?: string[];
  row: any;
}

/**
 * `ExportButton` provides a dropdown interface for exporting data in different formats, such as .xls and .csv. It leverages the `MyDropdown` component for displaying export options. Each option is accompanied by an icon representing the file format. The component's open state is managed through local state, allowing for toggling the dropdown menu. It integrates with `react-i18next` for internationalization, enabling dynamic translations for the button text and export options.
 *
 * @returns {React.ReactElement} The Export button with a dropdown menu for selecting the data export format.
 *
 * Features:
 * - Uses `MyDropdown` for the dropdown functionality, with open/close state managed locally.
 * - Displays export options (.xls and .csv) with corresponding icons in the dropdown menu.
 * - Supports internationalization for dynamically translating the export options and button label.
 * - Utilizes custom icons for visual representation of the file formats.
 */
const RowActions = ({ actions = [], row, allowedRoles }: RowActionProps) => {
  const [open, setOpen] = useState(false);
  const userData: any = storage.get("userData")
  const userRole = JSON.parse(userData)?.role

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return null;
  }

  // 🔍 Har bir actionni filtrlash
  const visibleActions = useMemo(() => {
    return actions.filter(
      (a) => !a.allowedRoles || a.allowedRoles.includes(userRole)
    );
  }, [actions, userRole]);

  if (visibleActions?.length === 0) return null;

  return (
    <MyDropdownTwo
      open={open}
      setOpen={setOpen}
      buttonProps={{
        variant: undefined,
        className: 'w-max dark:bg-transparent',
        startIcon: <EllipsisVertical />
      }}>
      {visibleActions?.map((btn, i) => (
        <DropdownItemWrapper
          className={`flex w-full items-center gap-2 text-${btn.type}`}
          key={i}
          onClick={($e) => btn.action(row, $e)}
        >
          {btn.icon}
          <p>{btn.name}</p>
        </DropdownItemWrapper>
      ))}
    </MyDropdownTwo>
  );
};

export default RowActions;
