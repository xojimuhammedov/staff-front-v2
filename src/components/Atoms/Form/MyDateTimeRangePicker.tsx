import {
  ReactNode,
  forwardRef,
} from 'react';
import { twMerge } from 'tailwind-merge';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

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

/**
 * `MyDateTimePicker` is a customizable date and time picker component based on MUI.
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
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            value={value}
            onChange={onChange}
            disabled={disabled}
            format={format}
            slotProps={{
              textField: {
                fullWidth: fullWidth,
                size: size === 'small' ? 'small' : 'medium',
                placeholder: placeholder,
                name: name,
                error: error,
                className: twMerge([
                  'appearance-none',
                  startIcon && '[&_.MuiInputBase-input]:pl-9',
                  endIcon && '[&_.MuiInputBase-input]:pr-9',
                  className
                ]),
                sx: {
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--bg-field, #fff)',
                    borderRadius: '4px',
                    border: 0,
                    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                    fontSize: '0.875rem',
                    '& fieldset': {
                      border: 0,
                    },
                    '&:hover': {
                      backgroundColor: 'var(--bg-field-hover, #f9fafb)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'var(--bg-field, #fff)',
                      boxShadow: '0 0 0 3px var(--bg-brand-alpha, rgba(59, 130, 246, 0.1))',
                      outline: '2px solid var(--bg-brand, #3b82f6)',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'var(--bg-disabled, #f3f4f6)',
                      color: 'var(--text-disabled, #9ca3af)',
                    },
                    '&.Mui-error': {
                      outline: '2px solid var(--text-error, #ef4444)',
                    }
                  },
                  '& .MuiInputBase-input': {
                    padding: size === 'small' ? '8px 12px' : '10px 16px',
                    color: 'var(--text-base, #111827)',
                    '&::placeholder': {
                      color: 'var(--text-muted, #6b7280)',
                      opacity: 1,
                    }
                  },
                  '& .MuiInputLabel-root': {
                    display: 'none', // Label yuqorida custom holatda
                  }
                }
              },
              popper: {
                sx: {
                  '& .MuiPaper-root': {
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    borderRadius: '8px',
                    marginTop: '4px',
                  }
                }
              }
            }}
          />
        </LocalizationProvider>

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