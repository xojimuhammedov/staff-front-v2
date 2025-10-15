import { useEffect, useRef, ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { get } from 'lodash';

interface MyCheckboxProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'onChange'> {
  indeterminate?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
}

/**
 * `MyCheckbox` is a customizable checkbox component, extending standard HTML input functionality.
 * It supports an indeterminate state, a label, and additional styling using Tailwind CSS. Inherits
 * all standard input properties (like `type`, `value`, `onChange`) except for `ref`.
 *
 * @component
 * @param {MyCheckboxProps} props - The properties of the checkbox.
 * @param {boolean} [props.indeterminate=false] - Sets the checkbox to an indeterminate state when true.
 * @param {string} [props.label] - An optional label displayed next to the checkbox.
 * @param {string} [props.className] - Additional Tailwind CSS classes for custom styling.
 * @param {...ComponentPropsWithoutRef<'input'>} [props] - Standard HTML input properties (excluding `ref`).
 * @returns {React.ReactElement} - The rendered checkbox component with optional label and custom styling.
 */

const MyCheckbox: FC<MyCheckboxProps> = ({
  className,
  label,
  indeterminate = false,
  onChange,
  ...props
}) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (indeterminate) {
      ref.current.checked = false;
    }
    // ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div>
      <input
        ref={ref}
        type="checkbox"
        className={twMerge([
          // DEFAULT
          'h-5 w-5 rounded border-border-base bg-white text-bg-brand accent-bg-brand transition-all duration-100 ease-in-out',
          // HOVER
          'enabled:hover:bg-bg-field-hover enabled:hover:p-1 enabled:checked:hover:bg-bg-brand',
          // FOCUS
          'enabled:focus:ring-3 enabled:ring-offset-2 enabled:focus:border-2  enabled:focus:shadow-border-interactive-focus enabled:focus:ring-bg-brand',
          // DISABLED
          'disabled:pointer-events-none disabled:border-2 disabled:border-[#D8D8D8] disabled:ring-2 disabled:ring-[#D8D8D8] disabled:ring-offset-2 disabled:checked:bg-[#D8D8D8] disabled:indeterminate:bg-[#D8D8D8]',
          // CHECKED
          'checked:bg-bg-brand',
          // UNCHECKED
          '&:not(:checked):bg-bg-base',
          // hover:[&:not(:checked)]:border-bg-brand
          // INDETERMINATE
          'enabled:indeterminate:hover:bg-bg-brand '
        ])}
        {...props}
        onChange={(e) => onChange?.(e.target.checked)} 
      />
      {label && (
        <label
          htmlFor={get(props, 'id')}
          className={twMerge(['ml-2 dark:text-subtext-color-dark'], className)}>
          {label}
        </label>
      )}
    </div>
  );
};

export default MyCheckbox;
