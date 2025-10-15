import React, { ReactNode, forwardRef, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface FormInputProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'className'> {
  rounded?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  label?: ReactNode;
  helperText?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  rootClassName?: string;
  labelExtractInfo?: ReactNode;
}

type FormInputRef = React.ComponentPropsWithRef<'input'>['ref'];

/**
 * `MyInput` is a customizable input component that extends the standard HTML input. It provides additional
 * features like different sizes, optional rounded corners, error state styling, full width option, and
 * inclusion of start/end icons. This component integrates with `i18next` for optional translation.
 *
 * @component
 * @param {FormInputProps} props - The properties of the input component.
 * @param {boolean} [props.rounded] - If true, the input will have rounded corners.
 * @param {'small' | 'base'} [props.size='base'] - The size of the input ('small' or 'base').
 * @param {boolean} [props.error=false] - If true, applies error styling to the input.
 * @param {boolean} [props.fullWidth=true] - If true, the input takes full width of its container.
 * @param {string} [props.rootClassName] - Additional custom CSS classes for root element.
 * @param {ReactNode} [props.label] - Optional label for the input.
 * @param {ReactNode} [props.labelExtraInfo] - Optional extra info is positioned after label for the input.
 * @param {string} [props.helperText] - Optional helper text displayed below the input.
 * @param {ReactNode} [props.startIcon] - Icon displayed at the start of the input.
 * @param {ReactNode} [props.endIcon] - Icon displayed at the end of the input.
 * @param {FormInputRef} ref - Ref forwarded to the input element.
 * @returns {React.ReactElement} - The rendered input component.
 */

const MyTimePicker = forwardRef((props: FormInputProps) => {
  const {
    error = false,
    fullWidth = true,
    rounded,
    label,
    helperText,
    startIcon,
    endIcon,
    rootClassName,
    labelExtractInfo,
    placeholder,
    onChange,
    defaultValue,
    value,
    type,
    id,
    ...computedProps
  }: any = props;
  const timeInputRef = useRef<any>(null);

  const handleClick = () => {
    if (timeInputRef.current) {
      timeInputRef.current.showPicker();
    }
  };
  const generalStyles = [
    'appearance-none dark:bg-bg-form py-xs px-3 text-c-m text-text-base border-0 rounded-sm shadow-base bg-bg-field placeholder-text-muted hover:bg-bg-field-hover focus:bg-bg-field focus:ring-bg-brand focus:shadow-border-interactive-active focus:border-bg-brand disabled:bg-bg-disabled disabled:shadow-base disabled:text-text-disabled dark:text-text-title-dark'
  ];

  const requiredLabelStyles = [
    `before:absolute before:right-[-10px] before:top-0 before:text-text-error before:content-['*']`
  ];
  const helperTextErrorStyles = ['text-text-error'];

  return (
    <div className="w-full">
      <label
        className={twMerge([
          'relative mb-1.5 inline-block text-c-m-p text-text-base dark:text-text-title-dark',
          computedProps.required && requiredLabelStyles
        ])}
        htmlFor={label}>
        {label}
        {labelExtractInfo && (
          <span className="ml-1 text-c-m-p text-text-muted">({labelExtractInfo})</span>
        )}
      </label>
      <div className="relative">
        <input
          ref={timeInputRef}
          onClick={handleClick}
          aria-invalid={true}
          {...computedProps}
          min="00:00"
          max="23:59"
          id={id}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          type="time"
          className={twMerge([generalStyles, 'block w-full p-2.5 leading-none'])}
        />
      </div>
      {helperText && (
        <p className={twMerge(['mt-xs text-c-xs', error && helperTextErrorStyles])}>{helperText}</p>
      )}
    </div>
  );
});

export default MyTimePicker;
