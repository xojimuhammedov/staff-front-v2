import React, { useEffect, useState } from "react";
import MyDropdown, { DropdownItemWrapper } from "../MyDropdown";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { IFilter } from "../../../interfaces/filter.interface";
import { FilterTypeEnum } from "../../../enums/filter-type.enum";
import MyButton from "../MyButton";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { isEmpty } from "lodash";
import { DEFAULT_PAGE } from "../../../constants/pagination.constants";
import MyInput from "../Form/MyInput";
import MySelect from "../Form/MySelect";

interface FiltersButtonProps {
  filters: IFilter[];
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
const FiltersButton = ({ filters = [] }: FiltersButtonProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { handleSubmit, getValues, register, setValue, reset, watch } = useForm();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    filters.forEach(filter => {
      if ([FilterTypeEnum.text, FilterTypeEnum.select].includes(filter.type)) {
        setValue(filter.key, searchParams.get(filter.key));
      } else if (filter.type === FilterTypeEnum.multiselect) {
        setValue(filter.key, searchParams.getAll(filter.key));
      }
    });
  }, [JSON.stringify(filters)]);

  const apply = (data: any, type: FilterActionButtonTypeEnum) => {
    for(const [key, value] of Object.entries(data)) {
      if (!(value === null || isEmpty(value)) && type === FilterActionButtonTypeEnum.apply) {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    }
    searchParams.set('page', `${DEFAULT_PAGE}`);
    setSearchParams(searchParams);
    setOpen(false);
  };

  useEffect(() => {
  }, [watch()]);

  return (
    <form action="" onSubmit={handleSubmit((data: any) => apply(data, FilterActionButtonTypeEnum.apply))}>
      <MyDropdown
        open={open}
        setOpen={setOpen}
        buttonProps={{
          children: t("Filters"),
          variant: "secondary",
          className: "w-max",
          startIcon: <Filter />,
          endIcon: open ? <ChevronUp /> : <ChevronDown />
        }}>
        {filters?.map((filter, i) => (
          <DropdownItemWrapper className="flex items-center gap-2" key={i}>
            {filter.type === FilterTypeEnum.text && <>
              <MyInput label={filter.label} {...register(filter.key)}></MyInput>
            </>}
            {filter.type === FilterTypeEnum.select && <>
              <MySelect
                onChange={(item) => {
                  // @ts-ignore
                  setValue(filter.key, item?.value);
                }}
                value={getValues(filter.key)}
                label={filter.label}
                options={filter.options || []}
              ></MySelect>
            </>}
            {filter.type === FilterTypeEnum.multiselect && <>
              <MySelect
                onChange={(items = []) => {
                  // @ts-ignore
                  setValue(filter.key, items.map(item => item.value));
                }}
                value={getValues(filter.key)}
                label={filter.label}
                isMulti={true}
                options={filter.options || []}
              ></MySelect>
            </>}
          </DropdownItemWrapper>
        ))}

        <div className="flex w-full flex-row items-center gap-2 p-3">
          <MyButton
            onClick={() => {
              apply(getValues(), FilterActionButtonTypeEnum.reset);
              reset();
            }}
            type={"reset"}
            variant="secondary"
            size="base"
            className="flex-1">
            {t("Reset")}
          </MyButton>
          <MyButton
            type={"submit"}
            variant="primary"
            size="base"
            className="flex-1">
            {t("Apply")}
          </MyButton>
        </div>
      </MyDropdown>
    </form>
  );
};

export default FiltersButton;
