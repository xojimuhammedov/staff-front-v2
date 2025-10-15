import React, { useState } from "react";
import MyDropdown, { DropdownItemWrapper } from "../MyDropdown";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp } from "lucide-react";
import Dublicate from "assets/icons/Duplicate";
import Delete from "assets/icons/Delete";
import CheckSquare from "assets/icons/CheckSquare";
import { IAction } from "../../../interfaces/action.interface";
import { isEmpty } from "lodash";
import { Tooltip } from "flowbite-react";

interface ActionSelectButtonProps {
  actions: IAction[],
  items: (string | number)[],
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
const ActionSelectButton = ({ actions = [], items = [] }: ActionSelectButtonProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      label: t("Marge duplicates"),
      icon: <Dublicate />
    },
    {
      label: t("Delete selected"),
      icon: <Delete />
    }
  ];

  return (
    isEmpty(items) ?
      <Tooltip content={t('No items selected')}>
        <MyDropdown
          buttonProps={{
            disabled: true,
            children: t("Action for selected items"),
            variant: "secondary",
            className: "w-max",
            startIcon: <CheckSquare />,
            endIcon: open ? <ChevronUp /> : <ChevronDown />
          }}>
          <></>
        </MyDropdown>
      </Tooltip> : 
      <MyDropdown
        open={open}
        setOpen={setOpen}
        buttonProps={{
          children: t("Action for selected items"),
          variant: "secondary",
          className: "w-max",
          startIcon: <CheckSquare />,
          endIcon: open ? <ChevronUp /> : <ChevronDown />
        }}>
        <DropdownItemWrapper className="cursor-default">
          <p className="text-c-xs-p text-text-subtle">{t("Actions")}</p>
        </DropdownItemWrapper>
        {actions.map((btn, i) => (
          <DropdownItemWrapper className={`flex w-full items-center gap-2 text-${btn.type}`} key={i} onClick={($e) => {
            btn.action(items, $e);
          }}>
            {btn.icon}
            <p>{btn.name}</p>
          </DropdownItemWrapper>
        ))}
      </MyDropdown>
  );
};

export default ActionSelectButton;
