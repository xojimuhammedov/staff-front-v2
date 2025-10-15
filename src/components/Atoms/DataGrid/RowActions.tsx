import { useState } from 'react';
import { DropdownItemWrapper } from '../MyDropdown';
import { useTranslation } from 'react-i18next';
import { IAction } from '../../../interfaces/action.interface';
import MyDropdownTwo from '../MyDropdown/MyDropdownTwo';
import EllipsisVertical from 'assets/icons/EllipsisVertical';

interface RowActionProps {
  actions: IAction[];
  row: any;
}

enum FilterActionButtonTypeEnum {
  reset,
  apply
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
const RowActions = ({ actions = [], row }: RowActionProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <MyDropdownTwo
      open={open}
      setOpen={setOpen}
      buttonProps={{
        variant: undefined,
        className: 'w-max',
        startIcon: <EllipsisVertical />
      }}>
      {actions.map((btn, i) => (
        <DropdownItemWrapper
          className={`flex w-full items-center gap-2 text-${btn.type}`}
          key={i}
          onClick={($e) => {
            btn.action(row, $e);
          }}>
          {btn.icon}
          <p>{btn.name}</p>
        </DropdownItemWrapper>
      ))}
    </MyDropdownTwo>
  );
};

export default RowActions;
