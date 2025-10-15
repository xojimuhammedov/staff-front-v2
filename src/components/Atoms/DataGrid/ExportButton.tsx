import React, { useState } from 'react';
import { DropdownItemWrapper } from '../MyDropdown';
import { useTranslation } from 'react-i18next';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';
import RoundedShape from '../RoundedShape';
import ExcelSvg from 'assets/icons/ExcelSvg';
import MyDropdownTwo from '../MyDropdown/MyDropdownTwo';

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
const ExportButton = ({ onSubmit }: any) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      label: t('Export as a .xls'),
      icon: <ExcelSvg />
    }
    // {
    //   label: t('Export as a .csv'),
    //   icon: <CsvSvg />
    // }
  ];

  return (
    <MyDropdownTwo
      open={open}
      setOpen={setOpen}
      buttonProps={{
        children: t('Export all data'),
        variant: 'secondary',
        className: 'w-max',
        startIcon: <Download />,
        endIcon: open ? <ChevronUp /> : <ChevronDown />
      }}>
      {menuItems.map(({ icon, label }, i) => (
        <DropdownItemWrapper onClick={onSubmit} className="flex items-center gap-2" key={i}>
          <RoundedShape>{icon}</RoundedShape>
          <p className="dark:text-text-title-dark">{label}</p>
        </DropdownItemWrapper>
      ))}
    </MyDropdownTwo>
  );
};

export default ExportButton;
