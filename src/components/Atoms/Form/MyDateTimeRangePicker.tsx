import { ReactNode, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import dayjs, { Dayjs } from 'dayjs';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/dark.css';

interface FormDateTimePickerProps {
  error?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'base';
  className?: string;
  label?: string;
  helperText?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  rootClassName?: string;
  labelExtractInfo?: ReactNode;
  onChange?: (value: Dayjs | null) => void;
  value?: Dayjs | null;
  placeholder?: string;
  required?: boolean;
  name?: string;
  disabled?: boolean;
  format?: string;
}

const toFlatpickrFormat = (format: string) =>
  format
    .replace(/HH/g, 'H')
    .replace(/mm/g, 'i')
    .replace(/DD/g, 'd')
    .replace(/MM/g, 'm')
    .replace(/YYYY/g, 'Y');

/**
 * `MyDateTimePicker` is a customizable date and time picker component based on Flatpickr.
 */
const MyDateTimePicker = forwardRef<HTMLDivElement, FormDateTimePickerProps>((props, ref) => {
  const {
    error = false,
    fullWidth = true,
    size = 'base',
    className,
    label,
    helperText,
    startIcon,
    endIcon,
    rootClassName,
    labelExtractInfo,
    placeholder,
    onChange,
    value,
    required,
    name,
    disabled,
    format = 'DD/MM/YYYY HH:mm',
    ...computedProps
  } = props;

  const requiredLabelStyles = [
    `before:absolute before:right-[-10px] before:top-0 before:text-text-error before:content-['*']`
  ];

  const helperTextErrorStyles = ['text-text-error'];

  const flatpickrFormat = toFlatpickrFormat(format);

  return (
    <div className={twMerge(['w-full', rootClassName])} ref={ref}>
      {label && (
        <label
          className={twMerge([
            'relative mb-1.5 inline-block text-c-m-p text-text-base dark:text-text-title-dark',
            required && requiredLabelStyles
          ])}
          htmlFor={name}>
          {label}
          {labelExtractInfo && (
            <span className="ml-1 text-c-m-p text-text-muted">({labelExtractInfo})</span>
          )}
        </label>
      )}

      <div className="relative">
        {startIcon && (
          <div className="absolute left-2.5 top-2/4 z-10 -translate-y-2/4 [&>svg]:h-5 [&>svg]:w-5">
            {startIcon}
          </div>
        )}

        <Flatpickr
          options={{
            enableTime: true,
            dateFormat: flatpickrFormat,
            time_24hr: false,
          }}
          value={value ? value.toDate() : undefined}
          onChange={(dates: Date[]) => onChange?.(dates?.[0] ? dayjs(dates[0]) : null)}
          placeholder={placeholder}
          disabled={disabled}
          className={twMerge([
            'appearance-none py-xs px-3 text-c-m text-text-base border-0 rounded-sm shadow-base bg-bg-field placeholder-text-muted hover:bg-bg-field-hover focus:bg-bg-field focus:ring-bg-brand focus:shadow-border-interactive-active focus:border-bg-brand disabled:bg-bg-disabled disabled:shadow-base disabled:text-text-disabled dark:bg-bg-form dark:text-text-title-dark dark:placeholder-text-muted dark:hover:bg-bg-form dark:focus:bg-bg-form',
            size === 'small' ? 'h-8' : 'h-10',
            fullWidth && 'w-full',
            startIcon && 'pl-9',
            endIcon && 'pr-9',
            className,
          ])}
          {...computedProps}
        />

        {endIcon && (
          <div className="absolute right-2.5 top-2/4 z-10 -translate-y-2/4 [&>svg]:h-5 [&>svg]:w-5">
            {endIcon}
          </div>
        )}
      </div>

      {helperText && (
        <p className={twMerge(['mt-xs text-c-xs', error && helperTextErrorStyles])}>
          {helperText}
        </p>
      )}
    </div>
  );
});

MyDateTimePicker.displayName = 'MyDateTimePicker';

export default MyDateTimePicker;