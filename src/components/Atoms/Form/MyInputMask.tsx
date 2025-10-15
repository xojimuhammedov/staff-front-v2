import { ReactNode, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import InputMask from 'react-input-mask';

interface FormInputProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'className'> {
  rounded?: boolean;
  size?: 'small' | 'base';
  error?: boolean;
  mask?: string;
  fullWidth?: boolean;
  className?: string;
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
 * @param {string} [props.className] - Additional custom CSS classes.
 * @param {string} [props.mask] - Additional custom Input mask.
 * @param {string} [props.rootClassName] - Additional custom CSS classes for root element.
 * @param {ReactNode} [props.label] - Optional label for the input.
 * @param {ReactNode} [props.labelExtraInfo] - Optional extra info is positioned after label for the input.
 * @param {string} [props.helperText] - Optional helper text displayed below the input.
 * @param {ReactNode} [props.startIcon] - Icon displayed at the start of the input.
 * @param {ReactNode} [props.endIcon] - Icon displayed at the end of the input.
 * @param {FormInputRef} ref - Ref forwarded to the input element.
 * @returns {React.ReactElement} - The rendered input component.
 */

const MyInputMask = forwardRef((props: FormInputProps, ref: FormInputRef) => {
  const {
    error = false,
    fullWidth = true,
    size = 'base',
    rounded,
    className,
    label,
    helperText,
    startIcon,
    mask,
    endIcon,
    rootClassName,
    labelExtractInfo,
    onChange,
    ...computedProps
  }: any = props;

  const generalStyles = [
    'appearance-none dark:bg-bg-form py-xs px-3 text-c-m text-text-base border-0 rounded-sm shadow-base bg-bg-field placeholder-text-muted dark:text-text-title-dark hover:bg-bg-field-hover focus:bg-bg-field focus:ring-bg-brand focus:shadow-border-interactive-active focus:border-bg-brand disabled:bg-bg-disabled disabled:shadow-base disabled:text-text-disabled'
  ];

  const smallSize = ['h-8'];
  const baseSize = ['h-10'];
  const fullWidthStyles = ['w-full'];

  const errorStyles = ['bg-bg-field shadow-custom-border-error'];
  const requiredLabelStyles = [
    `before:absolute before:right-[-10px] before:top-0 before:text-text-error before:content-['*']`
  ];

  const helperTextErrorStyles = ['text-text-error'];

  // Oxiridagi belgini ajratamiz
  const hasStar = label?.endsWith('*'); // Yulduzcha bor-yo'qligini tekshirish
  const cleanedSurname = hasStar ? label?.slice(0, -1)?.trim() : label;

  return (
    <div className={twMerge(fullWidth && fullWidthStyles, rootClassName)}>
      {label && (
        <label
          className={twMerge([
            'relative mb-1.5 inline-block text-c-m-p text-text-base dark:text-text-title-dark',
            computedProps.required && requiredLabelStyles
          ])}
          htmlFor={computedProps.name}>
          {cleanedSurname} <span className="text-red-500">{hasStar ? '*' : ''}</span>
          {labelExtractInfo && (
            <span className="ml-1 text-c-m-p text-text-muted">({labelExtractInfo})</span>
          )}
        </label>
      )}
      <div className={'relative'}>
        {startIcon && (
          <div className="absolute left-2.5 top-2/4 -translate-y-2/4 [&>svg]:h-5 [&>svg]:w-5">
            {startIcon}
          </div>
        )}
        {endIcon && (
          <div className="absolute right-2.5 top-2/4 -translate-y-2/4 [&>svg]:h-5 [&>svg]:w-5">
            {endIcon}
          </div>
        )}
        <InputMask
          ref={ref}
          aria-invalid={true}
          onChange={onChange}
          {...computedProps}
          mask={mask}
          className={twMerge([
            generalStyles,
            size === 'base' && baseSize,
            size === 'small' && smallSize,
            error && errorStyles,
            fullWidth && fullWidthStyles,
            className,
            startIcon && 'pl-9'
          ])}
        />
      </div>
      {helperText && (
        <p className={twMerge(['mt-xs text-c-xs', error && helperTextErrorStyles])}>
          {helperText === 'undefined' ? '' : helperText}
        </p>
      )}
    </div>
  );
});

export default MyInputMask;
