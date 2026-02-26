import { ReactNode, useEffect, useState } from 'react';
import Select, { DropdownIndicatorProps, components, MultiValueGenericProps } from 'react-select';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ISelect } from '../../../interfaces/select.interface';
import storage from 'services/storage';

interface FormSelectProps {
  required?: boolean;
  name?: string;
  placeholder?: string;
  formSelectSize?: 'sm' | 'lg';
  label?: ReactNode;
  size?: 'base' | 'small';
  className?: string;
  error?: boolean;
  fullWidth?: boolean;
  helperText?: string;
  options: Array<ISelect> | undefined;
  rootClassName?: string;
  value?: ISelect | ISelect[] | string | string[] | number | number[] | boolean | boolean[];
  labelExtractInfo?: ReactNode;
  isMulti?: boolean;
  isClearable?: boolean;
  onChange?: (item: ISelect | ISelect[] | string | string[] | number | number[] | boolean | boolean[]) => void;
  onBlur?: () => void;
  allowedRoles: string[]
}

const ICON_SIZE = 20;

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  const { isFocused } = props;
  return (
    <components.DropdownIndicator {...props}>
      {isFocused ? (
        <ChevronUp width={ICON_SIZE} className="stroke-text-muted" height={ICON_SIZE} />
      ) : (
        <ChevronDown width={ICON_SIZE} className="stroke-text-muted" height={ICON_SIZE} />
      )}
    </components.DropdownIndicator>
  );
};

const MultiValueContainer = (props: MultiValueGenericProps<ISelect>) => {
  return (
    <div className="mr-2xs rounded-m border border-border-base bg-border-base px-3xs py-6xs text-tag-neutral-text last:mr-0">
      <components.MultiValueContainer {...props} />
    </div>
  );
};

/**
 * `MySelect` is a customizable select component, built on top of `react-select`. It offers features like
 * custom size, error state, full width option, and custom styling using Tailwind CSS. It also supports
 * custom dropdown indicators and is integrated with `i18next` for optional translation.
 *
 * @component
 * @param {FormSelectProps} props - The properties of the select component.
 * @param {boolean} [props.required=false] - Indicates if the select is required in a form context.
 * @param {string} [props.name] - Name attribute of the select element.
 * @param {string} [props.placeholder] - Placeholder text for the select.
 * @param {'sm' | 'lg'} [props.formSelectSize] - Size of the form select, can be 'sm' or 'lg'.
 * @param {ReactNode} [props.label] - Optional label for the select.
 * @param {ReactNode} [props.labelExtraInfo] - Optional extra info is positioned after label for the input.
 * @param {Object} [props.value] - value for the select
 * @param {Object} [props.isMulti=false] - if the isMulti is true, the select value will be array
 * @param {'base' | 'small'} [props.size='base'] - Size of the select element.
 * @param {string} [props.className] - Additional custom CSS classes.
 * @param {string} [props.className] - Additional custom CSS classes.
 * @param {boolean} [props.isCreatable] - if true, new option can be added
 * @param {boolean} [props.error=false] - If true, applies error styling to the select.
 * @param {boolean} [props.fullWidth=true] - If true, the select takes the full width of its container.
 * @param {string} [props.helperText] - Optional helper text displayed below the select.
 * @param {Array<{ label: string; value: string | number }>} props.options - Options for the select dropdown.
 * @returns {React.ReactElement} - The rendered select component with custom features.
 */

function MySelect(props: FormSelectProps) {
  const {
    formSelectSize,
    fullWidth = true,
    label,
    error = false,
    className,
    size = 'base',
    helperText,
    options,
    placeholder,
    rootClassName,
    labelExtractInfo,
    isClearable,
    allowedRoles,
    ...computedProps
  } = props;

  const userData: any = storage.get("userData")
  const userRole = JSON.parse(userData)?.role

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return null;
  }

  const [selectedValue, setSelectedValue] = useState<ISelect | ISelect[] | null>(null);

  useEffect(() => {
    const values: ISelect | ISelect[] = [];
    if (computedProps.value instanceof Array) {
      computedProps.value.forEach((value) => {
        let tmpOption: any = value;
        if (['string', 'number', 'boolean'].includes(typeof value)) {
          tmpOption = options?.find((option) => value === option.value) || null;
        }
        if (tmpOption) {
          values.push(tmpOption);
        }
      });
      setSelectedValue(values);
    } else if (['string', 'number', 'boolean'].includes(typeof computedProps.value)) {
      setSelectedValue(options?.find((option) => computedProps.value === option.value) || null);
    } else {
      setSelectedValue(computedProps.value as ISelect);
    }
  }, [JSON.stringify(computedProps.value)]);

  const fullWidthStyles = ['w-full'];

  const requiredLabelStyles = [
    `before:absolute before:right-[-10px] before:top-0 before:text-text-error before:content-['*']`
  ];

  const helperTextErrorStyles = ['text-text-error'];

  return (
    <div className={twMerge(fullWidth && fullWidthStyles, rootClassName)}>
      {label && (
        <label
          className={twMerge([
            'relative mb-1.5 inline-block text-c-m-p text-text-base dark:text-text-title-dark',
            computedProps.required && requiredLabelStyles
          ])}
          htmlFor={computedProps.name}>
          {label}
          {labelExtractInfo && (
            <span className="ml-1 text-c-m-p text-text-muted">({labelExtractInfo})</span>
          )}
        </label>
      )}
      <Select
        {...computedProps}
        options={options}
        unstyled
        closeMenuOnSelect={true}
        value={selectedValue}
        menuPosition='fixed'
        menuPortalTarget={document.body}
        classNames={{
          control: ({ isDisabled, isFocused }) =>
            clsx(
              'rounded-sm appearance-none py-xs px-3 dark:text-text-title-dark shadow-base text-c-m text-text-base hover:bg-bg-field-hover dark:bg-bg-form',
              !isDisabled && 'bg-bg-field',
              !isDisabled && isFocused && 'bg-bg-field shadow-border-interactive-active',
              isDisabled && 'bg-bg-disabled shadow-base',
              error && 'bg-bg-field shadow-custom-border-error',
              className
            ),
          placeholder: ({ isDisabled }) =>
            clsx('text-text-muted text-c-m', isDisabled && 'text-text-disabled'),
          input: () => clsx('[&>input]:focus:shadow-none multiple-input'),
          menu: () =>
            'mt-2 bg-bg-base dark:bg-bg-dark-theme rounded-m shadow-flyout p-1 pagination-size',
          option: () =>
            clsx(
              'px-3 py-2 text-text-base dark:text-text-title-dark hover:bg-bg-subtle dark:hover:bg-gray-700'
            )
        }}
        placeholder={placeholder || ''}
        styles={{
          menuPortal: base => ({ ...base, zIndex: 9999 })
        }}
        // @ts-ignore
        components={{ DropdownIndicator, MultiValueContainer }}
      />
      {helperText && (
        <p className={twMerge(['mt-xs text-c-xs', error && helperTextErrorStyles])}>{helperText}</p>
      )}
    </div>
  );
}

export default MySelect;
