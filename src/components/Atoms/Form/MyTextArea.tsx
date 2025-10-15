import { ReactNode, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface FormInputProps
  extends Omit<React.ComponentPropsWithoutRef<'textarea'>, 'size' | 'className'> {
  rounded?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  className?: string;
  label?: ReactNode;
  helperText?: string;
  rootClassName?: string;
}

type FormInputRef = React.ComponentPropsWithRef<'textarea'>['ref'];

/**
 * `MyTextarea` is a customizable textarea component, extending standard HTML textarea functionality.
 * It supports features like error state styling, full width option, and custom styling using Tailwind CSS.
 * The component also allows for a label and helper text.
 *
 * @component
 * @param {FormInputProps} props - The properties of the textarea component.
 * @param {boolean} [props.rounded=false] - If true, applies rounded corners to the textarea.
 * @param {boolean} [props.error=false] - If true, applies error styling to the textarea.
 * @param {boolean} [props.fullWidth=true] - If true, the textarea takes full width of its container.
 * @param {string} [props.className] - Additional custom CSS classes.
 * @param {string} [props.rootClassName] - Additional custom CSS classes for root element.
 * @param {ReactNode} [props.label] - Optional label for the textarea.
 * @param {string} [props.helperText] - Optional helper text displayed below the textarea.
 * @param {FormInputRef} ref - Ref forwarded to the textarea element.
 * @returns {React.ReactElement} - The rendered textarea component with custom styling and functionality.
 */

const MyTextarea = forwardRef((props: FormInputProps, ref: FormInputRef) => {
  const { t } = useTranslation();
  const {
    error = false,
    fullWidth = true,
    label,
    helperText,
    rounded,
    className,
    rootClassName,
    ...computedProps
  } = props;

  const generalStyles = [
    'appearance-none dark:bg-bg-form py-xs px-3 h-[70px] text-c-m text-text-base border-0 rounded-sm shadow-base bg-bg-field placeholder-text-muted hover:bg-bg-field-hover focus:ring-bg-brand focus:bg-bg-field focus:shadow-border-interactive-active disabled:bg-bg-disabled disabled:shadow-base disabled:text-text-disabled dark:text-text-title-dark'
  ];

  const fullWidthStyles = ['w-full'];

  const errorStyles = ['bg-bg-field shadow-custom-border-error'];

  const requiredLabelStyles = [
    `before:absolute before:right-[-10px] before:top-0 before:text-text-error before:content-['*']`
  ];

  const helperTextErrorStyles = ['text-text-error'];

  return (
    <div className={twMerge(fullWidth && fullWidthStyles, rootClassName)}>
      {label && (
        <label
          className={twMerge([
            'relative mb-1.5 inline-block text-c-m-p text-text-base',
            computedProps.required && requiredLabelStyles
          ])}
          htmlFor={computedProps.name}>
          {label}{' '}
          {!computedProps.required && (
            <span className="text-c-m-p text-text-muted">({t('Optional')})</span>
          )}
        </label>
      )}
      <textarea
        ref={ref}
        aria-invalid={true}
        {...computedProps}
        className={twMerge([
          generalStyles,
          error && errorStyles,
          fullWidth && fullWidthStyles,
          className
        ])}
      />
      {helperText && (
        <p className={twMerge(['mt-xs text-c-xs', error && helperTextErrorStyles])}>
          {' '}
          {helperText === 'undefined' ? '' : helperText}
        </p>
      )}
    </div>
  );
});

export default MyTextarea;
